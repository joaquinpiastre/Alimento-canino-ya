import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageX } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
        <PackageX className="size-10 text-muted-foreground" />
        <p className="font-medium">Todavía no hiciste ningún pedido</p>
        <Link href="/productos" className="text-sm text-primary hover:underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/mi-cuenta/pedidos/${order.id}`}
            className="flex flex-col gap-2 rounded-2xl border border-border p-4 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">Pedido #{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)} · {order.items.length} producto(s)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{ORDER_STATUS_LABELS[order.status]}</Badge>
              <span className="font-heading font-semibold">{formatCurrency(Number(order.total))}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
