import type { Metadata } from "next";
import Link from "next/link";
import { skills } from "../data";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description: "Shashi Gautam: developer, software tester and AI video creator working remotely with businesses across Europe.",
};

export default function About() {
  return (
    <>
      <section className="container page-head">
        <span className="eyebrow">About</span>
        <h1>A tester who builds, and a builder who creates.</h1>
      </section>

      <section className="container section-tight">
        <div className="split">
          <div className="stack">
            <p className="lead">
              I&apos;m Shashi, and Shashi Studio is where I build websites and CRMs, create AI videos, reels and posts,
              and test software for small businesses.
            </p>
            <p className="muted">
              Everything I make is tested on real phones and browsers before you see it. That&apos;s the difference:
              you don&apos;t get a site that looks good in a demo and breaks on your customer&apos;s iPhone.
            </p>
            <p className="muted">
              I work remotely with businesses across Europe, during your working hours (CET). You get European quality
              at a lower price, content in your language, and one person who knows your project from first call to
              launch.
            </p>
            <Link href="/contact" className="btn btn-primary fit">Work with me →</Link>
          </div>
          <div className="profile-card">
            <div className="avatar" aria-hidden="true">SG</div>
            <div>
              <strong>Shashi Gautam</strong>
              <span className="muted">Developer · Software Tester · AI video creator</span>
            </div>
            <dl className="facts">
              <div><dt>Based in</dt><dd>Mumbai, India</dd></div>
              <div><dt>Works with</dt><dd>Businesses across Europe, remote</dd></div>
              <div><dt>Hours</dt><dd>09:00–17:00 CET</dd></div>
              <div><dt>Replies</dt><dd>Within 24 hours</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">Skills</span>
          <h2>Tools of the trade.</h2>
        </div>
        <div className="grid-4">
          {Object.entries(skills).map(([group, list]) => (
            <div key={group} className="card">
              <h3>{group}</h3>
              <div className="tags">
                {list.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
