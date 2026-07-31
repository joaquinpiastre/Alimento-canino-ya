import { getAdminOrders } from "@/actions/admin-orders";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const params = await searchParams;
  const orders = await getAdminOrders({ status: params.estado, search: params.q });

  const serialized = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    paymentMethod: order.paymentMethod,
    customerName: order.user.name,
    customerEmail: order.user.email,
    itemsCount: order.items.length,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Órdenes</h1>
        <p className="text-sm text-muted-foreground">{orders.length} órdenes</p>
      </div>
      <OrdersTable orders={serialized} />
    </div>
  );
}
