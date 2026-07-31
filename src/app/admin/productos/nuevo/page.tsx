import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">Nuevo producto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
