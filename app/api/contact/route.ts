import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const TO = "shashi.gautam22@gmail.com";

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in your name, email and message." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const text = `New enquiry from your website

Name: ${name}
Email: ${email}
App link: ${body.url || "-"}
Interested in: ${body.plan || "-"}

${message}`;

  const subject = `New enquiry from ${name.replace(/[\r\n]+/g, " ")}`;

  // Option 1: send through your own Gmail (needs an App Password, not your normal password)
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass.replace(/\s+/g, "") },
      });
      await transporter.sendMail({ from: `"Shashi.QA Website" <${gmailUser}>`, to: TO, replyTo: email, subject, text });
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("[contact form] Gmail send failed:", e instanceof Error ? e.message : e);
      return NextResponse.json({ error: `Couldn't send right now. Please email ${TO} directly.` }, { status: 502 });
    }
  }

  // Option 2: send through Resend
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Email sending not configured yet: log it so nothing is lost in development.
    console.log("[contact form]\n" + text);
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: `The form isn't connected yet. Please email ${TO} directly.` },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Shashi.QA Website <onboarding@resend.dev>",
      to: [TO],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Couldn't send right now. Please email ${TO} directly.` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
