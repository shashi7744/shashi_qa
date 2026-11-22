import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LangSwitch from "../../../components/LangSwitch";
import VideoShowcase, { videoLabels } from "../../../components/VideoShowcase";
import { posts } from "../../../blog/posts";
import { blogUi, localPosts, postAlternates, postHrefs } from "../../../blog/translations";
import { services, site } from "../../../data";
import { isLocale, locales, ogLocale, translations, ui, type Locale } from "../../../i18n";

/* Translated guides: /de/blog/ki-video-werbung-ideen etc. */

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => localPosts[lang].map((p) => ({ lang, slug: p.slug })));
}

type Params = Promise<{ lang: string; slug: string }>;

async function load(params: Params) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return null;
  const p = localPosts[lang].find((x) => x.slug === slug);
  const en = p && posts.find((x) => x.slug === p.key);
  if (!p || !en) return null;
  return { lang, p, en };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const d = await load(params);
  if (!d) return {};
  return {
    title: { absolute: d.p.title },
    description: d.p.description,
    alternates: { canonical: `/${d.lang}/blog/${d.p.slug}`, languages: postAlternates(d.p.key) },
    openGraph: { type: "article", title: d.p.title, description: d.p.description, publishedTime: d.en.date, locale: ogLocale[d.lang] },
  };
}

export default async function LocalPostPage({ params }: { params: Params }) {
  const d = await load(params);
  if (!d) notFound();
  const { lang, p, en } = d;
  const u = blogUi[lang];
  const s = services.find((x) => x.key === en.service)!;
  const t = translations[lang as Locale][s.key];
  const url = `${site.url}/${lang}/blog/${p.slug}`;
  const others = localPosts[lang].filter((x) => x.slug !== p.slug);
  const date = new Date(en.date).toLocaleDateString(u.locale, { day: "numeric", month: "long", year: "numeric" });

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      inLanguage: lang,
      datePublished: en.date,
      dateModified: en.date,
      mainEntityOfPage: url,
      image: `${site.url}/opengraph-image`,
      author: { "@type": "Person", name: site.name, url: `${site.url}/about` },
      publisher: { "@id": `${site.url}/#business` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui[lang].home, item: site.url },
        { "@type": "ListItem", position: 2, name: u.guides, item: `${site.url}/${lang}/blog` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    },
  ];

  return (
    <div lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container article">
        <header className="page-head">
          <nav className="crumbs mono small" aria-label="Breadcrumb">
            <Link href="/">{ui[lang].home}</Link> / <Link href={`/${lang}/blog`}>{u.guides}</Link>
          </nav>
          <LangSwitch hrefs={postHrefs(p.key)} current={lang} />
          <h1>{p.title}</h1>
          <p className="lead">{p.description}</p>
          <span className="mono small muted">
            {u.by} {site.name} · {date} · {en.readMins} {u.minRead}
          </span>
        </header>

        <div className="prose">
          {p.body.map((b, i) =>
            "h2" in b ? (
              <h2 key={i}>{b.h2}</h2>
            ) : "p" in b ? (
              <p key={i}>{b.p}</p>
            ) : "list" in b ? (
              <ul key={i} className="checks">{b.list.map((li) => <li key={li}>{li}</li>)}</ul>
            ) : (
              <aside key={i} className="tip"><strong>{u.tip}</strong> {b.tip}</aside>
            )
          )}
        </div>

        {en.service === "ai" && (
          <section className="article-videos" data-tint="#9b8cff">
            <div className="section-head">
              <span className="eyebrow">{videoLabels[lang].eyebrow}</span>
              <h2>{videoLabels[lang].h2}</h2>
            </div>
            <VideoShowcase lang={lang} />
          </section>
        )}

        <div className={`cta-band article-cta accent-${s.accent}`}>
          <div>
            <h2>{t.title}</h2>
            <p className="lead">{ui[lang].ctaP}</p>
          </div>
          <div className="row">
            <Link href={`/${lang}/services/${s.id}`} className="btn btn-ghost">{u.see.replace("{label}", t.label)}</Link>
            <Link href={`/contact?service=${s.key}`} className="btn btn-primary">{ui[lang].quote}</Link>
          </div>
        </div>
      </article>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">{u.more}</span>
        </div>
        <div className="grid-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/${lang}/blog/${o.slug}`} className="card svc-card accent-violet">
              <h3>{o.title}</h3>
              <p className="muted small">{o.description}</p>
              <span className="from">{u.read}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
