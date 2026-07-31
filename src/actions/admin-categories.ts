"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { slugify } from "@/lib/slug";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
}

export async function createCategory(input: CategoryInput) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = slugify(parsed.data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { ok: false, message: "Ya existe una categoría con ese nombre" };

  await prisma.category.create({ data: { ...parsed.data, slug } });
  revalidatePath("/admin/categorias");
  return { ok: true, message: "Categoría creada" };
}

export async function updateCategory(id: string, input: CategoryInput) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/categorias");
  return { ok: true, message: "Categoría actualizada" };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    return { ok: false, message: "No podés eliminar una categoría con productos asociados" };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  return { ok: true };
}
