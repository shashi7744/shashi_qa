import type { Locale } from "../../i18n/locales";
import { dePosts } from "./de";
import { frPosts } from "./fr";
import { nlPosts } from "./nl";
import type { LocalPost } from "./types";

export type { LocalPost } from "./types";

export const localPosts: Record<Locale, LocalPost[]> = { de: dePosts, fr: frPosts, nl: nlPosts };

/** Every language version of an English guide, as hrefs: { en: "/blog/x", de: "/de/blog/y", … } */
export function postHrefs(key: string): Partial<Record<"en" | Locale, string>> {
  const out: Partial<Record<"en" | Locale, string>> = { en: `/blog/${key}` };
  for (const [lang, list] of Object.entries(localPosts) as [Locale, LocalPost[]][]) {
    const p = list.find((x) => x.key === key);
    if (p) out[lang] = `/${lang}/blog/${p.slug}`;
  }
  return out;
}

/** hreflang map for metadata (only when translations exist) */
export function postAlternates(key: string) {
  const h = postHrefs(key);
  return Object.keys(h).length > 1 ? { ...h, "x-default": h.en! } : undefined;
}

type BlogUi = {
  guides: string;
  h1: string;
  lead: string;
  minRead: string;
  by: string;
  more: string;
  tip: string;
  read: string;
  see: string; // "{label}" is replaced
  indexTitle: string;
  indexDescription: string;
  locale: string;
};

export const blogUi: Record<Locale, BlogUi> = {
  de: {
    guides: "Ratgeber",
    h1: "KI-Video-Ratgeber für kleine Unternehmen.",
    lead: "Ideen, Skripte und Tipps für Videoanzeigen, die Kunden bringen – in jeder Sprache.",
    minRead: "Min. Lesezeit",
    by: "Von",
    more: "Weitere Ratgeber",
    tip: "Tipp",
    read: "Ratgeber lesen →",
    see: "{label} ansehen →",
    indexTitle: "KI-Video-Ratgeber für kleine Unternehmen",
    indexDescription: "Ideen, Skripte und Tipps für KI-Videoanzeigen für kleine Unternehmen: 15-Sekunden-Formel, 12 Anzeigenideen und mehrsprachige Kampagnen in Europa.",
    locale: "de-DE",
  },
  fr: {
    guides: "Guides",
    h1: "Guides vidéo IA pour petites entreprises.",
    lead: "Idées, scripts et conseils pour des publicités vidéo qui attirent des clients, dans toutes les langues.",
    minRead: "min de lecture",
    by: "Par",
    more: "Autres guides",
    tip: "Astuce",
    read: "Lire le guide →",
    see: "Voir {label} →",
    indexTitle: "Guides vidéo IA pour petites entreprises",
    indexDescription: "Idées, scripts et conseils de publicités vidéo IA pour petites entreprises : formule de 15 secondes, 12 idées de pubs et campagnes multilingues en Europe.",
    locale: "fr-FR",
  },
  nl: {
    guides: "Gidsen",
    h1: "AI-videogidsen voor kleine bedrijven.",
    lead: "Ideeën, scripts en tips voor videoadvertenties die klanten opleveren, in elke taal.",
    minRead: "min lezen",
    by: "Door",
    more: "Meer gidsen",
    tip: "Tip",
    read: "Lees de gids →",
    see: "Bekijk {label} →",
    indexTitle: "AI-videogidsen voor kleine bedrijven",
    indexDescription: "Ideeën, scripts en tips voor AI-videoadvertenties voor kleine bedrijven: de 15-secondenformule, 12 advertentie-ideeën en meertalige campagnes in Europa.",
    locale: "nl-NL",
  },
};
