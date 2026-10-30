import { categoryByKey, countryByCode } from "./europe";

/* Finds local businesses in a European city from OpenStreetMap (free, open data, ODbL licence).
   Nominatim turns the city into a map area; Overpass lists the businesses inside it.
   Both services ask for light use: one search at a time, and an identifying User-Agent. */

const UA = "ShashiStudio-LeadAgent/1.0 (+https://www.shashistudio.online)";

export type Place = {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  city: string;
  country: string; // ISO code
  category: string; // category key
  osmUrl: string;
};

export type PlaceSearch = { country: string; city: string; category: string; mode: "website" | "none"; limit?: number };

const clean = (s?: string) => s?.split(";")[0].trim() || undefined;

function normalizeWebsite(raw?: string) {
  const w = clean(raw);
  if (!w) return undefined;
  try {
    const u = new URL(/^https?:\/\//i.test(w) ? w : `https://${w}`);
    // social profiles are not a website of their own
    if (/(^|\.)(facebook|instagram|tiktok|linktr|google)\.[a-z.]+$/i.test(u.hostname)) return undefined;
    return u.href;
  } catch {
    return undefined;
  }
}

type OsmElement = { type: string; id: number; tags?: Record<string, string> };

/* Public Overpass servers are often at capacity. Ask several at once and use the first good answer.
   This runs in the admin's browser, so there is no 60 s server limit and no shared server IP. */
const OVERPASS = [
  "https://overpass-api.de/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const inBrowser = typeof window !== "undefined";
const headers = (extra: Record<string, string>) => (inBrowser ? extra : { "User-Agent": UA, ...extra }); // browsers send their own

async function overpass(query: string): Promise<OsmElement[]> {
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), 90000);
  try {
    return await Promise.any(
      OVERPASS.map(async (endpoint) => {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: headers({ "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }),
          body: "data=" + encodeURIComponent(query),
          signal: stop.signal,
        });
        const text = await res.text();
        if (!res.ok || !text.trimStart().startsWith("{")) throw new Error("busy");
        return (JSON.parse(text).elements || []) as OsmElement[];
      })
    );
  } catch {
    throw new Error("The map servers are busy right now. Try again in a few minutes, or try a smaller city.");
  } finally {
    clearTimeout(timer);
    stop.abort(); // cancel the slower servers
  }
}

export async function findPlaces({ country, city, category, mode, limit = 40 }: PlaceSearch): Promise<Place[]> {
  const c = countryByCode(country);
  const cat = categoryByKey(category);
  if (!c) throw new Error("Pick a country.");
  if (!cat) throw new Error("Pick a type of business.");
  if (!city.trim()) throw new Error("Enter a city.");

  // 1. city -> bounding box
  const geo = new URL("https://nominatim.openstreetmap.org/search");
  geo.searchParams.set("format", "jsonv2");
  geo.searchParams.set("limit", "1");
  geo.searchParams.set("q", city.trim());
  geo.searchParams.set("countrycodes", c.code.toLowerCase());
  geo.searchParams.set("accept-language", "en"); // as a parameter: a custom header would trigger a CORS preflight
  const g = await fetch(geo, { headers: headers({}), signal: AbortSignal.timeout(15000) });
  if (!g.ok) throw new Error("The map search is busy. Try again in a minute.");
  const hit = (await g.json())[0];
  if (!hit?.boundingbox) throw new Error(`Couldn't find "${city}" in ${c.name}. Check the spelling.`);
  const [south, north, west, east] = hit.boundingbox.map(Number);
  const bbox = `${south},${west},${north},${east}`;

  // 2. businesses of that kind inside the box
  const parts = cat.tags.map((t) => `nwr${t}["name"](${bbox});`).join("\n");
  const query = `[out:json][timeout:60];\n(\n${parts}\n);\nout tags center 400;`;
  const elements = await overpass(query);

  const out: Place[] = [];
  const seen = new Set<string>();
  for (const e of elements) {
    const t = e.tags || {};
    if (!t.name || t.brand || t["brand:wikidata"]) continue; // skip chains: they have head offices and agencies
    const website = normalizeWebsite(t.website || t["contact:website"] || t.url);
    if (mode === "website" ? !website : website) continue;
    const key = website ? new URL(website).hostname.replace(/^www\./, "") : `${t.name}|${t["addr:street"] || ""}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      name: t.name,
      website,
      email: clean(t.email || t["contact:email"]),
      phone: clean(t.phone || t["contact:phone"] || t["contact:mobile"] || t.mobile),
      whatsapp: clean(t["contact:whatsapp"]),
      city: t["addr:city"] || city.trim(),
      country: c.code,
      category: cat.key,
      osmUrl: `https://www.openstreetmap.org/${e.type}/${e.id}`,
    });
  }
  // businesses with a way to reach them first
  out.sort((a, b) => Number(!!(b.email || b.phone)) - Number(!!(a.email || a.phone)));
  return out.slice(0, limit);
}
