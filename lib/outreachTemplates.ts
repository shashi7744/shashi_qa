import type { DraftLang } from "./europe";

/* Email/WhatsApp draft templates in English, German (Sie), French (vous) and Dutch (je).
   Pure functions, used by the server and by the admin screen (to switch language per lead).
   ✏️ Have a native speaker check the German, French and Dutch wording once. */

export type Signer = { name: string; email: string; site: string };
export type Draft = { subject: string; body: string };

/** Must stay in every bug-first draft: the admin blocks sending until it is replaced. */
export const BUG_MARKER = "[YOUR BUG HERE";

const placeholder: Record<DraftLang, string> = {
  en: "[YOUR BUG HERE: what you did → what happened → what you expected. Attach a screenshot or short screen recording.]",
  de: "[YOUR BUG HERE – auf Deutsch: Was Sie getan haben → was passiert ist → was Sie erwartet haben. Screenshot anhängen.]",
  fr: "[YOUR BUG HERE – en français : ce que vous avez fait → ce qui s'est passé → ce que vous attendiez. Joindre une capture.]",
  nl: "[YOUR BUG HERE – in het Nederlands: wat je deed → wat er gebeurde → wat je verwachtte. Voeg een screenshot toe.]",
};

const flows: Record<string, Record<DraftLang, string>> = {
  "sign-up and checkout flow": { en: "sign-up and checkout flow", de: "Registrierung und Bestellprozess", fr: "parcours d'inscription et de commande", nl: "aanmeld- en bestelproces" },
  "app on real iPhone and Android devices": { en: "app on real iPhone and Android devices", de: "App auf echten iPhone- und Android-Geräten", fr: "application sur de vrais iPhone et Android", nl: "app op echte iPhone- en Android-toestellen" },
  "sign-up and onboarding flow": { en: "sign-up and onboarding flow", de: "Registrierung und den Einstieg", fr: "parcours d'inscription et de prise en main", nl: "aanmelding en onboarding" },
  "main user flow": { en: "main user flow", de: "wichtigsten Ablauf", fr: "parcours principal", nl: "belangrijkste flow" },
};
const flowText = (flow: string, lang: DraftLang) => flows[flow]?.[lang] ?? flows["main user flow"][lang];

const sign = (me: Signer) => `${me.name}\nShashi Studio · websites, AI video & testing\n${me.email} · ${me.site}`;

const optOut: Record<DraftLang, string> = {
  en: "If you'd rather not hear from me, just reply \"no\" and I won't contact you again.",
  de: "Falls Sie keine weiteren Nachrichten möchten, antworten Sie einfach mit „Nein“ – dann melde ich mich nicht wieder.",
  fr: "Si vous préférez ne plus être contacté, répondez simplement « non » et je ne vous écrirai plus.",
  nl: "Liever geen berichten meer? Antwoord dan gewoon \"nee\" en ik neem geen contact meer op.",
};

const englishNote: Record<DraftLang, string> = {
  en: "",
  de: "\n(Ich antworte am liebsten auf Englisch, verstehe Deutsch aber gut.)",
  fr: "\n(Je réponds de préférence en anglais, mais je lis le français sans problème.)",
  nl: "\n(Ik antwoord het liefst in het Engels, maar lees Nederlands prima.)",
};

/** Website exists: lead with a bug you found yourself, offer a free test of the key flow. */
export function bugFirstDraft(lang: DraftLang, x: { product: string; host: string; flow: string; extras?: string[]; me: Signer }): Draft {
  const p = x.product || x.host;
  const f = flowText(x.flow, lang);
  const extras = lang === "en" && x.extras?.length ? `\nTwo smaller things my automated scan picked up, in case they're useful:\n${x.extras.map((e) => `- ${e}`).join("\n")}\n` : "";
  const t = {
    en: {
      subject: `Found a bug on ${x.host}`,
      body: `Hi,\n\nI tried ${p} and ran into this:\n\n${placeholder.en}\n\nI'm a software tester and help small businesses catch issues like this before their customers do. Happy to test your ${f} for free and send you a clear bug report with steps and screenshots.\n${extras}`,
    },
    de: {
      subject: `Fehler auf ${x.host} gefunden`,
      body: `Guten Tag,\n\nich habe ${p} ausprobiert und bin auf Folgendes gestoßen:\n\n${placeholder.de}\n\nIch teste beruflich Software und helfe kleinen Unternehmen, solche Fehler zu finden, bevor es ihre Kunden tun. Gern teste ich kostenlos einen wichtigen Ablauf (${f}) und schicke Ihnen einen klaren Fehlerbericht mit Schritten und Screenshots.\n`,
    },
    fr: {
      subject: `Un bug trouvé sur ${x.host}`,
      body: `Bonjour,\n\nj'ai essayé ${p} et voici ce que j'ai constaté :\n\n${placeholder.fr}\n\nJe teste des logiciels au quotidien et j'aide les petites entreprises à repérer ce genre de problème avant leurs clients. Je peux tester gratuitement votre ${f} et vous envoyer un rapport clair avec les étapes et des captures d'écran.\n`,
    },
    nl: {
      subject: `Bug gevonden op ${x.host}`,
      body: `Hoi,\n\nik heb ${p} geprobeerd en liep hier tegenaan:\n\n${placeholder.nl}\n\nIk ben softwaretester en help kleine bedrijven om zulke problemen te vinden voordat hun klanten dat doen. Ik test graag gratis je ${f} en stuur je een duidelijk bugrapport met stappen en screenshots.\n`,
    },
  }[lang];
  return { subject: t.subject, body: `${t.body}\n${optOut[lang]}${englishNote[lang]}\n\n${sign(x.me)}` };
}

/** No website yet: offer one, mention what customers can't do today. */
export function noWebsiteDraft(lang: DraftLang, x: { name: string; city?: string; me: Signer }): Draft {
  const where = x.city ? (lang === "en" ? ` in ${x.city}` : lang === "de" ? ` in ${x.city}` : lang === "fr" ? ` à ${x.city}` : ` in ${x.city}`) : "";
  const t = {
    en: {
      subject: `A website for ${x.name}?`,
      body: `Hi,\n\nI came across ${x.name}${where} and noticed you don't seem to have a website yet. Many customers look you up on their phone first: opening hours, prices, photos, and a quick way to book or get in touch.\n\nI build fast, simple websites for small businesses, in English and your local language, tested on real phones before launch. A starter site is a fixed €690, ready in 2–3 weeks.\n\nWould a short example of what yours could look like be useful? No obligation.\n`,
    },
    de: {
      subject: `Eine Website für ${x.name}?`,
      body: `Guten Tag,\n\nich bin auf ${x.name}${where} gestoßen und habe gesehen, dass Sie anscheinend noch keine eigene Website haben. Viele Kunden suchen zuerst am Handy: Öffnungszeiten, Preise, Fotos und eine schnelle Möglichkeit zu buchen oder Kontakt aufzunehmen.\n\nIch erstelle schnelle, einfache Websites für kleine Unternehmen, auf Deutsch und Englisch, vor dem Start auf echten Smartphones getestet. Eine Starter-Website kostet pauschal 690 € und ist in 2–3 Wochen fertig.\n\nWäre ein kurzer Entwurf, wie Ihre Website aussehen könnte, interessant? Ganz unverbindlich.\n`,
    },
    fr: {
      subject: `Un site web pour ${x.name} ?`,
      body: `Bonjour,\n\nj'ai découvert ${x.name}${where} et il semble que vous n'ayez pas encore de site web. Beaucoup de clients vous cherchent d'abord sur leur téléphone : horaires, prix, photos et un moyen rapide de réserver ou de vous contacter.\n\nJe crée des sites rapides et simples pour les petites entreprises, en français et en anglais, testés sur de vrais téléphones avant la mise en ligne. Un site Starter coûte 690 € (prix fixe) et il est prêt en 2 à 3 semaines.\n\nSouhaitez-vous un court aperçu de ce à quoi votre site pourrait ressembler ? Sans engagement.\n`,
    },
    nl: {
      subject: `Een website voor ${x.name}?`,
      body: `Hoi,\n\nik kwam ${x.name}${where} tegen en zag dat jullie nog geen eigen website lijken te hebben. Veel klanten zoeken eerst op hun telefoon: openingstijden, prijzen, foto's en een snelle manier om te boeken of contact op te nemen.\n\nIk bouw snelle, eenvoudige websites voor kleine bedrijven, in het Nederlands en Engels, getest op echte telefoons vóór de lancering. Een starterssite kost vast €690 en is binnen 2–3 weken klaar.\n\nZou een kort voorbeeld van hoe jullie site eruit kan zien handig zijn? Geheel vrijblijvend.\n`,
    },
  }[lang];
  return { subject: t.subject, body: `${t.body}\n${optOut[lang]}${englishNote[lang]}\n\n${sign(x.me)}` };
}
