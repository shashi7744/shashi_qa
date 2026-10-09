"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { packages, site } from "../data";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const params = useSearchParams();
  const initialPlan = params.get("plan") ?? "free";
  const initialUrl = params.get("url") ?? "";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-done stack">
        <span className="pill pill-live">Message received</span>
        <h3>Thanks! I'll reply within 24 hours.</h3>
        <p className="muted">If it's urgent, email me directly at <span className="selectable">{site.email}</span>.</p>
        <button className="btn btn-ghost fit" onClick={() => setStatus("idle")}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-row">
        <label htmlFor="name">Your name
          <input id="name" name="name" required placeholder="Jane Doe" />
        </label>
        <label htmlFor="email">Work email
          <input id="email" name="email" type="email" required placeholder="jane@startup.com" />
        </label>
      </div>
      <label htmlFor="url">App or website link
        <input id="url" name="url" type="url" placeholder="https://yourapp.com" defaultValue={initialUrl} />
      </label>
      <label htmlFor="plan">I'm interested in
        <select id="plan" name="plan" defaultValue={initialPlan}>
          <option value="free">Free bug check</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.price} {p.unit})</option>
          ))}
          <option value="job">Hiring for a QA / frontend role</option>
        </select>
      </label>
      <label htmlFor="message">Message
        <textarea id="message" name="message" required rows={5} placeholder="What does your app do, and when are you releasing next?" />
      </label>
      {status === "error" && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
