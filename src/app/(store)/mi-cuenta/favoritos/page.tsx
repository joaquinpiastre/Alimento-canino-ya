import Link from "next/link";
import { redirect } from "next/navigation";
import { HeartOff } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";
import { serializeProduct } from "@/lib/products";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar");

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
        <HeartOff className="size-10 text-muted-foreground" />
        <p className="font-medium">Todavía no agregaste favoritos</p>
        <Link href="/productos" className="text-sm text-primary hover:underline">
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {wishlist.map(({ product }) => (
        <ProductCard key={product.id} product={serializeProduct(product)} />
      ))}
    </div>
  );
}
