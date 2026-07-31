"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema, type ReviewInput } from "@/lib/validations";

export async function submitReview(productId: string, input: ReviewInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Ingresá para dejar una reseña" };
  }

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false, message: "Producto no encontrado" };

  await prisma.review.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { rating: parsed.data.rating, comment: parsed.data.comment },
    create: {
      userId: session.user.id,
      productId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  revalidatePath(`/productos/${product.slug}`);
  return { ok: true, message: "¡Gracias por tu reseña!" };
}
