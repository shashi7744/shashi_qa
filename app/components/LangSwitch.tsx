import Link from "next/link";
import { langNames, locales, type Locale } from "../i18n/locales";

type Lang = "en" | Locale;

/** "English · Deutsch · Français · Nederlands" links to the same page in each language.
    Pass `path` when every language uses /{lang}{path}, or `hrefs` when URLs differ (guides). */
export default function LangSwitch({ path, hrefs, current }: { path?: string; hrefs?: Partial<Record<Lang, string>>; current: Lang }) {
  const all: Lang[] = ["en", ...locales];
  const href = (l: Lang) => hrefs?.[l] ?? (path === undefined ? undefined : l === "en" ? path : `/${l}${path}`);
  return (
    <nav className="lang-switch mono small" aria-label="Language">
      {all.map((l) => {
        const h = href(l);
        if (!h) return null;
        return l === current ? (
          <span key={l} aria-current="page">{langNames[l]}</span>
        ) : (
          <Link key={l} href={h} hrefLang={l} lang={l}>{langNames[l]}</Link>
        );
      })}
    </nav>
  );
}
