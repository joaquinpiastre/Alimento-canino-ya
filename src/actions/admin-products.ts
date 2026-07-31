"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductInput } from "@/lib/validations";
import { slugify } from "@/lib/slug";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
}

export async function createProduct(input: ProductInput) {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = slugify(parsed.data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return { ok: false, message: "Ya existe un producto con ese nombre" };
  }

  await prisma.product.create({
    data: { ...parsed.data, slug, offerPrice: parsed.data.offerPrice ?? null },
  });

  revalidatePath("/admin/productos");
  return { ok: true, message: "Producto creado" };
}

export async function updateProduct(id: string, input: ProductInput) {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.product.update({
    where: { id },
    data: { ...parsed.data, offerPrice: parsed.data.offerPrice ?? null },
  });

  revalidatePath("/admin/productos");
  return { ok: true, message: "Producto actualizado" };
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active } });
  revalidatePath("/admin/productos");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/productos");
  return { ok: true };
}

export async function getAdminProducts(search?: string) {
  await requireAdmin();
  return prisma.product.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProduct(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({ where: { id } });
}
