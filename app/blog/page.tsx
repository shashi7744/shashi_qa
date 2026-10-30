import type { Metadata } from "next";
import Link from "next/link";
import { services } from "../data";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Guides for Small Businesses",
  alternates: { canonical: "/blog" },
  description:
    "Practical guides on website costs, testing before launch, AI video ads and Instagram content for small businesses across Europe.",
};

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function Blog() {
  return (
    <>
      <section className="container page-head">
        <span className="eyebrow">Guides</span>
        <h1>Straight answers for small businesses.</h1>
        <p className="lead">What a website really costs, what to test before launch, and how to use AI video and reels well.</p>
      </section>
      <section className="container section-tight">
        <div className="grid-3">
          {posts.map((p) => {
            const s = services.find((x) => x.key === p.service)!;
            return (
              <Link key={p.slug} href={`/blog/${p.slug}`} className={`card svc-card accent-${s.accent}`}>
                <span className="mono">{s.label} · {p.readMins} min read</span>
                <h3>{p.title}</h3>
                <p className="muted small">{p.description}</p>
                <span className="from">Read the guide →</span>
              </Link>
            );
          })}
        </div>
        <p className="muted small">Last updated {fmt(posts.map((p) => p.date).sort().at(-1)!)}</p>
      </section>
    </>
  );
}
