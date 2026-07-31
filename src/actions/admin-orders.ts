"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { $Enums } from "@/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
}

export async function getAdminOrders(filters: {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
}) {
  await requireAdmin();

  return prisma.order.findMany({
    where: {
      ...(filters.status ? { status: filters.status as $Enums.OrderStatus } : {}),
      ...(filters.search
        ? {
            OR: [
              { orderNumber: { contains: filters.search, mode: "insensitive" } },
              { user: { name: { contains: filters.search, mode: "insensitive" } } },
              { user: { email: { contains: filters.search, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(filters.from || filters.to
        ? {
            createdAt: {
              ...(filters.from ? { gte: new Date(filters.from) } : {}),
              ...(filters.to ? { lte: new Date(filters.to) } : {}),
            },
          }
        : {}),
    },
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, status: $Enums.OrderStatus) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/ordenes");
  revalidatePath(`/admin/ordenes/${id}`);
  return { ok: true };
}
