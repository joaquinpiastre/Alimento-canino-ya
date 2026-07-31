"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function isInWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
  return !!item;
}

export async function toggleWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Ingresá para guardar favoritos" };
  }

  const userId = session.user.id;
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/mi-cuenta/favoritos");
    return { ok: true, added: false };
  }

  await prisma.wishlistItem.create({ data: { userId, productId } });
  revalidatePath("/mi-cuenta/favoritos");
  return { ok: true, added: true };
}
