import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LangSuggest from "../../components/LangSuggest";
import LangSwitch from "../../components/LangSwitch";
import PlanCards from "../../components/PlanCards";
import { languageAlternates } from "../../i18n/locales";
import { SERVICE_PREVIEW } from "../../components/ServicePreview";
import TiltCard from "../../components/TiltCard";
import { processSteps, services, site } from "../../data";
import { serviceDetails } from "../../serviceDetails";
import { posts } from "../../blog/posts";

/* One page per service: its own URL, title and FAQ, so each service can rank for its own searches */

const TINT: Record<string, string> = { teal: "#3ee0cf", amber: "#f2a649", violet: "#9b8cff", rec: "#ff5d6c", pass: "#4ade8a" };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.id === slug);
  if (!s) return {};
  const d = serviceDetails[s.key];
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: `/services/${s.id}`, languages: languageAlternates(`/services/${s.id}`) },
    openGraph: { title: `${d.seoTitle} | ${site.brand}`, description: d.seoDescription },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.id === slug);
  if (!s) notFound();
  const d = serviceDetails[s.key];
  const Preview = SERVICE_PREVIEW[s.key];
  const url = `${site.url}/services/${s.id}`;
  const guides = posts.filter((p) => p.service === s.key);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: d.seoTitle,
      description: d.seoDescription,
      url,
      serviceType: s.label,
      provider: { "@id": `${site.url}/#business` },
      areaServed: { "@type": "Continent", name: "Europe" },
      offers: s.plans.map((p) => ({
        "@type": "Offer",
        name: `${s.label}: ${p.name}`,
        description: p.for,
        price: p.price,
        priceCurrency: "EUR",
        url,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: d.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
        { "@type": "ListItem", position: 3, name: s.label, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={`container page-head accent-${s.accent}`} data-tint={TINT[s.accent]}>
        <nav className="crumbs mono small" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/services">Services</Link> / <span>{s.label}</span>
        </nav>
        <LangSwitch path={`/services/${s.id}`} current="en" />
        <LangSuggest path={`/services/${s.id}`} />
        <span className="eyebrow svc-eyebrow">{s.num} · {s.label} · {s.from}</span>
        <h1>{s.title}</h1>
        <p className="lead">{s.lead}</p>
        <div className="row">
          <Link href={`/contact?service=${s.key}`} className="btn btn-primary">Get a fixed quote →</Link>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Ask on WhatsApp</a>
        </div>
      </section>

      <section className={`container section-tight accent-${s.accent}`} data-tint={TINT[s.accent]}>
        <div className="split">
          <div className="stack">
            <span className="eyebrow svc-eyebrow">What&apos;s included</span>
            <ul className="checks svc-incl">
              {s.includes.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <TiltCard className="svc-preview">
            <Preview />
          </TiltCard>
        </div>
      </section>

      <section className={`container section accent-${s.accent}`} data-tint={TINT[s.accent]}>
        <div className="section-head">
          <span className="eyebrow svc-eyebrow">Who it&apos;s for</span>
          <h2>Built for businesses like yours.</h2>
        </div>
        <div className="grid-4">
          {d.audience.map((a) => (
            <div key={a.title} className="card svc-card">
              <h3>{a.title}</h3>
              <p className="muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`container section svc accent-${s.accent}`} data-tint={TINT[s.accent]}>
        <div className="section-head">
          <span className="eyebrow svc-eyebrow">Pricing</span>
          <h2>Fixed prices in EUR.</h2>
        </div>
        <PlanCards s={s} />
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>From first call to delivery.</h2>
        </div>
        <ol className="process">
          {processSteps.map((p, i) => (
            <li key={p.title}>
              <span className="step-num mono">{i + 1}</span>
              <span className="mono small muted">{p.day}</span>
              <h3>{p.title}</h3>
              <p className="muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>Questions about {s.label.toLowerCase()}.</h2>
        </div>
        <div className="faq">
          {d.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">Also useful</span>
          <h2>Related services and guides.</h2>
        </div>
        <div className="grid-3">
          {d.related.map((k) => {
            const r = services.find((x) => x.key === k)!;
            return (
              <Link key={k} href={`/services/${r.id}`} className={`card svc-card accent-${r.accent}`}>
                <span className="mono">{r.num}</span>
                <h3>{r.label}</h3>
                <p className="muted small">{r.short}</p>
                <span className="from">{r.from}</span>
              </Link>
            );
          })}
          {guides.map((g) => (
            <Link key={g.slug} href={`/blog/${g.slug}`} className="card svc-card accent-teal">
              <span className="mono">Guide · {g.readMins} min read</span>
              <h3>{g.title}</h3>
              <p className="muted small">{g.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="cta-band">
          <div>
            <h2>Want a fixed quote for {s.label.toLowerCase()}?</h2>
            <p className="lead">Tell me about your business. You&apos;ll get a plan and a price in EUR within 24 hours.</p>
          </div>
          <Link href={`/contact?service=${s.key}`} className="btn btn-primary">Get a fixed quote →</Link>
        </div>
      </section>
    </>
  );
}
