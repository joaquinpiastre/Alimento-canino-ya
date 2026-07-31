import type { Metadata } from "next";
import { getProducts, getCategories, getBrands, serializeProduct } from "@/lib/products";
import { ProductCard } from "@/components/store/product-card";
import { ProductFilters } from "@/components/store/product-filters";
import { ProductSort } from "@/components/store/product-sort";
import { Pagination } from "@/components/store/pagination";
import { MobileFilters } from "@/components/store/mobile-filters";
import { PackageSearch } from "lucide-react";

export const metadata: Metadata = { title: "Catálogo de productos" };

type SearchParams = {
  q?: string;
  categoria?: string;
  marca?: string;
  precioMin?: string;
  precioMax?: string;
  stock?: string;
  orden?: string;
  pagina?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.pagina) || 1;

  const sortMap: Record<string, "price-asc" | "price-desc" | "newest" | "bestselling"> = {
    "precio-asc": "price-asc",
    "precio-desc": "price-desc",
    nuevos: "newest",
    "mas-vendidos": "bestselling",
  };

  const [{ items, totalPages, total }, categories, brands] = await Promise.all([
    getProducts({
      search: params.q,
      category: params.categoria,
      brand: params.marca,
      minPrice: params.precioMin ? Number(params.precioMin) : undefined,
      maxPrice: params.precioMax ? Number(params.precioMax) : undefined,
      inStock: params.stock === "1",
      sort: sortMap[params.orden ?? ""] ?? "newest",
      page,
      pageSize: 12,
    }),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Catálogo</h1>
          <p className="text-sm text-muted-foreground">{total} productos encontrados</p>
        </div>
        <div className="flex gap-2">
          <MobileFilters categories={categories} brands={brands} />
          <ProductSort />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters categories={categories} brands={brands} />
        </aside>

        <div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
              <PackageSearch className="size-10 text-muted-foreground" />
              <p className="font-medium">No encontramos productos con esos filtros</p>
              <p className="text-sm text-muted-foreground">Probá ajustando la búsqueda.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {items.map((product) => (
                  <ProductCard key={product.id} product={serializeProduct(product)} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
