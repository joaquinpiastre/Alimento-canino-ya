"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/utils";

export type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  offerPrice: number | string | null;
  images: string[];
  stock: number;
  brand: string;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const { addItem } = useCart();
  const price = Number(product.price);
  const offerPrice = product.offerPrice ? Number(product.offerPrice) : null;
  const hasOffer = offerPrice !== null && offerPrice < price;
  const outOfStock = product.stock <= 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] ?? "",
        price,
        offerPrice,
        stock: product.stock,
      },
      1
    );
    toast.success(`${product.name} agregado al carrito`);
  }

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {hasOffer && (
          <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground">Oferta</Badge>
        )}
        {outOfStock && (
          <Badge variant="secondary" className="absolute right-2 top-2">
            Sin stock
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </span>
        <h3 className="line-clamp-2 flex-1 text-sm font-medium">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-heading text-lg font-semibold text-primary">
            {formatCurrency(hasOffer ? offerPrice! : price)}
          </span>
          {hasOffer && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(price)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="mt-2 w-full rounded-full"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="size-4" />
          {outOfStock ? "Sin stock" : "Agregar"}
        </Button>
      </div>
    </Link>
  );
}
