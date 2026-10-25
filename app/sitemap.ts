import type { MetadataRoute } from "next";
import { site } from "./data";

/** /sitemap.xml: every public page, so search engines find them all. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/services", 0.9, "weekly"],
    ["/check", 0.8, "monthly"],
    ["/projects", 0.7, "monthly"],
    ["/about", 0.6, "monthly"],
    ["/contact", 0.7, "yearly"],
  ];
  const now = new Date();
  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
