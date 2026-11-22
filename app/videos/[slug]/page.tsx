import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../blog/posts";
import VideoShowcase, { videoJsonLd } from "../../components/VideoShowcase";
import { site, videoWork } from "../../data";

/* A watch page per video: Google indexes videos best when the video is the main thing on the page. */

export const dynamicParams = false;

export function generateStaticParams() {
  return videoWork.map((v) => ({ slug: v.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const v = videoWork.find((x) => x.slug === slug);
  if (!v) return {};
  const title = `${v.brand}: ${v.title} (AI video)`;
  return {
    title,
    description: `${v.description} Made with AI by ${site.brand}.`,
    alternates: { canonical: `/videos/${v.slug}` },
    openGraph: {
      type: "video.other",
      title,
      description: v.description,
      images: [{ url: `/work/${v.slug}.jpg`, width: 720, height: 1280 }],
      videos: [{ url: `/work/${v.slug}.mp4`, type: "video/mp4", width: 720, height: 1280 }],
    },
  };
}

export default async function VideoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const v = videoWork.find((x) => x.slug === slug);
  if (!v) notFound();
  const guide = posts.find((p) => p.slug === v.guide);

  const jsonLd = [
    videoJsonLd(v),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "AI videos", item: `${site.url}/videos` },
        { "@type": "ListItem", position: 3, name: v.brand, item: `${site.url}/videos/${v.slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container page-head" data-tint="#9b8cff">
        <nav className="crumbs mono small" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/videos">AI videos</Link> / <span>{v.brand}</span>
        </nav>
      </section>

      <section className="container section-tight" data-tint="#9b8cff">
        <div className="video-watch">
          <video src={`/work/${v.slug}.mp4`} poster={`/work/${v.slug}.jpg`} controls playsInline preload="metadata" aria-label={`${v.brand}: ${v.title}`} />
          <div className="stack">
            <span className="eyebrow video-tag">Sample work · made with AI</span>
            <h1>{v.brand}: {v.title}</h1>
            <p className="lead">{v.description}</p>
            <dl className="video-facts">
              <dt>Type</dt><dd>{v.kind}</dd>
              <dt>Length</dt><dd>{v.seconds} seconds</dd>
              <dt>Language</dt><dd>{v.langs}</dd>
              <dt>Format</dt><dd>9:16 vertical, for Reels, TikTok and Shorts</dd>
            </dl>
            <div className="row">
              <Link href="/contact?service=ai" className="btn btn-primary">Get a video like this →</Link>
              <Link href="/services/ai-video" className="btn btn-ghost">AI video plans & prices</Link>
            </div>
            {guide && (
              <p className="muted">
                Related guide: <Link href={`/blog/${guide.slug}`} className="link">{guide.title}</Link>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container section" data-tint="#9b8cff">
        <div className="section-head row-between">
          <div>
            <span className="eyebrow">More AI videos</span>
            <h2>Other examples.</h2>
          </div>
          <Link href="/videos" className="btn btn-ghost">All AI videos</Link>
        </div>
        <VideoShowcase exclude={v.slug} />
      </section>
    </>
  );
}
