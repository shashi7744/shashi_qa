import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LangSwitch from "../../../components/LangSwitch";
import { SERVICE_PREVIEW } from "../../../components/ServicePreview";
import TiltCard from "../../../components/TiltCard";
import { services, site } from "../../../data";
import { fmtEur, isLocale, languageAlternates, locales, ogLocale, translations, ui, type Locale } from "../../../i18n";

/* German, French and Dutch versions of each service page: /de/services/websites etc. */

const TINT: Record<string, string> = { teal: "#3ee0cf", amber: "#f2a649", violet: "#9b8cff", rec: "#ff5d6c", pass: "#4ade8a" };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => services.map((s) => ({ lang, slug: s.id })));
}

type Params = Promise<{ lang: string; slug: string }>;

async function load(params: Params) {
  const { lang, slug } = await params;
  const s = services.find((x) => x.id === slug);
  if (!isLocale(lang) || !s) return null;
  return { lang, s, t: translations[lang][s.key], u: ui[lang] };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const d = await load(params);
  if (!d) return {};
  const path = `/services/${d.s.id}`;
  return {
    title: d.t.seoTitle,
    description: d.t.seoDescription,
    alternates: { canonical: `/${d.lang}${path}`, languages: languageAlternates(path) },
    openGraph: { title: `${d.t.seoTitle} | ${site.brand}`, description: d.t.seoDescription, locale: ogLocale[d.lang] },
  };
}

export default async function LocalServicePage({ params }: { params: Params }) {
  const d = await load(params);
  if (!d) notFound();
  const { lang, s, t, u } = d;
  const Preview = SERVICE_PREVIEW[s.key];
  const path = `/services/${s.id}`;
  const url = `${site.url}/${lang}${path}`;
  const from = `${u.from} ${fmtEur(s.plans[0].price, lang as Locale)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: t.seoTitle,
      description: t.seoDescription,
      url,
      inLanguage: lang,
      serviceType: t.label,
      provider: { "@id": `${site.url}/#business` },
      areaServed: { "@type": "Continent", name: "Europe" },
      offers: s.plans.map((p, i) => ({
        "@type": "Offer",
        name: `${t.label}: ${t.plans[i].name}`,
        description: t.plans[i].for,
        price: p.price,
        priceCurrency: "EUR",
        url,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: t.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: u.home, item: site.url },
        { "@type": "ListItem", position: 2, name: u.services, item: `${site.url}/${lang}/services` },
        { "@type": "ListItem", position: 3, name: t.label, item: url },
      ],
    },
  ];

  return (
    <div lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={`container page-head accent-${s.accent}`} data-tint={TINT[s.accent]}>
        <nav className="crumbs mono small" aria-label="Breadcrumb">
          <Link href="/">{u.home}</Link> / <Link href={`/${lang}/services`}>{u.services}</Link> / <span>{t.label}</span>
        </nav>
        <LangSwitch path={path} current={lang} />
        <span className="eyebrow svc-eyebrow">{s.num} · {t.label} · {from}</span>
        <h1>{t.title}</h1>
        <p className="lead">{t.lead}</p>
        <div className="row">
          <Link href={`/contact?service=${s.key}`} className="btn btn-primary">{u.quote}</Link>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{u.whatsapp}</a>
        </div>
      </section>

      <section className={`container section-tight accent-${s.accent}`} data-tint={TINT[s.accent]}>
        <div className="split">
          <div className="stack">
            <span className="eyebrow svc-eyebrow">{u.included}</span>
            <ul className="checks svc-incl">
              {t.includes.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <TiltCard className="svc-preview">
            <Preview />
          </TiltCard>
        </div>
      </section>

      <section className={`container section accent-${s.accent}`} data-tint={TINT[s.accent]}>
        <div className="section-head">
          <span className="eyebrow svc-eyebrow">{u.who}</span>
          <h2>{u.whoH}</h2>
        </div>
        <div className="grid-4">
          {t.audience.map((a) => (
            <div key={a.title} className="card svc-card">
              <h3>{a.title}</h3>
              <p className="muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`container section svc accent-${s.accent}`} data-tint={TINT[s.accent]}>
        <div className="section-head">
          <span className="eyebrow svc-eyebrow">{u.pricing}</span>
          <h2>{u.pricingH}</h2>
        </div>
        <div className="grid-3 pricing">
          {s.plans.map((p, i) => {
            const tp = t.plans[i];
            return (
              <div key={p.name} className={`price-card ${p.popular ? "featured" : ""}`}>
                {p.popular && <span className="badge">{u.popular}</span>}
                <span className="label">{tp.name}</span>
                <div className="price">
                  <strong>{fmtEur(p.price, lang as Locale)}</strong>
                  <span className="muted">{tp.per}</span>
                </div>
                <p className="muted">{tp.for}</p>
                <ul className="checks">
                  {tp.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                {/* the contact form preselects plans by their English name */}
                <Link
                  href={`/contact?service=${s.key}&plan=${encodeURIComponent(p.name)}`}
                  className={`btn ${p.popular ? "btn-primary" : "btn-ghost"}`}
                >
                  {u.choose.replace("{plan}", tp.name)}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="svc-meta">
          <span className="svc-time"><b>{u.delivery}</b> {t.time}</span>
          <span className="muted small">{u.compare} {t.local} {u.vat}</span>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">{u.faq}</span>
          <h2>{u.faqH}</h2>
        </div>
        <div className="faq">
          {t.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">{u.related}</span>
        </div>
        <div className="grid-4">
          {services
            .filter((r) => r.key !== s.key)
            .map((r) => {
              const rt = translations[lang as Locale][r.key];
              return (
                <Link key={r.key} href={`/${lang}/services/${r.id}`} className={`card svc-card accent-${r.accent}`}>
                  <span className="mono">{r.num}</span>
                  <h3>{rt.label}</h3>
                  <p className="muted small">{rt.short}</p>
                  <span className="from">{u.from} {fmtEur(r.plans[0].price, lang as Locale)}</span>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="container section">
        <div className="cta-band">
          <div>
            <h2>{u.ctaH}</h2>
            <p className="lead">{u.ctaP}</p>
            <p className="muted small">{u.note}</p>
          </div>
          <Link href={`/contact?service=${s.key}`} className="btn btn-primary">{u.quote}</Link>
        </div>
      </section>
    </div>
  );
}
