"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { CreditCard, Landmark, Clock } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { getAddresses, createAddress } from "@/actions/addresses";
import { createOrder, type CheckoutPaymentMethod } from "@/actions/orders";
import { addressSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { MERCADOPAGO_ALIAS, DELIVERY_SLOTS } from "@/lib/store-info";

type Address = Awaited<ReturnType<typeof getAddresses>>[number];
type AddressForm = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("MERCADO_PAGO");
  const [deliverySlot, setDeliverySlot] = useState<string>(DELIVERY_SLOTS[0].value);
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({ resolver: zodResolver(addressSchema) });

  useEffect(() => {
    if (status === "authenticated") {
      getAddresses().then((list) => {
        setAddresses(list);
        const def = list.find((a) => a.isDefault) ?? list[0];
        if (def) setSelectedAddressId(def.id);
        else setShowNewAddress(true);
      });
    }
  }, [status]);

  async function handleSaveAddress(data: AddressForm) {
    const result = await createAddress(data);
    if (!result.ok || !result.address) {
      toast.error(result.message ?? "No se pudo guardar la dirección");
      return;
    }
    setAddresses((prev) => [...prev, result.address]);
    setSelectedAddressId(result.address.id);
    setShowNewAddress(false);
    toast.success("Dirección guardada");
  }

  async function handleConfirm() {
    if (!selectedAddressId) {
      toast.error("Seleccioná o agregá una dirección de envío");
      return;
    }
    setSubmitting(true);
    const result = await createOrder(
      items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      { addressId: selectedAddressId },
      paymentMethod,
      { preferredSlot: deliverySlot, notes: deliveryNotes }
    );
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    clear();
    if (result.redirectUrl.startsWith("http")) {
      window.location.href = result.redirectUrl;
    } else {
      router.push(result.redirectUrl);
    }
  }

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold">Ingresá para continuar</h1>
        <p className="text-muted-foreground">Necesitás una cuenta para finalizar tu compra.</p>
        <Button className="rounded-full" render={<Link href="/ingresar?callbackUrl=/checkout" />}>
          Ingresar
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold">Tu carrito está vacío</h1>
        <Button className="rounded-full" render={<Link href="/productos" />}>
          Ver catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl font-semibold">Finalizar compra</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border p-5">
            <h2 className="mb-4 font-heading text-lg font-semibold">Dirección de envío</h2>

            <div className="flex flex-col gap-2">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1"
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />
                  <div className="text-sm">
                    <p className="font-medium">
                      {address.street}, {address.city}
                    </p>
                    <p className="text-muted-foreground">
                      {address.province}, CP {address.zip} · {address.phone}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setShowNewAddress((v) => !v)}
            >
              {showNewAddress ? "Cancelar" : "Agregar nueva dirección"}
            </Button>

            {showNewAddress && (
              <form
                onSubmit={handleSubmit(handleSaveAddress)}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <Label htmlFor="street">Calle y número</Label>
                  <Input id="street" {...register("street")} />
                  {errors.street && (
                    <p className="text-sm text-destructive">{errors.street.message}</p>
                  )}
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
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="sm" className="rounded-full">
                    Guardar dirección
                  </Button>
                </div>
              </form>
            )}
          </section>

          <section className="rounded-2xl border border-border p-5">
            <h2 className="mb-4 font-heading text-lg font-semibold">Método de pago</h2>

            <div className="flex flex-col gap-3">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                  paymentMethod === "MERCADO_PAGO" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mt-1"
                  checked={paymentMethod === "MERCADO_PAGO"}
                  onChange={() => setPaymentMethod("MERCADO_PAGO")}
                />
                <Landmark className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Transferencia por Mercado Pago</p>
                  <p className="text-muted-foreground">
                    Transferí el total a este alias y tu pedido queda registrado como pendiente
                    de pago hasta que confirmemos la transferencia.
                  </p>
                  {paymentMethod === "MERCADO_PAGO" && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 font-mono text-sm font-semibold">
                      {MERCADOPAGO_ALIAS}
                    </div>
                  )}
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                  paymentMethod === "TARJETA" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mt-1"
                  checked={paymentMethod === "TARJETA"}
                  onChange={() => setPaymentMethod("TARJETA")}
                />
                <CreditCard className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Tarjeta de débito o crédito</p>
                  <p className="text-muted-foreground">
                    Pagás con posnet cuando recibís el pedido en la dirección de entrega.
                  </p>
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-border p-5">
            <h2 className="mb-1 flex items-center gap-2 font-heading text-lg font-semibold">
              <Clock className="size-5 text-primary" /> Horario de entrega
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Elegí el horario que más te acomode para recibir tu pedido.
            </p>

            <div className="flex flex-col gap-2">
              {DELIVERY_SLOTS.map((slot) => (
                <label
                  key={slot.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${
                    deliverySlot === slot.value ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliverySlot"
                    className="shrink-0"
                    checked={deliverySlot === slot.value}
                    onChange={() => setDeliverySlot(slot.value)}
                  />
                  {slot.label}
                </label>
              ))}
            </div>

            <div className="mt-4">
              <Label htmlFor="deliveryNotes">Aclaración adicional (opcional)</Label>
              <Textarea
                id="deliveryNotes"
                placeholder="Ej: preferentemente los jueves, o después de las 17hs"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={2}
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Tu pedido</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium">{item.name}</p>
                  <p className="text-muted-foreground">Cantidad: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency((item.offerPrice ?? item.price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between font-heading text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button
            size="lg"
            className="mt-6 w-full rounded-full"
            disabled={submitting}
            onClick={handleConfirm}
          >
            {submitting ? "Procesando..." : "Confirmar y pagar"}
          </Button>
        </aside>
      </div>
    </div>
  );
}
