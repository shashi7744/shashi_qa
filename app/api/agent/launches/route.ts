import { NextResponse } from "next/server";
import { checkAdmin, findLaunches } from "@/lib/outreach";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return NextResponse.json({ error: denied }, { status: 401 });
  try {
    const { limit } = await req.json().catch(() => ({ limit: 40 }));
    return NextResponse.json({ launches: await findLaunches(Number(limit) || 40) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Couldn't load launches." }, { status: 502 });
  }
}
