import type { Metadata } from "next";
import Link from "next/link";
import { skills } from "../data";

export const metadata: Metadata = {
  title: "About",
  description: "Shashi Gautam: software tester and React / Next.js developer in Mumbai, India.",
};

export default function About() {
  return (
    <>
      <section className="container page-head">
        <span className="eyebrow">About</span>
        <h1>A tester who thinks like your customer.</h1>
      </section>

      <section className="container section-tight">
        <div className="split">
          <div className="stack">
            <p className="lead">
              Before software, I spent six years in field sales, talking to customers every day and learning what makes
              them trust a product or walk away.
            </p>
            <p className="muted">
              Today I bring that to software quality. I work in application support and testing at Empronc Solution,
              and I build my own apps with React and Next.js. Because I build as well as test, I write bug reports
              developers can act on immediately, and I understand what happens behind the screen.
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
              <span className="muted">Software Tester · Frontend Developer</span>
            </div>
            <dl className="facts">
              <div><dt>Based in</dt><dd>Mumbai, India</dd></div>
              <div><dt>Works with</dt><dd>Clients worldwide, remote</dd></div>
              <div><dt>Hours</dt><dd>Overlaps with UK, EU & US East</dd></div>
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
