/* Languages for the translated service pages (/de, /fr, /nl). English lives at the site root. */

export const locales = ["de", "fr", "nl"] as const;
export type Locale = (typeof locales)[number];

export const isLocale = (x: string): x is Locale => (locales as readonly string[]).includes(x);

export const langNames: Record<"en" | Locale, string> = { en: "English", de: "Deutsch", fr: "Français", nl: "Nederlands" };

const numberLocale: Record<Locale, string> = { de: "de-DE", fr: "fr-FR", nl: "nl-NL" };
export const ogLocale: Record<Locale, string> = { de: "de_DE", fr: "fr_FR", nl: "nl_NL" };

/** €1,490 written the way each country expects: 1.490 € · 1 490 € · € 1.490 */
export const fmtEur = (n: number, l: Locale) =>
  new Intl.NumberFormat(numberLocale[l], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/** hreflang map for a path like "/services/websites": tells Google which URL is which language. */
export const languageAlternates = (path: string) => ({
  en: path,
  ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
  "x-default": path,
});

export type Ui = {
  services: string;
  home: string;
  from: string; // "from" before a price
  quote: string;
  whatsapp: string;
  included: string;
  who: string;
  whoH: string;
  pricing: string;
  pricingH: string;
  popular: string;
  choose: string; // "{plan}" is replaced
  delivery: string;
  compare: string;
  vat: string;
  faq: string;
  faqH: string;
  related: string;
  ctaH: string;
  ctaP: string;
  note: string; // language of conversation
  details: string;
  overviewTitle: string;
  overviewH1: string;
  overviewLead: string;
  overviewDescription: string;
};

export const ui: Record<Locale, Ui> = {
  de: {
    services: "Leistungen",
    home: "Start",
    from: "ab",
    quote: "Festpreis-Angebot anfragen →",
    whatsapp: "Per WhatsApp fragen",
    included: "Das ist enthalten",
    who: "Für wen",
    whoH: "Für Unternehmen wie Ihres.",
    pricing: "Preise",
    pricingH: "Festpreise in Euro.",
    popular: "Beliebteste Wahl",
    choose: "{plan} wählen",
    delivery: "Lieferzeit",
    compare: "Zum Vergleich:",
    vat: "Preise in Euro, zzgl. MwSt.",
    faq: "FAQ",
    faqH: "Häufige Fragen.",
    related: "Weitere Leistungen",
    ctaH: "Bereit für ein Festpreis-Angebot?",
    ctaP: "Erzählen Sie mir von Ihrem Unternehmen. Sie erhalten innerhalb von 24 Stunden einen Plan und einen Preis in Euro.",
    note: "Gespräche und Antworten auf Englisch.",
    details: "Details, Preise und FAQ →",
    overviewTitle: "Leistungen & Preise",
    overviewH1: "Website, CRM, KI-Video, Instagram und Testing.",
    overviewLead: "Fünf Leistungen für kleine Unternehmen in ganz Europa, jeweils zum Festpreis in Euro.",
    overviewDescription:
      "Websites, CRMs, KI-Videoanzeigen, Instagram-Content und Software-Tests für kleine Unternehmen in Europa. Festpreise in Euro, remote umgesetzt.",
  },
  fr: {
    services: "Services",
    home: "Accueil",
    from: "à partir de",
    quote: "Demander un devis à prix fixe →",
    whatsapp: "Écrire sur WhatsApp",
    included: "Ce qui est inclus",
    who: "Pour qui",
    whoH: "Pensé pour des entreprises comme la vôtre.",
    pricing: "Tarifs",
    pricingH: "Des prix fixes en euros.",
    popular: "Le plus choisi",
    choose: "Choisir {plan}",
    delivery: "Délai",
    compare: "À titre de comparaison :",
    vat: "Prix en euros, hors TVA.",
    faq: "FAQ",
    faqH: "Questions fréquentes.",
    related: "Autres services",
    ctaH: "Prêt pour un devis à prix fixe ?",
    ctaP: "Parlez-moi de votre activité. Vous recevrez un plan et un prix en euros sous 24 heures.",
    note: "Échanges et réponses en anglais.",
    details: "Détails, tarifs et FAQ →",
    overviewTitle: "Services & tarifs",
    overviewH1: "Site web, CRM, vidéo IA, Instagram et tests.",
    overviewLead: "Cinq services pour les petites entreprises partout en Europe, chacun à prix fixe en euros.",
    overviewDescription:
      "Sites web, CRM, vidéos publicitaires IA, contenu Instagram et tests logiciels pour les petites entreprises en Europe. Prix fixes en euros, à distance.",
  },
  nl: {
    services: "Diensten",
    home: "Home",
    from: "vanaf",
    quote: "Vraag een vaste prijs aan →",
    whatsapp: "Vraag het via WhatsApp",
    included: "Wat is inbegrepen",
    who: "Voor wie",
    whoH: "Gemaakt voor bedrijven zoals het jouwe.",
    pricing: "Prijzen",
    pricingH: "Vaste prijzen in euro.",
    popular: "Meest gekozen",
    choose: "Kies {plan}",
    delivery: "Levertijd",
    compare: "Ter vergelijking:",
    vat: "Prijzen in euro, excl. btw.",
    faq: "FAQ",
    faqH: "Veelgestelde vragen.",
    related: "Andere diensten",
    ctaH: "Klaar voor een vaste prijs?",
    ctaP: "Vertel me over je bedrijf. Je krijgt binnen 24 uur een plan en een prijs in euro.",
    note: "Gesprekken en antwoorden in het Engels.",
    details: "Details, prijzen en FAQ →",
    overviewTitle: "Diensten & prijzen",
    overviewH1: "Website, CRM, AI-video, Instagram en testen.",
    overviewLead: "Vijf diensten voor kleine bedrijven in heel Europa, elk met een vaste prijs in euro.",
    overviewDescription:
      "Websites, CRM's, AI-videoadvertenties, Instagram-content en softwaretests voor kleine bedrijven in Europa. Vaste prijzen in euro, op afstand.",
  },
};
