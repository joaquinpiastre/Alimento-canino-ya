"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema, type AddressInput } from "@/lib/validations";

export async function getAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });
}

export async function createAddress(input: AddressInput) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Ingresá para guardar direcciones" };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const userId = session.user.id;

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: { ...parsed.data, userId },
  });

  revalidatePath("/mi-cuenta/direcciones");
  return { ok: true, address };
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "No autorizado" };

  await prisma.address.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/mi-cuenta/direcciones");
  return { ok: true };
}

export async function setDefaultAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "No autorizado" };

  const userId = session.user.id;
  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.address.updateMany({ where: { id, userId }, data: { isDefault: true } }),
  ]);

  revalidatePath("/mi-cuenta/direcciones");
  return { ok: true };
}
