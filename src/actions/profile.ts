"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema, type ProfileInput } from "@/lib/validations";

type ProfileInputType = ProfileInput;

export async function updateProfile(input: ProfileInputType) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "No autorizado" };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
  });

  revalidatePath("/mi-cuenta");
  return { ok: true, message: "Datos actualizados" };
}
