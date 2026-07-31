import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts, serializeProduct } from "@/lib/products";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductDetailActions } from "@/components/store/product-detail-actions";
import { ProductReviews } from "@/components/store/product-reviews";
import { formatCurrency } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  const price = Number(product.price);
  const offerPrice = product.offerPrice ? Number(product.offerPrice) : null;
  const hasOffer = offerPrice !== null && offerPrice < price;
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/productos" className="hover:text-foreground">
          Productos
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/productos?categoria=${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </span>
          <h1 className="mt-1 font-heading text-3xl font-semibold">{product.name}</h1>

          {product.reviews.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              ⭐ {avgRating.toFixed(1)} ({product.reviews.length} reseñas)
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="font-heading text-3xl font-semibold text-primary">
              {formatCurrency(hasOffer ? offerPrice! : price)}
            </span>
            {hasOffer && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(price)}
              </span>
            )}
          </div>

          <p className="mt-5 whitespace-pre-line text-muted-foreground">{product.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {product.weight && (
              <div>
                <dt className="text-muted-foreground">Presentación</dt>
                <dd className="font-medium">{product.weight}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">SKU</dt>
              <dd className="font-medium">{product.sku}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Disponibilidad</dt>
              <dd className="font-medium">
                {product.stock > 0 ? `${product.stock} unidades` : "Sin stock"}
              </dd>
            </div>
          </dl>

          <ProductDetailActions product={serializeProduct(product)} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-heading text-2xl font-semibold">Productos relacionados</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={serializeProduct(p)} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <ProductReviews
          productId={product.id}
          reviews={product.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            userName: r.user.name,
            createdAt: r.createdAt.toISOString(),
          }))}
        />
      </section>
    </div>
  );
}
