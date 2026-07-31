"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/store/auth-card";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/mi-cuenta";
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      toast.error("Email o contraseña incorrectos");
      return;
    }
    toast.success("¡Bienvenido de nuevo!");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthCard
      title="Ingresá a tu cuenta"
      description="Accedé para ver tus pedidos y comprar más rápido."
      footer={
        <>
          ¿No tenés cuenta?{" "}
          <Link href="/registrarse" className="font-medium text-primary hover:underline">
            Registrate
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link href="/recuperar-password" className="text-xs text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" size="lg" className="mt-2 w-full rounded-full" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </AuthCard>
  );
}
