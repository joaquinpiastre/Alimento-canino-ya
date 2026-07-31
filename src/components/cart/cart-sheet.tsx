"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartSheet() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Tu carrito</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">Todavía no agregaste productos.</p>
            <Button
              onClick={() => setIsOpen(false)}
              className="rounded-full"
              render={<Link href="/productos" />}
            >
              Ver catálogo
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => {
                  const unitPrice = item.offerPrice ?? item.price;
                  return (
                    <li key={item.productId} className="flex gap-3">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <Link
                          href={`/productos/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="line-clamp-2 text-sm font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        <span className="text-sm font-semibold text-primary">
                          {formatCurrency(unitPrice)}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-full border border-border">
                            <button
                              className="p-1.5 disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                            <button
                              className="p-1.5 disabled:opacity-40"
                              disabled={item.quantity >= item.stock}
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <button
                            className="ml-auto text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Separator />
            <SheetFooter className="gap-3">
              <div className="flex w-full items-center justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Button
                size="lg"
                className="w-full rounded-full"
                onClick={() => setIsOpen(false)}
                render={<Link href="/carrito" />}
              >
                Ver carrito
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full"
                onClick={() => setIsOpen(false)}
                render={<Link href="/checkout" />}
              >
                Finalizar compra
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
