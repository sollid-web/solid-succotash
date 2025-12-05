import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Derive base URL from environment with a sensible default and normalize trailing slashes
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://wolvcapital.com";

  // Static routes
  const staticRoutes: MetadataRoute.SitemapItem[] = [
    { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/about`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/security`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/withdrawal-policy`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/leadership`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/faq`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/contact`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/privacy`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/terms-of-service`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/risk-disclosure`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/blog`, lastModified: new Date().toISOString() }
  ];

  // If you have a single plans overview page
  staticRoutes.push({ url: `${baseUrl}/plans`, lastModified: new Date().toISOString() });

  // If you list individual plan pages, include them explicitly or generate dynamically.
  // Example: multiple plan slugs - edit to match your plan slugs.
  const planSlugs = ["pioneer", "vanguard", "horizon", "summit", "vip", "retirement"];
  const planRoutes = planSlugs.map(slug => ({
    url: `${baseUrl}/plans/${slug}`,
    lastModified: new Date().toISOString()
  }));

  // Combine everything
  return [...staticRoutes, ...planRoutes];
}
