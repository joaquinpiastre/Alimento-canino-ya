"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/lib/validations";
import { requestPasswordReset } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/store/auth-card";
import { z } from "zod";

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    const result = await requestPasswordReset(data);
    setLoading(false);
    setSent(true);
    if (!result.ok) toast.error(result.message);
  }

  return (
    <AuthCard
      title="Recuperar contraseña"
      description="Te enviamos un link para restablecerla."
      footer={
        <Link href="/ingresar" className="font-medium text-primary hover:underline">
          Volver a ingresar
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-muted-foreground">
          Si el email está registrado, vas a recibir un correo con instrucciones para
          restablecer tu contraseña en los próximos minutos.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" size="lg" className="mt-2 w-full rounded-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
