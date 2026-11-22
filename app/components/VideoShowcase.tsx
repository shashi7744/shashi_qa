import Link from "next/link";
import type { Locale } from "../i18n/locales";
import { site, videoWork, type VideoWork } from "../data";

/* Labels for the showcase in each language */
export const videoLabels: Record<"en" | Locale, { tag: string; cta: string; watch: string; eyebrow: string; h2: string }> = {
  en: { tag: "Sample work · made with AI", cta: "Get a video like this →", watch: "Details", eyebrow: "Examples", h2: "AI videos made like this." },
  de: { tag: "Beispielarbeit · mit KI erstellt", cta: "So ein Video anfragen →", watch: "Details", eyebrow: "Beispiele", h2: "So sehen KI-Videos aus." },
  fr: { tag: "Exemple · créé avec l'IA", cta: "Une vidéo comme celle-ci →", watch: "Détails", eyebrow: "Exemples", h2: "Des vidéos IA réalisées ainsi." },
  nl: { tag: "Voorbeeldwerk · gemaakt met AI", cta: "Zo'n video aanvragen →", watch: "Details", eyebrow: "Voorbeelden", h2: "Zo zien AI-video's eruit." },
};

export const videoJsonLd = (v: VideoWork) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: `${v.brand}: ${v.title}`,
  description: v.description,
  thumbnailUrl: `${site.url}/work/${v.slug}.jpg`,
  contentUrl: `${site.url}/work/${v.slug}.mp4`,
  embedUrl: `${site.url}/videos/${v.slug}`,
  uploadDate: v.date,
  duration: `PT${v.seconds}S`,
  creator: { "@id": `${site.url}/#business` },
});

/** Grid of AI video samples. Videos load only when played (preload="none"), so pages stay fast.
    Each card links to its own watch page and to the AI video service (in the page's language). */
export default function VideoShowcase({ lang = "en", only, exclude }: { lang?: "en" | Locale; only?: string[]; exclude?: string }) {
  const t = videoLabels[lang];
  const list = videoWork.filter((v) => (!only || only.includes(v.slug)) && v.slug !== exclude);
  const service = lang === "en" ? "/services/ai-video" : `/${lang}/services/ai-video`;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list.map(videoJsonLd)) }} />
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
              <span className="mono small video-tag">{t.tag}</span>
              <Link href={`/videos/${v.slug}`} className="video-title">{v.brand}</Link>
              <span className="muted small">{v.kind} · {v.seconds}s · {v.langs}</span>
              <Link href={service} className="link small">{t.cta}</Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
