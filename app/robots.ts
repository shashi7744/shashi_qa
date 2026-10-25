import type { MetadataRoute } from "next";
import { site } from "./data";

/** /robots.txt: index the public site, keep the private agent and APIs out of search results. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
