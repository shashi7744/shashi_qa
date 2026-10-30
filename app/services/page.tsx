import type { Metadata } from "next";
import Link from "next/link";
import BugReport from "../components/BugReport";
import { SERVICE_PREVIEW } from "../components/ServicePreview";
import PlanCards from "../components/PlanCards";
import ServiceNav from "../components/ServiceNav";
import TiltCard from "../components/TiltCard";
import { faqs, services, site, testTypes } from "../data";

export const metadata: Metadata = {
  title: "Services & Pricing",
  alternates: { canonical: "/services" },
  description:
    "Websites, CRMs, AI video, Instagram content and software testing for businesses across Europe. Fixed prices in EUR, delivered remotely.",
};

/* the 3D scene fades to each section's colour while you scroll (see Scene.tsx) */
const TINT: Record<string, string> = { teal: "#3ee0cf", amber: "#f2a649", violet: "#9b8cff", rec: "#ff5d6c", pass: "#4ade8a" };

/* Structured data: lets Google understand each service, its EUR prices and the FAQ */
const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Websites, CRM, AI video, Instagram and testing",
  url: `${site.url}/services`,
  itemListElement: services.map((s) => ({
    "@type": "OfferCatalog",
    name: s.label,
    url: `${site.url}/services/${s.id}`,
    itemListElement: s.plans.map((p) => ({
      "@type": "Offer",
      name: `${s.label}: ${p.name}`,
      description: p.for,
      price: p.price,
      priceCurrency: "EUR",
      seller: { "@id": `${site.url}/#business` },
      itemOffered: {
        "@type": "Service",
        name: `${s.label}: ${p.name}`,
        description: s.lead,
        provider: { "@id": `${site.url}/#business` },
        areaServed: { "@type": "Continent", name: "Europe" },
      },
    })),
  })),
};
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Services() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="container page-head">
        <span className="eyebrow">Services</span>
        <h1>Build it. Test it. Grow it.</h1>
        <p className="lead">
          Five services for small businesses across Europe, each with fixed prices in EUR. Pick one,
          or combine them: a website, the CRM behind it, and the videos and reels that bring customers in.
        </p>
        <nav className="svc-index" aria-label="Services on this page">
          {services.map((s) => (
            <a key={s.key} href={`#${s.id}`} className={`accent-${s.accent}`}>
              <small className="mono">{s.num}</small>
              <strong>{s.label}</strong>
              <span>{s.from}</span>
            </a>
          ))}
        </nav>
      </section>

      <div className="svc-wrap">
      <ServiceNav items={services.map((s) => ({ id: s.id, label: s.label, accent: s.accent }))} />
      {services.map((s) => {
        const Preview = SERVICE_PREVIEW[s.key];
        return (
          <section key={s.key} id={s.id} data-tint={TINT[s.accent]} className={`container section svc accent-${s.accent}`}>
            <div className="split svc-top">
              <div className="stack">
                <span className="eyebrow svc-eyebrow">{s.num} · {s.label}</span>
                <h2>{s.title}</h2>
                <p className="lead">{s.lead}</p>
                <ul className="checks svc-incl">
                  {s.includes.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <TiltCard className="svc-preview">
                <Preview />
              </TiltCard>
            </div>

            <PlanCards s={s} />
            <Link href={`/services/${s.id}`} className="link fit">Full details, examples and FAQ for {s.label} →</Link>

            {s.key === "qa" && (
              <>
                <div className="split svc-extra">
                  <div className="stack">
                    <span className="eyebrow">What you get</span>
                    <h3 className="svc-h3">Bug reports your developers can fix right away.</h3>
                    <p className="lead">
                      Every issue comes with the device, steps to reproduce, expected and actual result, and proof. No
                      vague &quot;it&apos;s broken&quot; messages, no back and forth.
                    </p>
                    <ul className="checks">
                      <li>Severity ranking so you fix what matters first</li>
                      <li>Screen recordings for hard-to-reproduce bugs</li>
                      <li>Retest of every fix before it&apos;s closed</li>
                    </ul>
                    <Link href="/check" className="link">Or run a free automated website scan first →</Link>
                  </div>
                  <TiltCard className="bug-wrap">
                    <BugReport />
                  </TiltCard>
                </div>
                <div className="grid-3 svc-extra">
                  {testTypes.map((t, i) => (
                    <div key={t.title} className="card">
                      <span className="card-code mono">TC-{String(i + 1).padStart(2, "0")}</span>
                      <h3>{t.title}</h3>
                      <p className="muted">{t.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })}
      </div>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>Questions clients ask.</h2>
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

      <section className="container section">
        <div className="cta-band">
          <div>
            <h2>Not sure which one you need?</h2>
            <p className="lead">Tell me about your business. You&apos;ll get a plan and a fixed quote in EUR within 24 hours.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">Get a fixed quote →</Link>
        </div>
      </section>
    </>
  );
}
