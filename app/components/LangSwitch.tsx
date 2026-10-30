import Link from "next/link";
import { langNames, locales, type Locale } from "../i18n/locales";

/** "English · Deutsch · Français · Nederlands" links to the same page in each language. */
export default function LangSwitch({ path, current }: { path: string; current: "en" | Locale }) {
  const all: ("en" | Locale)[] = ["en", ...locales];
  return (
    <nav className="lang-switch mono small" aria-label="Language">
      {all.map((l) => {
        const href = l === "en" ? path : `/${l}${path}`;
        return l === current ? (
          <span key={l} aria-current="page">{langNames[l]}</span>
        ) : (
          <Link key={l} href={href} hrefLang={l} lang={l}>{langNames[l]}</Link>
        );
      })}
    </nav>
  );
}
