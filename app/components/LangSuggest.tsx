"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLocale, type Locale } from "../i18n/locales";

const text: Record<Locale, { msg: string; go: string; no: string }> = {
  de: { msg: "Diese Seite gibt es auch auf Deutsch.", go: "Deutsch anzeigen →", no: "Auf Englisch bleiben" },
  fr: { msg: "Cette page existe aussi en français.", go: "Voir en français →", no: "Rester en anglais" },
  nl: { msg: "Deze pagina is ook in het Nederlands beschikbaar.", go: "Bekijk in het Nederlands →", no: "In het Engels blijven" },
};
const KEY = "lang-suggest-dismissed";

/** On English service pages: suggests the visitor's own language. It never redirects
    automatically, because forced redirects can hide the other languages from Google. */
export default function LangSuggest({ path }: { path: string }) {
  const [lang, setLang] = useState<Locale | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {}
    const pick = (navigator.languages || [navigator.language]).map((l) => l.slice(0, 2).toLowerCase()).find((l) => l === "en" || isLocale(l));
    if (pick && pick !== "en" && isLocale(pick)) setLang(pick);
  }, []);

  if (!lang) return null;
  const t = text[lang];
  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setLang(null);
  };
  return (
    <div className="lang-suggest" role="region" aria-label="Language suggestion" lang={lang}>
      <span>{t.msg}</span>
      <Link href={`/${lang}${path}`} className="btn btn-primary btn-sm" hrefLang={lang}>{t.go}</Link>
      <button className="btn btn-ghost btn-sm" onClick={dismiss}>{t.no}</button>
    </div>
  );
}
