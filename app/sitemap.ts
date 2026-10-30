import type { MetadataRoute } from "next";
import { posts } from "./blog/posts";
import { services, site } from "./data";
import { locales } from "./i18n/locales";

type Entry = MetadataRoute.Sitemap[number];

/** /sitemap.xml: every public page. Service pages also list their German, French and Dutch versions. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const abs = (p: string) => `${site.url}${p}`;
  const page = (path: string, priority: number, changeFrequency: Entry["changeFrequency"], lastModified = now): Entry => ({
    url: abs(path),
    lastModified,
    changeFrequency,
    priority,
  });
  // the English page and its translations all point at each other
  const translated = (path: string, priority: number): Entry[] => {
    const languages = { en: abs(path), ...Object.fromEntries(locales.map((l) => [l, abs(`/${l}${path}`)])) };
    return [path, ...locales.map((l) => `/${l}${path}`)].map((p) => ({
      ...page(p, p === path ? priority : priority - 0.1, "monthly"),
      alternates: { languages },
    }));
  };
  return [
    page("", 1, "weekly"),
    ...translated("/services", 0.9),
    ...services.flatMap((s) => translated(`/services/${s.id}`, 0.9)),
    page("/blog", 0.7, "weekly"),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.7, "monthly", new Date(p.date))),
    page("/check", 0.8, "monthly"),
    page("/projects", 0.6, "monthly"),
    page("/about", 0.6, "monthly"),
    page("/contact", 0.7, "yearly"),
  ];
}
