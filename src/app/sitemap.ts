import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getPosts } from "@/lib/wp";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/platform", "/how-it-works", "/integrations", "/about-us", "/careers", "/blog", "/early-access"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const [blog, jobs] = await Promise.all([getPosts("blog"), getPosts("job")]);
  const posts = [...(blog ?? []), ...(jobs ?? [])].map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    lastModified: new Date(p.modified),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...posts];
}
