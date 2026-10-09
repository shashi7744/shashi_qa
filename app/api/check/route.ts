import { NextResponse } from "next/server";
import { runCheck, UserError } from "@/lib/checker";

export const runtime = "nodejs";
export const maxDuration = 60; // Google's speed test can take 20–40 seconds

/* Simple per-visitor limit. It resets when the server restarts; use Upstash/Vercel KV for a permanent limit. */
const DAILY_LIMIT = Number(process.env.CHECK_DAILY_LIMIT || 5);
const hits = new Map<string, { count: number; day: string }>();

function allow(ip: string) {
  const day = new Date().toISOString().slice(0, 10);
  const h = hits.get(ip);
  if (!h || h.day !== day) {
    hits.set(ip, { count: 1, day });
    return true;
  }
  if (h.count >= DAILY_LIMIT) return false;
  h.count++;
  return true;
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (!allow(ip)) {
    return NextResponse.json(
      { error: `You've used your ${DAILY_LIMIT} free checks for today. Come back tomorrow, or ask me for a full manual test.` },
      { status: 429 }
    );
  }
  let url = "";
  try {
    url = (await req.json()).url || "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  try {
    const report = await runCheck(url);
    return NextResponse.json(report);
  } catch (e) {
    if (e instanceof UserError) {
      const h = hits.get(ip);
      if (h && h.count > 0) h.count--; // typos and unreachable sites don't use up a free check
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error("[website check]", e);
    return NextResponse.json({ error: "Something went wrong while checking that site. Please try again." }, { status: 500 });
  }
}
