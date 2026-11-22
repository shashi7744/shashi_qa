import type { Metadata } from "next";
import Link from "next/link";
import VideoShowcase from "../components/VideoShowcase";

export const metadata: Metadata = {
  title: "AI Video Examples",
  alternates: { canonical: "/videos" },
  description:
    "AI video ads and promos made for small businesses: product ads, an AI presenter, a story-driven promo and a motion teaser. Watch the samples and get a quote.",
};

export default function Videos() {
  return (
    <>
      <section className="container page-head" data-tint="#9b8cff">
        <nav className="crumbs mono small" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>AI videos</span>
        </nav>
        <span className="eyebrow">AI video</span>
        <h1>AI video ads that stop the scroll.</h1>
        <p className="lead">
          Product ads, AI presenters, story-driven promos and motion teasers, ready for Instagram, TikTok and Meta ads.
          Tap a video to play it, or open it for details.
        </p>
        <div className="row">
          <Link href="/services/ai-video" className="btn btn-primary">See AI video plans →</Link>
          <Link href="/blog/ai-video-ad-ideas-small-business" className="btn btn-ghost">12 AI video ad ideas</Link>
        </div>
      </section>
      <section className="container section-tight" data-tint="#9b8cff">
        <VideoShowcase />
      </section>
    </>
  );
}
