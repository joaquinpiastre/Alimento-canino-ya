"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput,
} from "@/lib/validations";

export type ActionResult = { ok: boolean; message: string };

export async function registerUser(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { ok: false, message: "Ya existe una cuenta con ese email" };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      password: hashed,
      role: "CUSTOMER",
    },
  });

  return { ok: true, message: "Cuenta creada correctamente" };
}

export async function requestPasswordReset(input: { email: string }): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Email inválido" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Always return success to avoid leaking which emails are registered.
  if (!user) {
    return { ok: true, message: "Si el email existe, vas a recibir instrucciones." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await prisma.passwordResetToken.create({
    data: { email: user.email, token, expires },
  });

  // Hook listo para enviar el email real (Resend, Nodemailer, etc.).
  console.log(
    `[reset-password] Link para ${user.email}: /restablecer-password?token=${token}`
  );

  return { ok: true, message: "Si el email existe, vas a recibir instrucciones." };
}

export async function resetPassword(input: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return { ok: false, message: "El enlace expiró o no es válido. Solicitá uno nuevo." };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.delete({ where: { token: parsed.data.token } }),
  ]);

  return { ok: true, message: "Contraseña actualizada. Ya podés ingresar." };
}
