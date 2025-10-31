import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/story-book`, lastModified: new Date() },
    { url: `${base}/create-story-book`, lastModified: new Date() },
  ];

  try {
    const res = await fetch(`${base}/api/storybooks`, { cache: "no-store" });
    if (!res.ok) return staticRoutes;
    const data = await res.json();
    if (!Array.isArray(data)) return staticRoutes;

    const dynamicRoutes: MetadataRoute.Sitemap = data.map((s: any) => ({
      url: `${base}/story-book/${encodeURIComponent(s.slug || s.id)}`,
      lastModified: new Date(s.updated_at || s.created_at || Date.now()),
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
