import type { Metadata } from "next";
import Link from "next/link";
import BugReport from "../components/BugReport";
import TiltCard from "../components/TiltCard";
import { faqs, packages, testTypes } from "../data";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description: "Quick audits, release testing and ongoing QA for startups. Fixed prices, clear bug reports.",
};

export default function Services() {
  return (
    <>
      <section className="container page-head">
        <span className="eyebrow">Services</span>
        <h1>Software testing that fits how you ship.</h1>
        <p className="lead">
          Pick a one-time audit before launch, or a monthly plan that tests every release. All plans include clear
          bug reports with steps, screenshots and severity.
        </p>
      </section>

      <section className="container section-tight">
        <div className="grid-3 pricing">
          {packages.map((p) => (
            <TiltCard key={p.id} className={`price-card ${p.featured ? "featured" : ""}`}>
              {p.featured && <span className="badge">Most popular</span>}
              <span className="label">{p.name}</span>
              <div className="price">
                <strong>{p.price}</strong>
                <span className="muted">{p.unit}</span>
              </div>
              <p className="muted">{p.best}</p>
              <ul className="checks">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <span className="mono small muted">{p.turnaround}</span>
              <Link href={`/contact?plan=${p.id}`} className={`btn ${p.featured ? "btn-primary" : "btn-ghost"}`}>
                Choose {p.name}
              </Link>
            </TiltCard>
          ))}
        </div>
        <p className="muted small center">Prices in USD. Need something custom? <Link href="/contact" className="link">Ask for a quote.</Link></p>
      </section>

      <section className="container section">
        <div className="split">
          <div className="stack">
            <span className="eyebrow">What you get</span>
            <h2>Bug reports your developers can fix right away.</h2>
            <p className="lead">
              Every issue comes with the device, steps to reproduce, expected and actual result, and proof. No vague
              "it's broken" messages, no back and forth.
            </p>
            <ul className="checks">
              <li>Severity ranking so you fix what matters first</li>
              <li>Screen recordings for hard-to-reproduce bugs</li>
              <li>Retest of every fix before it's closed</li>
              <li>A short summary you can share with your team</li>
            </ul>
          </div>
          <TiltCard className="bug-wrap">
            <BugReport />
          </TiltCard>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">Coverage</span>
          <h2>Types of testing included.</h2>
        </div>
        <div className="grid-3">
          {testTypes.map((t, i) => (
            <div key={t.title} className="card">
              <span className="card-code mono">TC-{String(i + 1).padStart(2, "0")}</span>
              <h3>{t.title}</h3>
              <p className="muted">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>Common questions.</h2>
        </div>
        <div className="faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
