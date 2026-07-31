"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/lib/validations";
import { resetPassword } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/store/auth-card";
import { z } from "zod";

type FormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    const result = await resetPassword(data);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.push("/ingresar");
  }

  if (!token) {
    return (
      <AuthCard title="Enlace inválido">
        <p className="text-sm text-muted-foreground">
          El enlace de recuperación no es válido.{" "}
          <Link href="/recuperar-password" className="text-primary hover:underline">
            Solicitá uno nuevo
          </Link>
          .
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Restablecer contraseña" description="Elegí una nueva contraseña.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input type="hidden" {...register("token")} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" size="lg" className="mt-2 w-full rounded-full" disabled={loading}>
          {loading ? "Guardando..." : "Guardar nueva contraseña"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
