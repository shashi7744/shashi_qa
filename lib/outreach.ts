import * as cheerio from "cheerio";
import { createHash, timingSafeEqual } from "node:crypto";
import { normalizeUrl, readLimited, safeFetch, type Report } from "./checker";

/* ---------- Admin auth ---------- */

/* Slows down password guessing: 5 wrong tries locks that visitor out for 15 minutes.
   Kept in memory, so it resets when the server restarts. */
const failures = new Map<string, { count: number; until: number }>();

function sameSecret(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkAdmin(req: Request): string | null {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return "Set ADMIN_PASSWORD in your environment variables to use the agent.";
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const f = failures.get(ip);
  if (f && f.until > Date.now()) return "Too many wrong passwords. Try again in 15 minutes.";
  if (!sameSecret(req.headers.get("x-admin-key") || "", expected)) {
    const count = (f && f.until > 0 && f.until <= Date.now() ? 0 : f?.count || 0) + 1;
    failures.set(ip, { count, until: count >= 5 ? Date.now() + 15 * 60_000 : 0 });
    return "Wrong password.";
  }
  failures.delete(ip);
  return null;
}

/* ---------- Step 1: find newly launched products ---------- */

export interface Launch {
  url: string;
  title: string;
  source: string;
  postedAt: string;
  discussion?: string;
}

const SKIP_HOSTS = [
  "github.com", "gitlab.com", "youtube.com", "youtu.be", "twitter.com", "x.com", "medium.com",
  "substack.com", "reddit.com", "news.ycombinator.com", "apps.apple.com", "play.google.com",
  "chromewebstore.google.com", "npmjs.com", "pypi.org", "huggingface.co", "arxiv.org", "docs.google.com",
];

/** New "Show HN" launches: founders posting their own product. Free API, no key needed. */
export async function findLaunches(limit = 40): Promise<Launch[]> {
  let res: Response;
  try {
    res = await fetch(
      `https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=${Math.min(limit * 2, 100)}`,
      { headers: { "User-Agent": "ShashiQA-LeadAgent/1.0" } }
    );
  } catch {
    throw new Error("Couldn't reach Hacker News right now. Try again in a minute, or paste websites instead.");
  }
  if (!res.ok) throw new Error(`Couldn't load new launches (HTTP ${res.status}).`);
  const data = await res.json();
  const seen = new Set<string>();
  const out: Launch[] = [];
  for (const h of data.hits ?? []) {
    if (!h.url) continue;
    let host = "";
    try {
      host = new URL(h.url).hostname.replace(/^www\./, "");
    } catch {
      continue;
    }
    if (SKIP_HOSTS.some((s) => host === s || host.endsWith("." + s)) || seen.has(host)) continue;
    seen.add(host);
    out.push({
      url: h.url,
      title: String(h.title || "").replace(/^Show HN:\s*/i, ""),
      source: "Show HN",
      postedAt: h.created_at,
      discussion: `https://news.ycombinator.com/item?id=${h.objectID}`,
    });
    if (out.length >= limit) break;
  }
  return out;
}

/* ---------- Step 2: find a public contact address on the site ---------- */

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const JUNK = /(example\.|sentry|wixpress|\.png|\.jpg|\.webp|\.svg|noreply|no-reply|@2x)/i;

async function getHtml(url: string): Promise<string> {
  try {
    await normalizeUrl(url); // refuses private / internal addresses
    // safeFetch re-checks every redirect hop, so a site can't bounce us to an internal address
    const res = await safeFetch(url, {}, 8000);
    if (!res.ok || !(res.headers.get("content-type") || "").includes("html")) return "";
    return await readLimited(res, 1_500_000);
  } catch {
    return "";
  }
}

export interface Contacts {
  emails: string[];
  contactPage?: string;
  socials: string[];
}

export async function findContacts(siteUrl: string): Promise<Contacts> {
  const home = await getHtml(siteUrl);
  const $ = cheerio.load(home);
  const emails = new Set<string>();
  const socials = new Set<string>();
  let contactPage: string | undefined;

  $('a[href^="mailto:"]').each((_, el) => {
    const e = ($(el).attr("href") || "").replace(/^mailto:/i, "").split("?")[0].trim();
    if (e && !JUNK.test(e)) emails.add(e.toLowerCase());
  });
  (home.match(EMAIL_RE) || []).forEach((e) => !JUNK.test(e) && emails.add(e.toLowerCase()));

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().toLowerCase();
    try {
      const u = new URL(href, siteUrl);
      if (/(twitter\.com|x\.com|linkedin\.com)\//i.test(u.href)) socials.add(u.href);
      if (!contactPage && u.host === new URL(siteUrl).host && /(contact|about|support)/i.test(u.pathname + " " + text)) {
        contactPage = u.href;
      }
    } catch {}
  });

  if (!emails.size && contactPage) {
    const html = await getHtml(contactPage);
    (html.match(EMAIL_RE) || []).forEach((e) => !JUNK.test(e) && emails.add(e.toLowerCase()));
  }

  return { emails: [...emails].slice(0, 3), contactPage, socials: [...socials].slice(0, 3) };
}

/* ---------- Step 3: draft a personal message ---------- */

export interface Draft {
  subject: string;
  body: string;
  aiWritten: boolean;
}

function topIssues(report: Report, n = 4) {
  return report.categories
    .flatMap((c) => c.items.filter((i) => i.status !== "pass").map((i) => ({ ...i, cat: c.label })))
    .sort((a, b) => (a.status === "fail" ? 0 : 1) - (b.status === "fail" ? 0 : 1))
    .filter((i) => !i.id.startsWith("perf-na"))
    .slice(0, n);
}

function templateDraft(report: Report, product: string, me: { name: string; site: string }): Draft {
  const host = new URL(report.finalUrl).hostname;
  const issues = topIssues(report, 3);
  const list = issues.map((i, k) => `${k + 1}. ${i.title}: ${i.detail}`).join("\n");
  return {
    subject: `${issues.length} things I noticed on ${host}`,
    body: `Hi,

Congrats on launching ${product || host}! I'm a QA tester and ran a quick check on ${host}. A few things stood out:

${list}

Happy to send the full report. I also do a free manual test of one key flow (like sign-up or checkout) on real phones and browsers, if that's useful before your next release.

${me.name}
${me.site}`,
    aiWritten: false,
  };
}

export async function draftMessage(report: Report, product: string, me: { name: string; site: string }): Promise<Draft> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return templateDraft(report, product, me);

  const host = new URL(report.finalUrl).hostname;
  const facts = topIssues(report, 5).map((i) => `- [${i.status}] ${i.cat} / ${i.title}: ${i.detail}`).join("\n");
  const prompt = `You write short, honest cold emails for ${me.name}, a freelance software tester (${me.site}).

The recipient just launched "${product || host}" (${report.finalUrl}). An automated check found these real issues:
${facts}
Overall score: ${report.overall}/100.

Write an email that:
- opens with one specific line about their product (use only the product name and site; do not invent features),
- mentions the 2 or 3 most important issues above in plain words, with why they matter to users,
- offers a free manual test of one key flow, with no pressure,
- is under 120 words, friendly, no hype, no fake compliments, no emojis,
- signs off as ${me.name} with the site link.

Reply with ONLY JSON: {"subject": "...", "body": "..."}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return templateDraft(report, product, me);
    const data = await res.json();
    const text: string = data.content?.find((b: { type: string }) => b.type === "text")?.text || "";
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    if (!json.subject || !json.body) return templateDraft(report, product, me);
    return { subject: String(json.subject), body: String(json.body), aiWritten: true };
  } catch {
    return templateDraft(report, product, me);
  }
}

export { topIssues };
