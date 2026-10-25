"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { eur, services, site } from "../data";

type Status = "idle" | "sending" | "sent" | "error";

const FREE = "Free manual test";
const planLabel = (service: string, plan: string, price: number, per: string) => `${service} · ${plan} (${eur(price)} ${per})`;

export default function ContactForm() {
  const params = useSearchParams();
  // "Choose" buttons on /services link here with ?service=web&plan=Business
  const svc = services.find((s) => s.key === params.get("service"));
  const chosen = svc?.plans.find((p) => p.name === params.get("plan"));
  const initialPlan = svc && chosen ? planLabel(svc.label, chosen.name, chosen.price, chosen.per) : svc ? `${svc.label} · not sure yet` : FREE;
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
          <input id="email" name="email" type="email" required placeholder="jane@yourbusiness.nl" />
        </label>
      </div>
      <label htmlFor="url">Your website or Instagram (if you have one)
        <input id="url" name="url" type="text" placeholder="yourbusiness.nl or @yourbusiness" defaultValue={initialUrl} />
      </label>
      <label htmlFor="plan">I'm interested in
        <select id="plan" name="plan" defaultValue={initialPlan}>
          <option value={FREE}>{FREE}</option>
          {services.map((s) => (
            <optgroup key={s.key} label={s.label}>
              {s.plans.map((p) => {
                const label = planLabel(s.label, p.name, p.price, p.per);
                return <option key={p.name} value={label}>{label}</option>;
              })}
              <option value={`${s.label} · not sure yet`}>{s.label} · not sure yet</option>
            </optgroup>
          ))}
          <option value="Something else / several services">Something else / several services</option>
          <option value="Hiring for a QA / frontend role">Hiring for a QA / frontend role</option>
        </select>
      </label>
      <label htmlFor="message">Message
        <textarea id="message" name="message" required rows={5} placeholder="What does your business do, what do you need, and by when?" />
      </label>
      {status === "error" && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
