"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function exportCsv() {
    const header = [
      "Número",
      "Cliente",
      "Email",
      "Fecha",
      "Productos",
      "Total",
      "Método de pago",
      "Estado",
    ];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.customerName,
      o.customerEmail,
      formatDate(o.createdAt),
      String(o.itemsCount),
      String(o.total),
      PAYMENT_METHOD_LABELS[o.paymentMethod] ?? o.paymentMethod,
      ORDER_STATUS_LABELS[o.status] ?? o.status,
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ordenes-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por N°, cliente o email"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => updateParam("q", e.target.value || null)}
          className="max-w-xs"
        />
        <Select
          items={{ all: "Todos los estados", ...ORDER_STATUS_LABELS }}
          value={searchParams.get("estado") ?? "all"}
          onValueChange={(v) => updateParam("estado", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="ml-auto" onClick={exportCsv}>
          <Download className="size-4" /> Exportar CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">N° Orden</th>
              <th className="p-3 font-medium">Cliente</th>
              <th className="p-3 font-medium">Fecha</th>
              <th className="p-3 font-medium">Productos</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => router.push(`/admin/ordenes/${order.id}`)}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/50"
              >
                <td className="p-3 font-medium">
                  <Link href={`/admin/ordenes/${order.id}`} onClick={(e) => e.stopPropagation()}>
                    #{order.orderNumber}
                  </Link>
                </td>
                <td className="p-3">
                  <div>{order.customerName}</div>
                  <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                </td>
                <td className="p-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                <td className="p-3">{order.itemsCount}</td>
                <td className="p-3 font-medium">{formatCurrency(order.total)}</td>
                <td className="p-3">
                  <Badge variant="secondary">{ORDER_STATUS_LABELS[order.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
