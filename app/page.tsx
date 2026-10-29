import Link from "next/link";
import TestConsole from "./components/TestConsole";
import TiltCard from "./components/TiltCard";
import { processSteps, projects, services } from "./data";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="dot" /> Serving businesses across Europe · Replies within 24 h</span>
          <h1>
            Build it. Test it. <em>Grow</em> it on reels.
          </h1>
          <p className="lead">
            I&apos;m Shashi, a developer, software tester and AI video creator. I build websites and CRMs for small
            businesses, test them on every device, and make the AI videos and Instagram content that bring customers in.
          </p>
          <div className="row">
            <Link href="/contact" className="btn btn-primary">Get a fixed quote →</Link>
            <Link href="/services" className="btn btn-ghost">See services & pricing</Link>
          </div>
          <ul className="trust">
            <li>Fixed prices in EUR</li>
            <li>09:00–17:00 CET availability</li>
            <li>Every project tested on real devices</li>
          </ul>
        </div>
        {/* open space so the 3D lattice behind the hero is fully visible */}
        <div className="hero-space" aria-hidden="true" />
      </section>

      {/* Stats */}
      <section className="container stats">
        <div className="stat"><strong>5</strong><span>Services, from website to reels</span></div>
        <div className="stat"><strong>3–5 days</strong><span>To your first AI video or posts</span></div>
        <div className="stat"><strong>3</strong><span>Live apps built and tested</span></div>
        <div className="stat"><strong>Since 2019</strong><span>Client-facing, in sales and app support</span></div>
      </section>

      {/* One partner, whole project */}
      <section className="container section">
        <div className="split">
          <div className="stack">
            <span className="eyebrow">One partner, start to finish</span>
            <h2>Built, tested and promoted by one person.</h2>
            <p className="lead">
              No handovers between agencies. I build your website or CRM, test it on real devices before you see it,
              and create the videos and posts that bring customers to it. You get one plan, one price and weekly
              updates.
            </p>
            <ul className="checks">
              <li>Everything tested on iPhone, Android and desktop before launch</li>
              <li>Clear progress updates every week, in your working hours</li>
            </ul>
          </div>
          <TiltCard className="hero-visual">
            <TestConsole />
          </TiltCard>
        </div>
      </section>

      {/* Services */}
      <section className="container section">
        <div className="section-head row-between">
          <div>
            <span className="eyebrow">Services</span>
            <h2>Everything a small business needs online.</h2>
          </div>
          <Link href="/services" className="btn btn-ghost">Compare all plans</Link>
        </div>
        <div className="svc-cards">
          {services.map((s) => (
            <Link key={s.key} href={`/services#${s.id}`} className={`card svc-card accent-${s.accent}`}>
              <span className="mono">{s.num}</span>
              <h3>{s.label}</h3>
              <p className="muted small">{s.short}</p>
              <span className="from">{s.from}</span>
            </Link>
          ))}
        </div>
        <p className="muted small">Prices in EUR, excl. VAT.</p>
      </section>

      {/* Process */}
      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>From first call to launch.</h2>
          <p className="lead">AI videos and posts in days. Websites in weeks. CRMs in 1–3 months. Always a fixed price.</p>
        </div>
        <ol className="process">
          {processSteps.map((s, i) => (
            <li key={s.title}>
              <span className="step-num mono">{i + 1}</span>
              <span className="mono small muted">{s.day}</span>
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
            <Link href="/check" className="btn btn-primary fit">Run a free website scan →</Link>
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
            <h2>Launching soon? Let me test it first, free.</h2>
            <p className="lead">One free manual test of your website&apos;s most important flow, with a short bug report.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">Claim your free manual test →</Link>
        </div>
      </section>
    </>
  );
}
