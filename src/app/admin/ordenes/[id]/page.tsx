import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from "@/lib/utils";
import { DELIVERY_SLOTS } from "@/lib/store-info";
import { OrderStatusSelect } from "./order-status-select";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/ordenes"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Volver a órdenes
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Orden #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide">
            Cliente
          </h2>
          <p className="font-medium">{order.user.name}</p>
          <p className="text-sm text-muted-foreground">{order.user.email}</p>
          {order.user.phone && <p className="text-sm text-muted-foreground">{order.user.phone}</p>}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide">
            Envío y pago
          </h2>
          <p className="text-sm">
            {order.shippingStreet}, {order.shippingCity}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.shippingProvince}, CP {order.shippingZip} · {order.shippingPhone}
          </p>
          <p className="mt-2 text-sm">
            Método de pago:{" "}
            <strong>{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</strong>
          </p>
          {order.paymentId && (
            <p className="text-sm text-muted-foreground">ID de pago: {order.paymentId}</p>
          )}
        </section>
      </div>

      {order.preferredDeliverySlot && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide">
            Horario de entrega preferido
          </h2>
          <p className="text-sm">
            {DELIVERY_SLOTS.find((s) => s.value === order.preferredDeliverySlot)?.label ??
              order.preferredDeliverySlot}
          </p>
          {order.deliveryNotes && (
            <p className="text-sm text-muted-foreground">Aclaración: {order.deliveryNotes}</p>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide">
          Productos
        </h2>
        <ul className="flex flex-col divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.product.images[0] && (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} x {formatCurrency(Number(item.unitPrice))}
                </p>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(Number(item.subtotal))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-heading text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(Number(order.total))}</span>
        </div>
      </section>
    </div>
  );
}
