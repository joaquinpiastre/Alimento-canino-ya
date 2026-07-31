"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Star, Trash2 } from "lucide-react";
import { addressSchema, type AddressInput } from "@/lib/validations";
import { createAddress, deleteAddress, setDefaultAddress } from "@/actions/addresses";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Address = {
  id: string;
  street: string;
  city: string;
  province: string;
  zip: string;
  phone: string;
  isDefault: boolean;
};

export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(initialAddresses.length === 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({ resolver: zodResolver(addressSchema) });

  async function onSubmit(data: AddressInput) {
    const result = await createAddress(data);
    if (!result.ok || !result.address) {
      toast.error(result.message ?? "Error al guardar");
      return;
    }
    setAddresses((prev) => [...prev, result.address]);
    reset();
    setShowForm(false);
    toast.success("Dirección guardada");
  }

  async function handleDelete(id: string) {
    await deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleSetDefault(id: string) {
    await setDefaultAddress(id);
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={cn(
            "flex items-start justify-between rounded-2xl border p-4",
            address.isDefault ? "border-primary bg-primary/5" : "border-border"
          )}
        >
          <div className="text-sm">
            <p className="font-medium">
              {address.street}, {address.city}
              {address.isDefault && (
                <span className="ml-2 text-xs font-normal text-primary">Predeterminada</span>
              )}
            </p>
            <p className="text-muted-foreground">
              {address.province}, CP {address.zip} · {address.phone}
            </p>
          </div>
          <div className="flex gap-2">
            {!address.isDefault && (
              <button
                onClick={() => handleSetDefault(address.id)}
                title="Marcar como predeterminada"
                className="text-muted-foreground hover:text-primary"
              >
                <Star className="size-4" />
              </button>
            )}
            <button
              onClick={() => handleDelete(address.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <Label htmlFor="street">Calle y número</Label>
            <Input id="street" {...register("street")} />
            {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
          </div>
          <div>
            <Label htmlFor="city">Ciudad</Label>
            <Input id="city" {...register("city")} />
            {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
          </div>
          <div>
            <Label htmlFor="province">Provincia</Label>
            <Input id="province" {...register("province")} />
            {errors.province && (
              <p className="text-sm text-destructive">{errors.province.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="zip">Código postal</Label>
            <Input id="zip" {...register("zip")} />
            {errors.zip && <p className="text-sm text-destructive">{errors.zip.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" size="sm" className="rounded-full">
              Guardar dirección
            </Button>
            {addresses.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Button variant="outline" className="w-fit rounded-full" onClick={() => setShowForm(true)}>
          <Plus className="size-4" /> Agregar dirección
        </Button>
      )}
    </div>
  );
}
