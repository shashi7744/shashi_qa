import type { MetadataRoute } from "next";
import { posts } from "./blog/posts";
import { services, site } from "./data";

/** /sitemap.xml: every public page, so search engines find them all. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], lastModified = now) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/services", 0.9, "weekly"),
    ...services.map((s) => page(`/services/${s.id}`, 0.9, "monthly")),
    page("/blog", 0.7, "weekly"),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.7, "monthly", new Date(p.date))),
    page("/check", 0.8, "monthly"),
    page("/projects", 0.6, "monthly"),
    page("/about", 0.6, "monthly"),
    page("/contact", 0.7, "yearly"),
  ];
}
