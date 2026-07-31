import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/utils";
import { DELIVERY_SLOTS } from "@/lib/store-info";

const STEPS = ["PENDIENTE", "PAGADO", "ENVIADO", "ENTREGADO"] as const;

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar");

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const currentStepIndex = STEPS.indexOf(order.status as (typeof STEPS)[number]);

  return (
    <div>
      <Link
        href="/mi-cuenta/pedidos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Volver a mis pedidos
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold">Pedido #{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      {order.status !== "CANCELADO" && (
        <div className="mt-6 flex items-center">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {order.status !== "CANCELADO" && (
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {STEPS.map((step) => (
            <span key={step}>{ORDER_STATUS_LABELS[step]}</span>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border border-border p-4">
          <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide">
            Envío
          </h3>
          <p className="text-sm">{order.shippingStreet}</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingCity}, {order.shippingProvince} · CP {order.shippingZip}
          </p>
          <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
        </section>
        <section className="rounded-2xl border border-border p-4">
          <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide">Pago</h3>
          <p className="text-sm">
            Método: {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
          </p>
          <p className="text-sm text-muted-foreground">Total: {formatCurrency(Number(order.total))}</p>
        </section>
      </div>

      {order.preferredDeliverySlot && (
        <section className="mt-6 rounded-2xl border border-border p-4">
          <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide">
            Horario de entrega preferido
          </h3>
          <p className="text-sm">
            {DELIVERY_SLOTS.find((s) => s.value === order.preferredDeliverySlot)?.label ??
              order.preferredDeliverySlot}
          </p>
          {order.deliveryNotes && (
            <p className="text-sm text-muted-foreground">Aclaración: {order.deliveryNotes}</p>
          )}
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-border p-4">
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide">
          Productos
        </h3>
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
      </section>
    </div>
  );
}
