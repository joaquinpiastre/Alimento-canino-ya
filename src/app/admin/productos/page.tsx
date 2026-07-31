import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProducts } from "@/actions/admin-products";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductRowActions } from "./product-row-actions";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Productos</h1>
          <p className="text-sm text-muted-foreground">{products.length} productos</p>
        </div>
        <Button className="rounded-full" render={<Link href="/admin/productos/nuevo" />}>
          <Plus className="size-4" /> Nuevo producto
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Producto</th>
              <th className="p-3 font-medium">Categoría</th>
              <th className="p-3 font-medium">Precio</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Estado</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.sku}</div>
                </td>
                <td className="p-3 text-muted-foreground">{product.category.name}</td>
                <td className="p-3">
                  {formatCurrency(Number(product.offerPrice ?? product.price))}
                  {product.offerPrice && (
                    <span className="ml-1 text-xs text-muted-foreground line-through">
                      {formatCurrency(Number(product.price))}
                    </span>
                  )}
                </td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <Badge variant={product.active ? "default" : "secondary"}>
                    {product.active ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="p-3">
                  <ProductRowActions productId={product.id} active={product.active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
