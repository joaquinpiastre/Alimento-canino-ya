import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminProduct } from "@/actions/admin-products";
import { ProductForm } from "../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">Editar producto</h1>
      <ProductForm
        categories={categories}
        productId={product.id}
        defaultValues={{
          name: product.name,
          description: product.description,
          price: Number(product.price),
          offerPrice: product.offerPrice ? Number(product.offerPrice) : undefined,
          stock: product.stock,
          sku: product.sku,
          images: product.images,
          brand: product.brand,
          weight: product.weight ?? "",
          categoryId: product.categoryId,
          featured: product.featured,
          active: product.active,
        }}
      />
    </div>
  );
}
