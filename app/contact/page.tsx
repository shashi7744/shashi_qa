import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "./ContactForm";
import { site } from "../data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get a free manual test or a quote for software testing.",
};

export default function Contact() {
  return (
    <>
      <section className="container page-head">
        <span className="eyebrow">Contact</span>
        <h1>Let's test your app.</h1>
        <p className="lead">
          Tell me about your product. I reply within 24 hours, and the first manual test is free.
        </p>
      </section>

      <section className="container section-tight">
        <div className="contact-grid">
          <div className="card stack">
            <div className="contact-item">
              <span className="label">Email</span>
              <span className="selectable strong">{site.email}</span>
            </div>
            <div className="contact-item">
              <span className="label">GitHub</span>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="link">github.com/shashi7744 ↗</a>
            </div>
            <div className="contact-item">
              <span className="label">Location</span>
              <span>{site.location} · Remote worldwide</span>
            </div>
            <div className="contact-item">
              <span className="label">Free manual test includes</span>
              <ul className="checks">
                <li>One key flow tested (e.g. sign-up or checkout)</li>
                <li>Desktop and mobile</li>
                <li>Bugs sent to you within 2 days</li>
              </ul>
            </div>
          </div>
          <div className="card">
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
