import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export type ProductFilters = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "price-asc" | "price-desc" | "newest" | "bestselling";
  page?: number;
  pageSize?: number;
};

export async function getProducts(filters: ProductFilters = {}) {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    inStock,
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = filters;

  const where: Prisma.ProductWhereInput = {
    active: true,
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(brand ? { brand: { equals: brand, mode: "insensitive" as const } } : {}),
    ...(inStock ? { stock: { gt: 0 } } : {}),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "bestselling"
          ? { soldCount: "desc" }
          : { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, reviews: { include: { user: true }, orderBy: { createdAt: "desc" } } },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, active: true, id: { not: excludeId } },
    take: 4,
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function serializeProduct<T extends { price: Prisma.Decimal; offerPrice: Prisma.Decimal | null }>(
  product: T
) {
  return {
    ...product,
    price: Number(product.price),
    offerPrice: product.offerPrice ? Number(product.offerPrice) : null,
  };
}

export async function getBrands() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { brand: true },
    distinct: ["brand"],
  });
  return products.map((p) => p.brand).sort();
}
