"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="size-16 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-semibold">Tu carrito está vacío</h1>
        <p className="text-muted-foreground">Explorá el catálogo y agregá tus productos favoritos.</p>
        <Button className="rounded-full" render={<Link href="/productos" />}>
          Ver catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl font-semibold">Tu carrito</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
          {items.map((item) => {
            const unitPrice = item.offerPrice ?? item.price;
            return (
              <li key={item.productId} className="flex gap-4 p-4">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/productos/${item.slug}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{formatCurrency(unitPrice)} c/u</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        className="p-2 disabled:opacity-40"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        className="p-2 disabled:opacity-40"
                        disabled={item.quantity >= item.stock}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="size-4" /> Quitar
                    </button>
                  </div>
                </div>
                <span className="font-heading font-semibold">
                  {formatCurrency(unitPrice * item.quantity)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Resumen</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className="font-medium">Se calcula en el checkout</span>
          </div>
          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between font-heading text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button
            size="lg"
            className="mt-6 w-full rounded-full"
            render={<Link href="/checkout" />}
          >
            Finalizar compra
          </Button>
        </div>
      </div>
    </div>
  );
}
