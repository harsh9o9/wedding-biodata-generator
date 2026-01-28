import { MetadataRoute } from "next";

/**
 * Generate robots.txt configuration for SEO
 * Controls which pages search engines can crawl
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://biodata-generator.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
