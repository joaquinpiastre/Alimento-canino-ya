"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { toggleProductActive, deleteProduct } from "@/actions/admin-products";
import { Button } from "@/components/ui/button";

export function ProductRowActions({
  productId,
  active,
}: {
  productId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleProductActive(productId, !active);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    startTransition(async () => {
      await deleteProduct(productId);
      toast.success("Producto eliminado");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" render={<Link href={`/admin/productos/${productId}`} />}>
        <Pencil className="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" disabled={isPending} onClick={handleToggle}>
        {active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
      <Button variant="ghost" size="icon-sm" disabled={isPending} onClick={handleDelete}>
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}
