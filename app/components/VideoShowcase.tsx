import { site, videoWork } from "../data";

/** Grid of AI video samples. Videos load only when played (preload="none"), so pages stay fast.
    Also tells Google about each video (VideoObject), which can show them in video search. */
export default function VideoShowcase({ label = "Sample work · made with AI", limit }: { label?: string; limit?: number }) {
  const list = limit ? videoWork.slice(0, limit) : videoWork;
  const jsonLd = list.map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${v.brand}: ${v.title}`,
    description: v.description,
    thumbnailUrl: `${site.url}/work/${v.slug}.jpg`,
    contentUrl: `${site.url}/work/${v.slug}.mp4`,
    uploadDate: v.date,
    duration: `PT${v.seconds}S`,
    creator: { "@id": `${site.url}/#business` },
  }));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="video-grid">
        {list.map((v) => (
          <figure key={v.slug} className="video-card">
            <video
              src={`/work/${v.slug}.mp4`}
              poster={`/work/${v.slug}.jpg`}
              controls
              playsInline
              preload="none"
              aria-label={`${v.brand}: ${v.title}`}
            />
            <figcaption>
              <span className="mono small video-tag">{label}</span>
              <strong>{v.brand}</strong>
              <span className="muted small">{v.kind} · {v.seconds}s · {v.langs}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
