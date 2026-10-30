/* Countries, business categories and cold-contact guidance for the Lead Agent.
   Shared by the server (search) and the admin screen. Not legal advice: rules change and have exceptions. */

export type DraftLang = "en" | "de" | "fr" | "nl";
export type ContactRule = "consent" | "optout" | "check";

export type Country = { code: string; name: string; calling: string; lang: DraftLang; rule: ContactRule };

export const countries: Country[] = [
  { code: "AT", name: "Austria", calling: "43", lang: "de", rule: "consent" },
  { code: "BE", name: "Belgium", calling: "32", lang: "nl", rule: "optout" },
  { code: "BG", name: "Bulgaria", calling: "359", lang: "en", rule: "check" },
  { code: "HR", name: "Croatia", calling: "385", lang: "en", rule: "check" },
  { code: "CY", name: "Cyprus", calling: "357", lang: "en", rule: "check" },
  { code: "CZ", name: "Czechia", calling: "420", lang: "en", rule: "check" },
  { code: "DK", name: "Denmark", calling: "45", lang: "en", rule: "consent" },
  { code: "EE", name: "Estonia", calling: "372", lang: "en", rule: "check" },
  { code: "FI", name: "Finland", calling: "358", lang: "en", rule: "optout" },
  { code: "FR", name: "France", calling: "33", lang: "fr", rule: "optout" },
  { code: "DE", name: "Germany", calling: "49", lang: "de", rule: "consent" },
  { code: "GR", name: "Greece", calling: "30", lang: "en", rule: "check" },
  { code: "HU", name: "Hungary", calling: "36", lang: "en", rule: "check" },
  { code: "IS", name: "Iceland", calling: "354", lang: "en", rule: "check" },
  { code: "IE", name: "Ireland", calling: "353", lang: "en", rule: "optout" },
  { code: "IT", name: "Italy", calling: "39", lang: "en", rule: "consent" },
  { code: "LV", name: "Latvia", calling: "371", lang: "en", rule: "check" },
  { code: "LT", name: "Lithuania", calling: "370", lang: "en", rule: "check" },
  { code: "LU", name: "Luxembourg", calling: "352", lang: "fr", rule: "optout" },
  { code: "MT", name: "Malta", calling: "356", lang: "en", rule: "check" },
  { code: "NL", name: "Netherlands", calling: "31", lang: "nl", rule: "optout" },
  { code: "NO", name: "Norway", calling: "47", lang: "en", rule: "check" },
  { code: "PL", name: "Poland", calling: "48", lang: "en", rule: "consent" },
  { code: "PT", name: "Portugal", calling: "351", lang: "en", rule: "optout" },
  { code: "RO", name: "Romania", calling: "40", lang: "en", rule: "check" },
  { code: "SK", name: "Slovakia", calling: "421", lang: "en", rule: "check" },
  { code: "SI", name: "Slovenia", calling: "386", lang: "en", rule: "check" },
  { code: "ES", name: "Spain", calling: "34", lang: "en", rule: "consent" },
  { code: "SE", name: "Sweden", calling: "46", lang: "en", rule: "optout" },
  { code: "CH", name: "Switzerland", calling: "41", lang: "de", rule: "check" },
  { code: "GB", name: "United Kingdom", calling: "44", lang: "en", rule: "optout" },
];

export const countryByCode = (c?: string) => countries.find((x) => x.code === c?.toUpperCase());

export const ruleText: Record<ContactRule, string> = {
  consent:
    "Strict: cold marketing emails usually need prior consent here, even to businesses. Prefer their contact form, LinkedIn, or skip. One personal message only.",
  optout:
    "Usually allowed: one relevant email to a business address, with your details and a clear opt-out (the drafts include one). Stop if they say no.",
  check: "Check local rules before emailing. Keep it to one relevant, personal message with an opt-out.",
};

export const whatsappRule =
  "WhatsApp: one personal message, only if the business publicly lists WhatsApp/mobile for customers. Never bulk-send: reported numbers get banned.";

/* OpenStreetMap tags for each kind of business (Overpass syntax) */
export type Category = { key: string; label: string; tags: string[] };

export const categories: Category[] = [
  { key: "cafe", label: "Cafés", tags: ['["amenity"="cafe"]'] },
  { key: "restaurant", label: "Restaurants", tags: ['["amenity"="restaurant"]'] },
  { key: "bakery", label: "Bakeries", tags: ['["shop"="bakery"]', '["shop"="pastry"]'] },
  { key: "hair", label: "Hair & barber salons", tags: ['["shop"="hairdresser"]'] },
  { key: "beauty", label: "Beauty & nail salons", tags: ['["shop"="beauty"]'] },
  { key: "dentist", label: "Dentists", tags: ['["amenity"="dentist"]', '["healthcare"="dentist"]'] },
  { key: "clinic", label: "Clinics & doctors", tags: ['["amenity"="clinic"]', '["amenity"="doctors"]'] },
  { key: "physio", label: "Physiotherapists", tags: ['["healthcare"="physiotherapist"]'] },
  { key: "gym", label: "Gyms & studios", tags: ['["leisure"="fitness_centre"]'] },
  { key: "hotel", label: "Hotels & guest houses", tags: ['["tourism"="hotel"]', '["tourism"="guest_house"]'] },
  { key: "florist", label: "Florists", tags: ['["shop"="florist"]'] },
  { key: "fashion", label: "Fashion & boutiques", tags: ['["shop"="clothes"]', '["shop"="boutique"]'] },
  { key: "car", label: "Car repair", tags: ['["shop"="car_repair"]'] },
  { key: "estate", label: "Estate agents", tags: ['["office"="estate_agent"]'] },
  { key: "law", label: "Lawyers & accountants", tags: ['["office"="lawyer"]', '["office"="accountant"]'] },
  { key: "photo", label: "Photographers", tags: ['["craft"="photographer"]', '["shop"="photo"]'] },
];

export const categoryByKey = (k?: string) => categories.find((c) => c.key === k);

/** International number without "+" for wa.me links; adds the country code to national numbers. */
export function phoneForWhatsApp(raw: string | undefined, country?: string) {
  if (!raw) return undefined;
  const first = raw.split(/[;,/]/)[0].trim();
  let d = first.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d.slice(1);
  if (d.startsWith("00")) return d.slice(2);
  const c = countryByCode(country);
  if (!c) return undefined;
  if (d.startsWith("0")) d = d.slice(1);
  return d.length >= 6 ? c.calling + d : undefined;
}
