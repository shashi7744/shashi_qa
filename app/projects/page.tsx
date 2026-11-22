import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TiltCard from "../components/TiltCard";
import VideoShowcase from "../components/VideoShowcase";
import { projects } from "../data";

export const metadata: Metadata = {
  title: "Projects",
  alternates: { canonical: "/projects" },
  description: "Web apps built and tested by Shashi Gautam, including a parking management system and client data app.",
};

export default function Projects() {
  return (
    <>
      <section className="container page-head">
        <span className="eyebrow">Projects</span>
        <h1>AI videos, apps and websites.</h1>
        <p className="lead">Watch the AI video samples, then open the live apps and see what I checked before shipping.</p>
      </section>

      <section className="container section-tight" data-tint="#9b8cff">
        <div className="section-head">
          <span className="eyebrow">AI video</span>
          <h2>AI video ads and promos.</h2>
          <p className="lead">Product ads, an AI presenter, a story-driven promo and a motion teaser. Tap to play.</p>
        </div>
        <VideoShowcase />
      </section>

      <section className="container section-tight">
        <div className="section-head">
          <span className="eyebrow">Apps & websites</span>
          <h2>Built, shipped and tested.</h2>
        </div>
      </section>

      <section className="container section-tight stack-lg">
        {projects.map((p, i) => (
          <article key={p.slug} className={`project-row accent-${p.accent} ${i % 2 ? "reverse" : ""}`}>
            {p.screens ? (
              <div className="project-visual phones">
                {p.screens.map((s) => (
                  <a key={s.src} href={s.src} target="_blank" rel="noopener noreferrer" className="phone">
                    <Image src={s.src} alt={`${p.title}: ${s.label} screen`} width={752} height={1568} sizes="(max-width: 620px) 45vw, 160px" />
                    <span className="phone-label mono">{s.label}</span>
                  </a>
                ))}
              </div>
            ) : (
            <TiltCard className="project-visual">
              <div className="browser">
                <div className="browser-bar">
                  <i /><i /><i />
                  <span className="mono">{p.live.replace("https://", "")}</span>
                </div>
                <div className="browser-body">
                  <div className="mock-line w60" />
                  <div className="mock-line w40" />
                  <div className="mock-grid">
                    <span /><span /><span /><span />
                  </div>
                  <div className="mock-line w80" />
                </div>
              </div>
            </TiltCard>
            )}
            <div className="stack">
              <span className="mono small muted">0{i + 1} / 0{projects.length}</span>
              <h2>{p.title}</h2>
              <p className="lead">{p.summary}</p>
              <div className="tags">
                {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
              <div className="tested">
                <span className="label">What I tested</span>
                <ul className="checks">
                  {p.tested.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary fit">
                {p.liveLabel ?? "Open live app"} ↗
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="container section">
        <div className="cta-band">
          <div>
            <h2>Want your app tested like this?</h2>
            <p className="lead">Send me a link. I'll test one flow for free.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">Get in touch →</Link>
        </div>
      </section>
    </>
  );
}
