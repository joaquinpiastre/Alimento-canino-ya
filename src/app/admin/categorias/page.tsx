import { prisma } from "@/lib/prisma";
import { CategoryManager } from "./category-manager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Categorías</h1>
        <p className="text-sm text-muted-foreground">{categories.length} categorías</p>
      </div>
      <CategoryManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          image: c.image,
          productsCount: c._count.products,
        }))}
      />
    </div>
  );
}
