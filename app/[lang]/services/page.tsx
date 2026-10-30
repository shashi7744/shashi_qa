import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LangSwitch from "../../components/LangSwitch";
import { services, site } from "../../data";
import { fmtEur, isLocale, languageAlternates, locales, ogLocale, translations, ui, type Locale } from "../../i18n";

/* /de/services, /fr/services, /nl/services: overview linking to each translated service page */

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: ui[lang].overviewTitle,
    description: ui[lang].overviewDescription,
    alternates: { canonical: `/${lang}/services`, languages: languageAlternates("/services") },
    openGraph: { locale: ogLocale[lang] },
  };
}

export default async function LocalServices({ params }: { params: Params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const u = ui[lang];
  const tr = translations[lang];

  return (
    <div lang={lang}>
      <section className="container page-head">
        <nav className="crumbs mono small" aria-label="Breadcrumb">
          <Link href="/">{u.home}</Link> / <span>{u.services}</span>
        </nav>
        <LangSwitch path="/services" current={lang} />
        <span className="eyebrow">{u.services}</span>
        <h1>{u.overviewH1}</h1>
        <p className="lead">{u.overviewLead}</p>
      </section>
      <section className="container section-tight">
        <div className="grid-3">
          {services.map((s) => {
            const t = tr[s.key];
            return (
              <Link key={s.key} href={`/${lang}/services/${s.id}`} className={`card svc-card accent-${s.accent}`}>
                <span className="mono">{s.num}</span>
                <h3>{t.label}</h3>
                <p className="muted">{t.short}</p>
                <span className="from">{u.from} {fmtEur(s.plans[0].price, lang as Locale)} · {u.details}</span>
              </Link>
            );
          })}
        </div>
        <p className="muted small">{u.vat} {u.note} <Link href="/contact" className="link">{site.email}</Link></p>
      </section>
    </div>
  );
}
