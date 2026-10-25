import type { Metadata } from "next";
import Link from "next/link";
import { skills } from "../data";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description: "Shashi Gautam: developer, software tester and AI video creator working with clients in the Netherlands and Luxembourg.",
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
              Before software, I spent six years in field sales, talking to customers every day and learning what makes
              them trust a product or walk away.
            </p>
            <p className="muted">
              Today I work in application support and testing, and I build websites, CRMs and AI content for
              businesses. Because I test for a living, everything I make is checked on real phones and browsers before
              you see it.
            </p>
            <p className="muted">
              I&apos;m based in Mumbai and work remotely with clients in the Netherlands and Luxembourg, during your
              working hours. You get European quality at a lower price, and one person who knows your project.
            </p>
            <p className="muted">
              I hold a B.Sc. in Information Technology from Viva College, Mumbai, and work in English, Hindi and Marathi.
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
              <div><dt>Works with</dt><dd>Netherlands, Luxembourg, remote</dd></div>
              <div><dt>Hours</dt><dd>09:00–17:00 CET</dd></div>
              <div><dt>Languages</dt><dd>English, Hindi, Marathi</dd></div>
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
