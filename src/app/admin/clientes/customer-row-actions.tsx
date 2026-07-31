"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCustomer } from "@/actions/admin-customers";
import { Button } from "@/components/ui/button";

export function CustomerRowActions({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("¿Eliminar este cliente? Esta acción no se puede deshacer.")) return;

    startTransition(async () => {
      const result = await deleteCustomer(customerId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="icon-sm" disabled={isPending} onClick={handleDelete}>
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}
