import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";
import net from "node:net";

/* ---------- Types ---------- */

export type Status = "pass" | "warn" | "fail";

export interface CheckItem {
  id: string;
  title: string;
  status: Status;
  detail: string;
}

export interface Category {
  key: "performance" | "seo" | "accessibility" | "security" | "links";
  label: string;
  score: number | null; // 0-100, null if unavailable
  items: CheckItem[];
}

export interface Report {
  url: string;
  finalUrl: string;
  checkedAt: string;
  overall: number;
  responseMs: number;
  pageTitle: string;
  categories: Category[];
  metrics: { label: string; value: string; status: Status }[];
  pagespeed: "ok" | "unavailable";
  summary: string;
  topFixes: string[];
  aiWritten: boolean;
  browser?: BrowserFindings;
}

/** What Google's real Chrome run (Lighthouse, mobile) saw while loading the page. */
export interface BrowserFindings {
  consoleErrors: { message: string; source: string; firstParty: boolean }[];
  failedRequests: { url: string; status: number; type: string; firstParty: boolean }[];
  lcpMs: number | null;
  cls: number | null;
  a11yFailures: string[];
}

const UA = "ShashiQA-WebsiteCheck/1.0 (+https://shashi.qa/check)";

/* ---------- URL safety (only public websites) ---------- */

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 10 || a === 127 || a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }
  const v = ip.toLowerCase();
  if (v.startsWith("::ffff:")) return isPrivateIp(v.slice(7));
  return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
}

export async function normalizeUrl(input: string): Promise<URL> {
  let raw = input.trim();
  if (!raw) throw new UserError("Enter a website address.");
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new UserError("That doesn't look like a website address. Try something like example.com");
  }
  if (!["http:", "https:"].includes(url.protocol)) throw new UserError("Only http and https websites can be checked.");
  if (url.username || url.password) throw new UserError("Remove the username and password from the address.");
  if (!url.hostname.includes(".")) throw new UserError("Enter a full domain, like example.com");

  if (process.env.CHECK_ALLOW_PRIVATE !== "1") {
    try {
      const addrs = await lookup(url.hostname, { all: true });
      if (addrs.some((a) => isPrivateIp(a.address))) throw new UserError("Only public websites can be checked.");
    } catch (e) {
      if (e instanceof UserError) throw e;
      throw new UserError(`We couldn't find ${url.hostname}. Check the spelling and try again.`);
    }
  }
  return url;
}

export class UserError extends Error {}

/* ---------- Fetch helpers ---------- */

async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, headers: { "User-Agent": UA, ...(init.headers || {}) } });
  } finally {
    clearTimeout(t);
  }
}

async function assertPublicHost(hostname: string) {
  if (process.env.CHECK_ALLOW_PRIVATE === "1") return;
  const h = hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(h)) {
    if (isPrivateIp(h)) throw new UserError("Only public websites can be checked.");
    return;
  }
  const addrs = await lookup(h, { all: true });
  if (addrs.some((a) => isPrivateIp(a.address))) throw new UserError("Only public websites can be checked.");
}

/* Follows redirects by hand so every hop is checked to be a public address. */
export async function safeFetch(url: string, init: RequestInit = {}, ms = 10000, maxHops = 5): Promise<Response> {
  let current = url;
  for (let hop = 0; hop <= maxHops; hop++) {
    const u = new URL(current);
    if (!["http:", "https:"].includes(u.protocol)) throw new UserError("Redirected to an unsupported address.");
    await assertPublicHost(u.hostname);
    const res = await fetchWithTimeout(current, { ...init, redirect: "manual" }, ms);
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      current = new URL(loc, current).href;
      continue;
    }
    Object.defineProperty(res, "url", { value: current });
    return res;
  }
  throw new UserError("The site redirects too many times.");
}

export async function readLimited(res: Response, maxBytes = 2_000_000): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    total += value.length;
    chunks.push(value);
    if (total > maxBytes) {
      await reader.cancel();
      break;
    }
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/* ---------- Page checks ---------- */

interface PageResult {
  finalUrl: string;
  responseMs: number;
  title: string;
  seo: CheckItem[];
  accessibility: CheckItem[];
  security: CheckItem[];
  links: CheckItem[];
}

async function checkPage(url: URL): Promise<PageResult> {
  const start = Date.now();
  let res: Response;
  try {
    res = await safeFetch(url.href, {}, 15000);
  } catch (e) {
    if (e instanceof UserError) throw e;
    throw new UserError(`${url.hostname} didn't respond within 15 seconds. Is the site online?`);
  }
  const responseMs = Date.now() - start;
  if (!res.ok) throw new UserError(`${url.hostname} returned an error (HTTP ${res.status}).`);
  const type = res.headers.get("content-type") || "";
  if (!type.includes("html")) throw new UserError("That address isn't a web page. Enter your website's home page.");
  const html = await readLimited(res);
  const finalUrl = res.url || url.href;
  const $ = cheerio.load(html);

  /* SEO */
  const seo: CheckItem[] = [];
  const title = $("title").first().text().trim();
  seo.push(
    !title
      ? { id: "title", title: "Page title", status: "fail", detail: "No <title> tag. Google shows this as the headline in search results." }
      : title.length < 15 || title.length > 65
      ? { id: "title", title: "Page title", status: "warn", detail: `Title is ${title.length} characters ("${title.slice(0, 70)}"). Aim for 15–65.` }
      : { id: "title", title: "Page title", status: "pass", detail: `"${title}"` }
  );
  const desc = $('meta[name="description"]').attr("content")?.trim() || "";
  seo.push(
    !desc
      ? { id: "desc", title: "Meta description", status: "fail", detail: "Missing. Search engines will pick random text from the page instead." }
      : desc.length < 50 || desc.length > 170
      ? { id: "desc", title: "Meta description", status: "warn", detail: `${desc.length} characters. Aim for 50–160.` }
      : { id: "desc", title: "Meta description", status: "pass", detail: `${desc.length} characters.` }
  );
  const h1s = $("h1").length;
  seo.push(
    h1s === 1
      ? { id: "h1", title: "Main heading (H1)", status: "pass", detail: `"${$("h1").first().text().trim().slice(0, 80)}"` }
      : h1s === 0
      ? { id: "h1", title: "Main heading (H1)", status: "fail", detail: "No H1 heading found on the page." }
      : { id: "h1", title: "Main heading (H1)", status: "warn", detail: `${h1s} H1 headings found. Use one per page.` }
  );
  const canonical = $('link[rel="canonical"]').attr("href");
  seo.push(
    canonical
      ? { id: "canonical", title: "Canonical link", status: "pass", detail: canonical }
      : { id: "canonical", title: "Canonical link", status: "warn", detail: "Missing. Helps Google avoid duplicate versions of your pages." }
  );
  const og = $('meta[property="og:title"]').length && $('meta[property="og:image"]').length;
  seo.push(
    og
      ? { id: "og", title: "Social share preview", status: "pass", detail: "og:title and og:image are set." }
      : { id: "og", title: "Social share preview", status: "warn", detail: "Missing og:title or og:image. Links shared on WhatsApp, LinkedIn or X will look plain." }
  );
  const viewport = $('meta[name="viewport"]').attr("content");
  seo.push(
    viewport?.includes("width=device-width")
      ? { id: "viewport", title: "Mobile viewport", status: "pass", detail: "Page is set up for mobile screens." }
      : { id: "viewport", title: "Mobile viewport", status: "fail", detail: "No mobile viewport tag. The page will look zoomed-out on phones." }
  );

  /* Accessibility basics */
  const accessibility: CheckItem[] = [];
  const imgs = $("img");
  const noAlt = imgs.filter((_, el) => $(el).attr("alt") === undefined).length;
  accessibility.push(
    imgs.length === 0
      ? { id: "alt", title: "Image alt text", status: "pass", detail: "No images found on this page." }
      : noAlt === 0
      ? { id: "alt", title: "Image alt text", status: "pass", detail: `All ${imgs.length} images have alt text.` }
      : { id: "alt", title: "Image alt text", status: noAlt / imgs.length > 0.3 ? "fail" : "warn", detail: `${noAlt} of ${imgs.length} images ${noAlt === 1 ? "has" : "have"} no alt text. Screen readers can't describe them.` }
  );
  const lang = $("html").attr("lang");
  accessibility.push(
    lang
      ? { id: "lang", title: "Page language", status: "pass", detail: `lang="${lang}"` }
      : { id: "lang", title: "Page language", status: "warn", detail: "The <html> tag has no lang attribute." }
  );
  const inputs = $("input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea");
  const unlabeled = inputs.filter((_, el) => {
    const id = $(el).attr("id");
    return !$(el).attr("aria-label") && !$(el).attr("aria-labelledby") && !(id && $(`label[for="${id}"]`).length) && !$(el).parents("label").length;
  }).length;
  if (inputs.length) {
    accessibility.push(
      unlabeled === 0
        ? { id: "labels", title: "Form labels", status: "pass", detail: `All ${inputs.length} form fields have labels.` }
        : { id: "labels", title: "Form labels", status: "warn", detail: `${unlabeled} of ${inputs.length} form field${inputs.length === 1 ? "" : "s"} ${unlabeled === 1 ? "has" : "have"} no label.` }
    );
  }
  const emptyLinks = $("a").filter((_, el) => !$(el).text().trim() && !$(el).attr("aria-label") && !$(el).find("img[alt]").length).length;
  accessibility.push(
    emptyLinks === 0
      ? { id: "linktext", title: "Link text", status: "pass", detail: "Every link has readable text." }
      : { id: "linktext", title: "Link text", status: "warn", detail: `${emptyLinks} link${emptyLinks === 1 ? " has" : "s have"} no text or label (often icon-only links).` }
  );

  /* Security */
  const security: CheckItem[] = [];
  const https = finalUrl.startsWith("https://");
  security.push(
    https
      ? { id: "https", title: "HTTPS", status: "pass", detail: "The site loads over a secure connection." }
      : { id: "https", title: "HTTPS", status: "fail", detail: "The site isn't using HTTPS. Browsers will mark it \"Not secure\"." }
  );
  const h = res.headers;
  const headerChecks: [string, string, string][] = [
    ["strict-transport-security", "HSTS header", "Forces browsers to always use HTTPS."],
    ["content-security-policy", "Content Security Policy", "Limits which scripts can run, reducing XSS risk."],
    ["x-content-type-options", "X-Content-Type-Options", "Stops browsers guessing file types."],
    ["referrer-policy", "Referrer-Policy", "Controls what URL info is shared with other sites."],
  ];
  for (const [name, label, why] of headerChecks) {
    security.push(
      h.get(name)
        ? { id: name, title: label, status: "pass", detail: "Set." }
        : { id: name, title: label, status: "warn", detail: `Missing. ${why}` }
    );
  }
  const frameOk = h.get("x-frame-options") || (h.get("content-security-policy") || "").includes("frame-ancestors");
  security.push(
    frameOk
      ? { id: "frame", title: "Clickjacking protection", status: "pass", detail: "Set." }
      : { id: "frame", title: "Clickjacking protection", status: "warn", detail: "Missing X-Frame-Options. Other sites could embed yours in a frame." }
  );
  const mixed = https ? $('img[src^="http://"], script[src^="http://"], link[href^="http://"][rel="stylesheet"]').length : 0;
  if (mixed) security.push({ id: "mixed", title: "Mixed content", status: "fail", detail: `${mixed} files load over insecure http:// on a secure page.` });

  /* Links */
  const links: CheckItem[] = [];
  const base = new URL(finalUrl);
  const hrefs = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")!;
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return;
    try {
      const u = new URL(href, base);
      if (!["http:", "https:"].includes(u.protocol)) return;
      u.hash = "";
      hrefs.add(u.href);
    } catch {}
  });
  $("img[src]").each((_, el) => {
    try {
      const u = new URL($(el).attr("src")!, base);
      if (u.protocol.startsWith("http")) hrefs.add(u.href);
    } catch {}
  });
  const toCheck = [...hrefs].slice(0, 40);
  const broken: string[] = [];
  await Promise.all(
    toCheck.map(async (href) => {
      try {
        let r = await safeFetch(href, { method: "HEAD" }, 7000);
        if (r.status === 405 || r.status === 403 || r.status === 501) r = await safeFetch(href, { method: "GET" }, 7000);
        if (r.status === 404 || r.status === 410 || r.status >= 500) broken.push(`${href} (HTTP ${r.status})`);
      } catch {
        /* timeouts or blocked bots are not counted as broken */
      }
    })
  );
  links.push(
    broken.length === 0
      ? { id: "broken", title: "Broken links & images", status: "pass", detail: `Checked ${toCheck.length} links and images. None are broken.` }
      : { id: "broken", title: "Broken links & images", status: broken.length > 2 ? "fail" : "warn", detail: `${broken.length} of ${toCheck.length} are broken: ${broken.slice(0, 5).join(", ")}${broken.length > 5 ? "…" : ""}` }
  );
  links.push(
    responseMs < 800
      ? { id: "ttfb", title: "Server response", status: "pass", detail: `Page responded in ${responseMs} ms.` }
      : responseMs < 2000
      ? { id: "ttfb", title: "Server response", status: "warn", detail: `Page took ${responseMs} ms to respond. Under 800 ms is good.` }
      : { id: "ttfb", title: "Server response", status: "fail", detail: `Page took ${(responseMs / 1000).toFixed(1)} s to respond. Visitors may leave before it loads.` }
  );

  return { finalUrl, responseMs, title, seo, accessibility, security, links };
}

/* ---------- Google PageSpeed (Lighthouse) ---------- */

interface PsiResult {
  scores: Record<string, number>;
  metrics: { label: string; value: string; status: Status }[];
  opportunities: CheckItem[];
  browser: BrowserFindings;
}

/* Third-party noise that says nothing about the site's own quality */
const NOISE = /favicon|chrome-extension|ERR_BLOCKED_BY_CLIENT|google-analytics|googletagmanager|doubleclick|facebook\.net|hotjar|clarity\.ms|sentry|intercom|crisp\.chat/i;

function browserFindings(a: Record<string, any>, pageUrl: string): BrowserFindings {
  const site = new URL(pageUrl).hostname.replace(/^www\./, "");
  const firstParty = (u: string) => {
    try {
      const h = new URL(u).hostname;
      return h === site || h.endsWith("." + site);
    } catch {
      return true; // inline scripts and relative sources belong to the page itself
    }
  };
  const consoleErrors = ((a["errors-in-console"]?.details?.items as any[]) || [])
    .map((i) => {
      const source = String(i.sourceLocation?.url || i.url || "");
      return { message: String(i.description || "").slice(0, 220), source, firstParty: !source || firstParty(source) };
    })
    .filter((e) => e.message && !NOISE.test(e.message + " " + e.source))
    .slice(0, 8);
  const failedRequests = ((a["network-requests"]?.details?.items as any[]) || [])
    .filter((r) => Number(r.statusCode) >= 400 && !NOISE.test(String(r.url)))
    .map((r) => ({ url: String(r.url).slice(0, 200), status: Number(r.statusCode), type: String(r.resourceType || ""), firstParty: firstParty(String(r.url)) }))
    .slice(0, 8);
  const a11yFailures = ["color-contrast", "button-name", "link-name", "label", "image-alt", "tap-targets", "target-size"]
    .filter((id) => a[id] && a[id].score === 0)
    .map((id) => String(a[id].title));
  const num = (id: string) => (typeof a[id]?.numericValue === "number" ? a[id].numericValue : null);
  return { consoleErrors, failedRequests, lcpMs: num("largest-contentful-paint"), cls: num("cumulative-layout-shift"), a11yFailures };
}

async function runPageSpeed(url: string): Promise<PsiResult | null> {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", "mobile");
  for (const c of ["performance", "accessibility", "best-practices", "seo"]) api.searchParams.append("category", c);
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  try {
    const res = await fetchWithTimeout(api.href, {}, 50000);
    if (!res.ok) return null;
    const data = await res.json();
    const lh = data.lighthouseResult;
    const cats = lh.categories;
    const scores: Record<string, number> = {};
    for (const k of Object.keys(cats)) scores[k] = Math.round((cats[k].score ?? 0) * 100);
    const a = lh.audits;
    const metric = (id: string, label: string) => {
      const m = a[id];
      if (!m) return null;
      const s: Status = m.score >= 0.9 ? "pass" : m.score >= 0.5 ? "warn" : "fail";
      return { label, value: m.displayValue || "-", status: s };
    };
    const metrics = [
      metric("largest-contentful-paint", "Largest Contentful Paint"),
      metric("first-contentful-paint", "First Contentful Paint"),
      metric("total-blocking-time", "Total Blocking Time"),
      metric("cumulative-layout-shift", "Layout Shift (CLS)"),
      metric("speed-index", "Speed Index"),
    ].filter(Boolean) as PsiResult["metrics"];
    const opportunities: CheckItem[] = Object.values(a as Record<string, any>)
      .filter((x) => x.details?.type === "opportunity" && x.score !== null && x.score < 0.9 && x.details.overallSavingsMs > 100)
      .sort((x, y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
      .slice(0, 5)
      .map((x) => ({
        id: x.id,
        title: x.title,
        status: (x.score < 0.5 ? "fail" : "warn") as Status,
        detail: `Could save about ${(x.details.overallSavingsMs / 1000).toFixed(1)} s on mobile.`,
      }));
    return { scores, metrics, opportunities, browser: browserFindings(a, lh.finalDisplayedUrl || lh.finalUrl || url) };
  } catch {
    return null;
  }
}

/* ---------- Scoring ---------- */

function scoreItems(items: CheckItem[]): number {
  if (!items.length) return 100;
  const pts = items.reduce((s, i) => s + (i.status === "pass" ? 1 : i.status === "warn" ? 0.5 : 0), 0);
  return Math.round((pts / items.length) * 100);
}

/* ---------- Summary (AI or rule-based) ---------- */

function ruleSummary(r: Omit<Report, "summary" | "topFixes" | "aiWritten">) {
  const all = r.categories.flatMap((c) => c.items.map((i) => ({ ...i, cat: c.label })));
  const fails = all.filter((i) => i.status === "fail");
  const warns = all.filter((i) => i.status === "warn");
  const verdict =
    r.overall >= 85 ? "in good shape" : r.overall >= 65 ? "doing okay, with some clear things to fix" : "losing visitors to problems that are fixable";
  const summary = `Your site scored ${r.overall}/100 and is ${verdict}. We found ${fails.length} critical issue${fails.length === 1 ? "" : "s"} and ${warns.length} smaller improvement${warns.length === 1 ? "" : "s"} across performance, SEO, accessibility, security and links.`;
  const topFixes = [...fails, ...warns].slice(0, 3).map((i) => `${i.title}: ${i.detail}`);
  return { summary, topFixes };
}

async function aiSummary(r: Omit<Report, "summary" | "topFixes" | "aiWritten">) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const compact = {
    url: r.finalUrl,
    overall: r.overall,
    categories: r.categories.map((c) => ({
      name: c.label,
      score: c.score,
      issues: c.items.filter((i) => i.status !== "pass").map((i) => `${i.status.toUpperCase()}: ${i.title} - ${i.detail}`),
    })),
    metrics: r.metrics,
  };
  const prompt = `You are a friendly senior QA tester writing a short website health report for a small business owner who is not technical.

Here are automated check results as JSON:
${JSON.stringify(compact)}

Reply with ONLY valid JSON in this shape:
{"summary": "2-3 plain-English sentences on the overall state of the site and what it means for visitors and sales", "topFixes": ["fix 1", "fix 2", "fix 3"]}

Rules: topFixes are the three changes with the biggest impact, most important first, each one sentence that says what to do and why it matters. No jargon without a short explanation. Don't invent problems that aren't in the data.`;
  try {
    const res = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "claude-haiku-4-5-20251001",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }],
        }),
      },
      30000
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text: string = data.content?.find((b: any) => b.type === "text")?.text || "";
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    if (typeof json.summary !== "string" || !Array.isArray(json.topFixes)) return null;
    return { summary: json.summary, topFixes: json.topFixes.slice(0, 3).map(String) };
  } catch {
    return null;
  }
}

/* ---------- Main ---------- */

export async function runCheck(input: string): Promise<Report> {
  const url = await normalizeUrl(input);
  const [page, psi] = await Promise.all([checkPage(url), runPageSpeed(url.href)]);

  const perfItems: CheckItem[] = psi?.opportunities.length
    ? psi.opportunities
    : psi
    ? [{ id: "perf-ok", title: "Loading speed", status: "pass", detail: "No major speed problems found." }]
    : [{ id: "perf-na", title: "Mobile speed test", status: "warn", detail: "Google's speed test couldn't run for this site right now. Try again in a minute." }];

  const categories: Category[] = [
    { key: "performance", label: "Performance", score: psi?.scores.performance ?? null, items: perfItems },
    { key: "seo", label: "SEO", score: psi ? Math.round((psi.scores.seo + scoreItems(page.seo)) / 2) : scoreItems(page.seo), items: page.seo },
    { key: "accessibility", label: "Accessibility", score: psi ? Math.round((psi.scores.accessibility + scoreItems(page.accessibility)) / 2) : scoreItems(page.accessibility), items: page.accessibility },
    { key: "security", label: "Security", score: scoreItems(page.security), items: page.security },
    { key: "links", label: "Links & server", score: scoreItems(page.links), items: page.links },
  ];
  const scored = categories.filter((c) => c.score !== null) as (Category & { score: number })[];
  const weights: Record<string, number> = { performance: 1.5, seo: 1, accessibility: 1, security: 0.8, links: 1 };
  const overall = Math.round(
    scored.reduce((s, c) => s + c.score * weights[c.key], 0) / scored.reduce((s, c) => s + weights[c.key], 0)
  );

  const base = {
    url: url.href,
    finalUrl: page.finalUrl,
    checkedAt: new Date().toISOString(),
    overall,
    responseMs: page.responseMs,
    pageTitle: page.title,
    categories,
    metrics: psi?.metrics ?? [],
    pagespeed: (psi ? "ok" : "unavailable") as Report["pagespeed"],
    browser: psi?.browser,
  };
  const ai = await aiSummary(base);
  const fallback = ruleSummary(base);
  return { ...base, ...(ai ?? fallback), aiWritten: !!ai };
}
