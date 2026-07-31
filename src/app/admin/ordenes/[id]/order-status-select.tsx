"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/admin-orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS_LABELS } from "@/lib/utils";
import type { $Enums } from "@/generated/prisma/client";

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (!value) return;
    startTransition(async () => {
      await updateOrderStatus(orderId, value as $Enums.OrderStatus);
      toast.success("Estado actualizado");
      router.refresh();
    });
  }

  return (
    <Select items={ORDER_STATUS_LABELS} value={currentStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
