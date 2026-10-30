import { NextResponse } from "next/server";
import { runCheck, UserError } from "@/lib/checker";
import { checkAdmin, draftMessage, findContacts, testingNeed, topIssues, type Contacts } from "@/lib/outreach";
import { site } from "@/app/data";
import type { DraftLang } from "@/lib/europe";

export const runtime = "nodejs";
export const maxDuration = 60;

/** One lead at a time, so each request stays inside Vercel's time limit. */
export async function POST(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return NextResponse.json({ error: denied }, { status: 401 });

  const { url, product, hnUser, lang } = await req.json().catch(() => ({}));
  if (!url) return NextResponse.json({ error: "Missing url." }, { status: 400 });
  const draftLang: DraftLang = ["de", "fr", "nl"].includes(lang) ? lang : "en";

  try {
    const [report, contacts] = await Promise.all([
      runCheck(url),
      findContacts(url, hnUser).catch((): Contacts => ({ emails: [], socials: [] })),
    ]);
    const me = { name: site.name, email: site.email, site: site.url };
    const flow = contacts.business?.flow || "main user flow";
    const draft = await draftMessage(report, product || report.pageTitle, me, flow, draftLang);
    return NextResponse.json({
      // lets the admin screen rebuild the draft in another language
      draftInput: { product: product || report.pageTitle, host: new URL(report.finalUrl).hostname, flow },
      url: report.finalUrl,
      title: product || report.pageTitle,
      score: report.overall,
      issues: topIssues(report, 5).map((i) => ({ status: i.status, text: `${i.title}: ${i.detail}` })),
      need: testingNeed(report),
      contacts,
      draft,
    });
  } catch (e) {
    const msg = e instanceof UserError ? e.message : "Check failed.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
