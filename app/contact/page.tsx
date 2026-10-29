import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "./ContactForm";
import { site } from "../data";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description: "Get a fixed quote in EUR for a website, CRM, AI video, Instagram content or software testing.",
};

export default function Contact() {
  return (
    <>
      <section className="container page-head">
        <span className="eyebrow">Contact</span>
        <h1>Tell me what you need.</h1>
        <p className="lead">
          A website, a CRM, AI videos, Instagram content or testing. You&apos;ll get a plan and a fixed quote in EUR within
          24 hours, and the first manual test is free.
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
              <span className="label">Phone & WhatsApp</span>
              <a href={site.phoneHref} className="strong">{site.phone}</a>
              <div className="row contact-actions">
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Chat on WhatsApp ↗</a>
                <a href={site.phoneHref} className="btn btn-ghost btn-sm">Call</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="label">GitHub</span>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="link">github.com/shashi7744 ↗</a>
            </div>
            <div className="contact-item">
              <span className="label">Serving</span>
              <span>{site.serving}</span>
            </div>
            <div className="contact-item">
              <span className="label">Hours</span>
              <span>{site.hours}</span>
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
