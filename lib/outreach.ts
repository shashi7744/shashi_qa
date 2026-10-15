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
  author?: string; // HN username of the person who posted it
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
      author: h.author ? String(h.author) : undefined,
    });
    if (out.length >= limit) break;
  }
  return out;
}

/* ---------- Step 2: find a public contact address on the site ---------- */

/* Only addresses the company or founder published themselves: site pages, security.txt and the
   poster's own Hacker News profile. No guessing addresses, no SMTP probing, no scraping commits. */

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.[A-Z]{2,}/gi;
const JUNK =
  /(example\.|sentry|wixpress|\.(png|jpe?g|gif|webp|svg|css|js)$|noreply|no-reply|donotreply|@\dx|u003e|yourname|youremail|your-email|^(email|name|user|test|john|jane)@)/i;

async function getPage(url: string, kind: "html" | "text" = "html"): Promise<string> {
  try {
    await normalizeUrl(url); // refuses private / internal addresses
    // safeFetch re-checks every redirect hop, so a site can't bounce us to an internal address
    const res = await safeFetch(url, {}, 8000);
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.includes(kind === "html" ? "html" : "text/plain")) return "";
    return await readLimited(res, 1_500_000);
  } catch {
    return "";
  }
}

/** Cloudflare shows emails normally to visitors but stores them as data-cfemail="hex" (first byte is an XOR key). */
function decodeCfEmail(hex: string) {
  const key = parseInt(hex.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i + 1 < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  return out;
}

/** "name [at] domain [dot] com" → "name@domain.com". `loose` also accepts plain " at " / " dot ",
    which is only safe in short bios (on normal pages "meet us at example.com" would be misread). */
function deobfuscate(text: string, loose = false) {
  // plain " at " only counts when a spelled-out "dot" follows ("name at site dot com"), so "I work at stripe.com" is left alone
  const at = loose
    ? String.raw`\s*(?:[\[({<]\s*at\s*[\])}>]|\s+at\s+(?=[a-z0-9-]+\s*(?:[\[({<]\s*dot\s*[\])}>]|\s+dot\s+)))\s*`
    : String.raw`\s*[\[({<]\s*at\s*[\])}>]\s*`;
  const dot = loose ? String.raw`\s*(?:[\[({<]\s*dot\s*[\])}>]|\s+dot\s+)\s*` : String.raw`\s*[\[({<]\s*dot\s*[\])}>]\s*`;
  return text
    .replace(new RegExp(String.raw`([a-z0-9._%+-]+)${at}([a-z0-9-]+)`, "gi"), "$1@$2")
    .replace(new RegExp(String.raw`(@[a-z0-9.-]+?)${dot}([a-z]{2,})`, "gi"), "$1.$2")
    .replace(new RegExp(String.raw`(@[a-z0-9.-]+?)${dot}([a-z]{2,})`, "gi"), "$1.$2");
}

function addEmail(found: Map<string, string>, raw: string, source: string) {
  const e = raw.trim().replace(/^mailto:/i, "").split("?")[0].replace(/[.,;:]+$/, "").toLowerCase();
  if (e.length > 80 || !/^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(e) || JUNK.test(e)) return;
  if (!found.has(e)) found.set(e, source);
}

function collectEmails(html: string, source: string, found: Map<string, string>, loose = false) {
  if (!html) return;
  const $ = cheerio.load(html);
  $('a[href^="mailto:" i]').each((_, el) => addEmail(found, $(el).attr("href") || "", source));
  $("[data-cfemail]").each((_, el) => addEmail(found, decodeCfEmail($(el).attr("data-cfemail") || ""), source));
  $('a[href*="/cdn-cgi/l/email-protection#"]').each((_, el) =>
    addEmail(found, decodeCfEmail(($(el).attr("href") || "").split("#")[1] || ""), source)
  );
  $("script, style, noscript").remove();
  const text = deobfuscate($.root().text(), loose); // .text() also decodes &#64; style entities
  for (const m of text.match(EMAIL_RE) || []) addEmail(found, m, source);
  for (const m of html.match(EMAIL_RE) || []) addEmail(found, m, source); // e.g. JSON-LD "email" fields
}

const PAGE_HINTS: [RegExp, string][] = [
  [/contact/i, "contact page"],
  [/support|help/i, "support page"],
  [/about|team|company/i, "about page"],
  [/privacy/i, "privacy policy"],
  [/terms|legal|imprint|impressum/i, "legal page"],
];

export interface Contacts {
  emails: string[];
  emailSources?: Record<string, string>;
  business?: Business;
  contactPage?: string;
  socials: string[];
}

export async function findContacts(siteUrl: string, hnUser?: string): Promise<Contacts> {
  const base = new URL(siteUrl);
  const home = await getPage(siteUrl);
  const found = new Map<string, string>();
  const socials = new Set<string>();
  const pages = new Map<string, string>(); // url -> label
  let contactPage: string | undefined;

  collectEmails(home, "homepage", found);

  const $ = cheerio.load(home);
  $("a[href]").each((_, el) => {
    try {
      const u = new URL($(el).attr("href") || "", base);
      u.hash = "";
      if (/(twitter\.com|x\.com|linkedin\.com)\//i.test(u.href)) socials.add(u.href);
      if (u.host !== base.host || pages.has(u.href) || u.href === base.href) return;
      const hint = PAGE_HINTS.find(([re]) => re.test(u.pathname + " " + $(el).text()));
      if (!hint) return;
      pages.set(u.href, hint[1]);
      if (!contactPage && /contact|support/.test(hint[1])) contactPage = u.href;
    } catch {}
  });
  for (const [path, label] of [["/contact", "contact page"], ["/about", "about page"], ["/privacy", "privacy policy"]]) {
    const u = new URL(path, base).href;
    if (![...pages.values()].includes(label)) pages.set(u, label);
  }
  if (!contactPage) contactPage = [...pages].find(([, l]) => l === "about page")?.[0];

  const hnProfile = async () => {
    if (!hnUser || !/^[A-Za-z0-9_-]{2,15}$/.test(hnUser)) return;
    try {
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/user/${hnUser}.json`, { signal: AbortSignal.timeout(6000) });
      const about: string = (await res.json())?.about || "";
      collectEmails(`<p>${about}</p>`, `HN profile (${hnUser})`, found, true);
    } catch {}
  };

  const security = async () => {
    const txt = await getPage(new URL("/.well-known/security.txt", base).href, "text");
    for (const m of txt.match(/^contact:\s*mailto:\S+/gim) || []) addEmail(found, m.replace(/^contact:\s*/i, ""), "security.txt");
  };

  await Promise.all([
    ...[...pages].slice(0, 6).map(async ([url, label]) => collectEmails(await getPage(url), label, found)),
    security(),
    hnProfile(),
  ]);

  // Addresses on the company's own domain first, then anything else (e.g. a founder's Gmail)
  const domain = base.hostname.replace(/^www\./, "");
  const own = (e: string) => {
    const d = e.split("@")[1];
    return d === domain || d.endsWith("." + domain) || domain.endsWith("." + d);
  };
  const emails = [...found.keys()].sort((a, b) => Number(own(b)) - Number(own(a))).slice(0, 5);

  return {
    business: businessSignals(home, siteUrl, emails.some(own)),
    emails,
    emailSources: Object.fromEntries(emails.map((e) => [e, found.get(e)!])),
    contactPage,
    socials: [...socials].slice(0, 3),
  };
}

/* ---------- Step 2b: is this a real business that could pay? ---------- */

export interface Business {
  score: number; // 0-100
  label: "Business" | "Maybe" | "Hobby";
  signals: string[]; // what we saw, shown in the admin
  flow: string; // the flow worth offering to test
}

const FREE_HOSTS = /\.(github\.io|vercel\.app|netlify\.app|pages\.dev|herokuapp\.com|onrender\.com|glitch\.me|replit\.app|surge\.sh|web\.app|firebaseapp\.com)$/i;

/** Looks for signs that money changes hands: prices, checkout, app store listings, sign-up, a team. */
export function businessSignals(html: string, siteUrl: string, ownDomainEmail: boolean): Business {
  const $ = cheerio.load(html || "");
  const links = $("a[href]")
    .map((_, el) => `${$(el).attr("href")} ${$(el).text()}`.toLowerCase())
    .get()
    .join("\n");
  $("script, style, noscript").remove();
  const text = $.root().text().toLowerCase();
  const scripts = (html || "").toLowerCase();

  const checks: [boolean, number, string][] = [
    [/pricing|\/plans|upgrade|buy now|subscribe|checkout|add to cart|free trial|start trial/.test(links + text), 30, "Pricing or checkout"],
    [/[$€£₹]\s?\d|\d\s?(usd|eur|inr)\b|\/\s?mo(nth)?\b|per month/.test(text), 15, "Shows prices"],
    [/stripe\.com|js\.stripe|paddle|lemonsqueezy|gumroad|razorpay|chargebee|shopify/.test(scripts), 30, "Takes payments"],
    [/apps\.apple\.com|play\.google\.com/.test(links), 15, "App store app"],
    [/log ?in|sign ?in|sign ?up|register|create account|get started|dashboard/.test(links), 15, "Sign-up / login"],
    [/careers|jobs|we.?re hiring|\/team|our team/.test(links + text), 10, "Has a team / hiring"],
    [/terms|privacy/.test(links), 5, "Terms / privacy pages"],
    [ownDomainEmail, 5, "Email on own domain"],
  ];
  let score = checks.reduce((s, [hit, pts]) => s + (hit ? pts : 0), 0);
  const signals = checks.filter(([hit]) => hit).map(([, , label]) => label);
  if (FREE_HOSTS.test(new URL(siteUrl).hostname)) {
    score -= 15;
    signals.push("On a free hosting subdomain");
  }
  score = Math.max(0, Math.min(100, score));

  const flow = checks[0][0] || checks[2][0]
    ? "sign-up and checkout flow"
    : checks[3][0]
    ? "app on real iPhone and Android devices"
    : checks[4][0]
    ? "sign-up and onboarding flow"
    : "main user flow";
  return { score, label: score >= 45 ? "Business" : score >= 20 ? "Maybe" : "Hobby", signals, flow };
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

export interface Signer {
  name: string;
  email: string;
  site: string;
}

/** The admin refuses to send while this is still in the draft. */
export const BUG_PLACEHOLDER =
  "[YOUR BUG HERE: what you did → what happened → what you expected. Attach a screenshot or short screen recording.]";

function templateDraft(report: Report, product: string, me: Signer, flow: string): Draft {
  const host = new URL(report.finalUrl).hostname;
  const extras = topIssues(report, 2).map((i) => `- ${i.title}: ${i.detail}`).join("\n");
  return {
    subject: `Found a bug on ${host}`,
    body: `Hi,

I tried ${product || host} and ran into this:

${BUG_PLACEHOLDER}

I'm a software tester and help startups catch issues like this before their users do. Happy to test your ${flow} for free and send you a clear bug report with steps and screenshots.
${extras ? `\nTwo smaller things my automated scan picked up, in case they're useful:\n${extras}\n` : ""}
${me.name}
Software Tester
${me.email} · ${me.site}`,
    aiWritten: false,
  };
}

export async function draftMessage(report: Report, product: string, me: Signer, flow = "main user flow"): Promise<Draft> {
  const key = process.env.ANTHROPIC_API_KEY;
  const fallback = () => templateDraft(report, product, me, flow);
  if (!key) return fallback();

  const host = new URL(report.finalUrl).hostname;
  const facts = topIssues(report, 3).map((i) => `- [${i.status}] ${i.cat} / ${i.title}: ${i.detail}`).join("\n");
  const prompt = `You write short, honest cold emails for ${me.name}, a freelance software tester (${me.site}).

The recipient runs "${product || host}" (${report.finalUrl}). ${me.name} will test the site by hand and paste one real bug into the email.
An automated scan also found these smaller issues:
${facts}

Write an email that:
- opens with "I tried ${product || host} and ran into this:" followed by a blank line and then this exact line, unchanged: ${BUG_PLACEHOLDER}
- then offers, with no pressure, a free test of their ${flow} with a clear bug report,
- optionally mentions at most 2 of the scan issues in plain words as a short "smaller things" list,
- is under 120 words, friendly, no hype, no fake compliments, no emojis, and does not invent features or bugs,
- signs off with exactly these lines: "${me.name}", "Software Tester", "${me.email} · ${me.site}".

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
    if (!res.ok) return fallback();
    const data = await res.json();
    const text: string = data.content?.find((b: { type: string }) => b.type === "text")?.text || "";
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    // the draft must keep the spot for your own bug, otherwise use the template
    if (!json.subject || !json.body || !String(json.body).includes("[YOUR BUG HERE")) return fallback();
    return { subject: String(json.subject), body: String(json.body), aiWritten: true };
  } catch {
    return fallback();
  }
}

export { topIssues };
