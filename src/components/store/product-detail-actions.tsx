"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { isInWishlist, toggleWishlist } from "@/actions/wishlist";
import { cn } from "@/lib/utils";
import type { ProductCardProduct } from "@/components/store/product-card";

export function ProductDetailActions({ product }: { product: ProductCardProduct }) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (session?.user) {
      isInWishlist(product.id).then(setWishlisted);
    }
  }, [session?.user, product.id]);

  const outOfStock = product.stock <= 0;

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] ?? "",
        price: Number(product.price),
        offerPrice: product.offerPrice ? Number(product.offerPrice) : null,
        stock: product.stock,
      },
      quantity
    );
    toast.success(`${quantity} x ${product.name} agregado al carrito`);
  }

  function handleWishlist() {
    if (!session?.user) {
      toast.error("Ingresá para guardar en favoritos");
      return;
    }
    startTransition(async () => {
      const result = await toggleWishlist(product.id);
      if (result.ok) setWishlisted(!!result.added);
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border">
          <button
            className="p-2.5 disabled:opacity-40"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-8 text-center font-medium">{quantity}</span>
          <button
            className="p-2.5 disabled:opacity-40"
            disabled={quantity >= product.stock}
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1 rounded-full"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="size-4" />
          {outOfStock ? "Sin stock" : "Agregar al carrito"}
        </Button>

        <Button
          variant="outline"
          size="icon-lg"
          className="rounded-full"
          disabled={isPending}
          onClick={handleWishlist}
        >
          <Heart className={cn("size-5", wishlisted && "fill-primary text-primary")} />
        </Button>
      </div>
    </div>
  );
}
