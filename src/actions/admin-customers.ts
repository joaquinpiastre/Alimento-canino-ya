"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
}

export async function deleteCustomer(id: string) {
  await requireAdmin();

  const customer = await prisma.user.findUnique({ where: { id } });
  if (!customer) return { ok: false, message: "Cliente no encontrado" };
  if (customer.role === "ADMIN") {
    return { ok: false, message: "No podés eliminar una cuenta de administrador" };
  }

  const orderCount = await prisma.order.count({ where: { userId: id } });
  if (orderCount > 0) {
    return {
      ok: false,
      message: "No podés eliminar un cliente con pedidos registrados",
    };
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/clientes");
  return { ok: true, message: "Cliente eliminado" };
}
