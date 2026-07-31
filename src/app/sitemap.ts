import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/productos`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({
      url: `${baseUrl}/productos?categoria=${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((p) => ({
      url: `${baseUrl}/productos/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
