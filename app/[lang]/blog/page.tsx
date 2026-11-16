import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../blog/posts";
import { blogUi, localPosts } from "../../blog/translations";
import { services } from "../../data";
import { isLocale, locales, ogLocale, translations } from "../../i18n";

/* /de/blog, /fr/blog, /nl/blog: the translated guides */

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const u = blogUi[lang];
  return {
    title: u.indexTitle,
    description: u.indexDescription,
    alternates: { canonical: `/${lang}/blog` },
    openGraph: { locale: ogLocale[lang] },
  };
}

export default async function LocalBlog({ params }: { params: Params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const u = blogUi[lang];
  return (
    <div lang={lang}>
      <section className="container page-head">
        <span className="eyebrow">{u.guides}</span>
        <h1>{u.h1}</h1>
        <p className="lead">{u.lead}</p>
      </section>
      <section className="container section-tight">
        <div className="grid-3">
          {localPosts[lang].map((p) => {
            const en = posts.find((x) => x.slug === p.key)!;
            const s = services.find((x) => x.key === en.service)!;
            return (
              <Link key={p.slug} href={`/${lang}/blog/${p.slug}`} className={`card svc-card accent-${s.accent}`}>
                <span className="mono">{translations[lang][s.key].label} · {en.readMins} {u.minRead}</span>
                <h3>{p.title}</h3>
                <p className="muted small">{p.description}</p>
                <span className="from">{u.read}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
