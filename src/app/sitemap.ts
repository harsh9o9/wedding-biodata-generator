import { MetadataRoute } from "next";

/**
 * Generate sitemap for SEO optimization
 * Helps search engines discover and index pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://biodata-generator.vercel.app";
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/editor`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
