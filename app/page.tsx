import Link from "next/link";
import TestConsole from "./components/TestConsole";
import TiltCard from "./components/TiltCard";
import { packages, processSteps, projects, testTypes } from "./data";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="dot" /> Available for new projects</span>
          <h1>
            Find the bugs <em>before</em> your users do.
          </h1>
          <p className="lead">
            I'm Shashi, a software tester in Mumbai. I test web and mobile apps for startups and send you clear,
            fix-ready bug reports, so every release ships with confidence.
          </p>
          <div className="row">
            <Link href="/contact" className="btn btn-primary">Get a free bug check →</Link>
            <Link href="/services" className="btn btn-ghost">See services & pricing</Link>
          </div>
          <ul className="trust">
            <li>Manual & regression testing</li>
            <li>Desktop, Android & iPhone</li>
            <li>Reports in Jira, Linear or GitHub</li>
          </ul>
        </div>
        {/* open space so the 3D lattice behind the hero is fully visible */}
        <div className="hero-space" aria-hidden="true" />
      </section>

      {/* Stats */}
      <section className="container stats">
        <div className="stat"><strong>48h</strong><span>Turnaround on release testing</span></div>
        <div className="stat"><strong>4</strong><span>Browsers tested on every job</span></div>
        <div className="stat"><strong>3</strong><span>Live apps built and tested</span></div>
        <div className="stat"><strong>7+ yrs</strong><span>Working with clients</span></div>
      </section>

      {/* Live test run */}
      <section className="container section">
        <div className="split">
          <div className="stack">
            <span className="eyebrow">Live test run</span>
            <h2>Every flow tested, every bug reported.</h2>
            <p className="lead">
              I run your key user journeys on real devices and browsers. When something breaks, you get a bug report
              with steps, severity and a screen recording, ready for your developers to fix.
            </p>
          </div>
          <TiltCard className="hero-visual">
            <TestConsole />
          </TiltCard>
        </div>
      </section>

      {/* What I test */}
      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">What I test</span>
          <h2>Everything your users touch.</h2>
        </div>
        <div className="grid-3">
          {testTypes.map((t, i) => (
            <TiltCard key={t.title} className="card">
              <span className="card-code mono">TC-{String(i + 1).padStart(2, "0")}</span>
              <h3>{t.title}</h3>
              <p className="muted">{t.text}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>From first test to fixed bug.</h2>
        </div>
        <ol className="process">
          {processSteps.map((s, i) => (
            <li key={s.title}>
              <span className="step-num mono">{i + 1}</span>
              <h3>{s.title}</h3>
              <p className="muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Free tool */}
      <section className="container section">
        <div className="tool-band">
          <div className="stack">
            <span className="eyebrow">Free tool</span>
            <h2>Check your website in 60 seconds.</h2>
            <p className="lead">
              Speed, SEO, accessibility, security and broken links, with an AI summary of the three fixes that matter most.
            </p>
            <Link href="/check" className="btn btn-primary fit">Run a free check →</Link>
          </div>
          <div className="tool-preview" aria-hidden="true">
            <div className="tp-score"><strong>72</strong><span>/100</span></div>
            <ul>
              <li><span className="tp-dot pass" />HTTPS enabled</li>
              <li><span className="tp-dot fail" />3 broken links</li>
              <li><span className="tp-dot warn" />Images missing alt text</li>
              <li><span className="tp-dot warn" />Slow on mobile (4.8 s)</li>
            </ul>
            <span className="tp-tag mono">sample report</span>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="container section">
        <div className="section-head row-between">
          <div>
            <span className="eyebrow">Plans</span>
            <h2>Simple, fixed pricing.</h2>
          </div>
          <Link href="/services" className="btn btn-ghost">Compare all plans</Link>
        </div>
        <div className="grid-3">
          {packages.map((p) => (
            <div key={p.id} className={`price-mini ${p.featured ? "featured" : ""}`}>
              <span className="label">{p.name}</span>
              <strong>{p.price}<small> {p.unit}</small></strong>
              <p className="muted">{p.best}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="container section">
        <div className="section-head row-between">
          <div>
            <span className="eyebrow">Projects</span>
            <h2>Built, shipped and tested.</h2>
          </div>
          <Link href="/projects" className="btn btn-ghost">All projects</Link>
        </div>
        <div className="grid-3">
          {projects.map((p) => (
            <TiltCard key={p.slug} className={`card project-card accent-${p.accent}`}>
              <div className="project-thumb"><span className="mono">{p.slug}.app</span></div>
              <h3>{p.title}</h3>
              <p className="muted">{p.summary}</p>
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="link">
                {p.liveLabel ?? "Open live app"} ↗
              </a>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container section">
        <div className="cta-band">
          <div>
            <h2>Launching soon? Let me break it first.</h2>
            <p className="lead">I'll test one key flow of your app for free and send you every bug I find.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">Claim your free bug check →</Link>
        </div>
      </section>
    </>
  );
}
