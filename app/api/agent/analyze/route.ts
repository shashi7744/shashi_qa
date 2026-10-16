import { NextResponse } from "next/server";
import { runCheck, UserError } from "@/lib/checker";
import { checkAdmin, draftMessage, findContacts, testingNeed, topIssues, type Contacts } from "@/lib/outreach";
import { site } from "@/app/data";

export const runtime = "nodejs";
export const maxDuration = 60;

/** One lead at a time, so each request stays inside Vercel's time limit. */
export async function POST(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return NextResponse.json({ error: denied }, { status: 401 });

  const { url, product, hnUser } = await req.json().catch(() => ({}));
  if (!url) return NextResponse.json({ error: "Missing url." }, { status: 400 });

  try {
    const [report, contacts] = await Promise.all([
      runCheck(url),
      findContacts(url, hnUser).catch((): Contacts => ({ emails: [], socials: [] })),
    ]);
    const me = { name: site.name, email: site.email, site: process.env.SITE_URL || "https://shashiqa.vercel.app" };
    const draft = await draftMessage(report, product || report.pageTitle, me, contacts.business?.flow);
    return NextResponse.json({
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
