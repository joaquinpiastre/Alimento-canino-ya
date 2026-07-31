"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { updateProfile } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProfileForm({
  defaultValues,
  email,
}: {
  defaultValues: ProfileInput;
  email: string;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues });

  async function onSubmit(data: ProfileInput) {
    setLoading(true);
    const result = await updateProfile(data);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Email</Label>
          <Input value={email} disabled />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <Button type="submit" className="w-fit rounded-full" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>

      <div className="border-t border-border pt-4">
        <Button variant="outline" className="rounded-full" onClick={() => signOut({ callbackUrl: "/" })}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
