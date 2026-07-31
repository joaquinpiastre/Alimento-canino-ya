"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ServerCartItem = {
  productId: string;
  quantity: number;
};

export async function getServerCart(): Promise<ServerCartItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    select: { productId: true, quantity: true },
  });

  return items;
}

export async function syncServerCart(items: ServerCartItem[]) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };

  const userId = session.user.id;

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { userId } }),
    ...(items.length > 0
      ? [
          prisma.cartItem.createMany({
            data: items.map((item) => ({
              userId,
              productId: item.productId,
              quantity: item.quantity,
            })),
          }),
        ]
      : []),
  ]);

  return { ok: true };
}
