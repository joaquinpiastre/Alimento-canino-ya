"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { registerUser } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/store/auth-card";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    const result = await registerUser(data);

    if (!result.ok) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);

    if (signInRes?.error) {
      toast.success("Cuenta creada. Ingresá con tu email y contraseña.");
      router.push("/ingresar");
      return;
    }

    toast.success("¡Cuenta creada! Bienvenido a Alimento Canino Ya.");
    router.push("/mi-cuenta");
    router.refresh();
  }

  return (
    <AuthCard
      title="Creá tu cuenta"
      description="Sumate para comprar más rápido y hacer seguimiento de tus pedidos."
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link href="/ingresar" className="font-medium text-primary hover:underline">
            Ingresá
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nombre completo</Label>
          <Input id="name" placeholder="Tu nombre" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input id="phone" placeholder="+54 9 11..." {...register("phone")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" size="lg" className="mt-2 w-full rounded-full" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </AuthCard>
  );
}
