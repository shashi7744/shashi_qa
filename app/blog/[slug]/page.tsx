import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, site } from "../../data";
import { findPost, posts } from "../posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) return {};
  return {
    title: { absolute: p.title }, // guide titles are long enough on their own
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description, publishedTime: p.date },
  };
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) notFound();
  const s = services.find((x) => x.key === p.service)!;
  const url = `${site.url}/blog/${p.slug}`;
  const others = posts.filter((x) => x.slug !== p.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.date,
      mainEntityOfPage: url,
      image: `${site.url}/opengraph-image`,
      author: { "@type": "Person", name: site.name, url: `${site.url}/about` },
      publisher: { "@id": `${site.url}/#business` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${site.url}/blog` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container article">
        <header className="page-head">
          <nav className="crumbs mono small" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/blog">Guides</Link>
          </nav>
          <h1>{p.title}</h1>
          <p className="lead">{p.description}</p>
          <span className="mono small muted">
            By {site.name} · {fmt(p.date)} · {p.readMins} min read
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
              <aside key={i} className="tip"><strong>Tip</strong> {b.tip}</aside>
            )
          )}
        </div>

        <div className={`cta-band article-cta accent-${s.accent}`}>
          <div>
            <h2>{s.title}</h2>
            <p className="lead">{s.label} {s.from}, fixed price in EUR. Tell me what you need and get a quote within 24 hours.</p>
          </div>
          <div className="row">
            <Link href={`/services/${s.id}`} className="btn btn-ghost">See {s.label.toLowerCase()} →</Link>
            <Link href={`/contact?service=${s.key}`} className="btn btn-primary">Get a fixed quote →</Link>
          </div>
        </div>
      </article>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">More guides</span>
        </div>
        <div className="grid-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/blog/${o.slug}`} className="card svc-card accent-teal">
              <span className="mono">{o.readMins} min read</span>
              <h3>{o.title}</h3>
              <p className="muted small">{o.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
