import Link from "next/link";
import { CheckCircle2, Landmark, CreditCard, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatCurrency, ORDER_STATUS_LABELS } from "@/lib/utils";
import { MERCADOPAGO_ALIAS, DELIVERY_SLOTS } from "@/lib/store-info";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orden?: string }>;
}) {
  const { orden } = await searchParams;

  const order = orden
    ? await prisma.order.findUnique({
        where: { orderNumber: orden },
        include: { items: { include: { product: true } } },
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <CheckCircle2 className="mx-auto size-16 text-accent" />
      <h1 className="mt-4 font-heading text-3xl font-semibold">¡Gracias por tu compra!</h1>

      {order ? (
        <>
          <p className="mt-2 text-muted-foreground">
            Tu pedido <strong>#{order.orderNumber}</strong> está{" "}
            <strong>{ORDER_STATUS_LABELS[order.status]}</strong>.
          </p>

          {order.paymentMethod === "MERCADO_PAGO" && (
            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-left">
              <div className="flex items-center gap-2 font-heading font-semibold">
                <Landmark className="size-5 text-primary" /> Transferí para completar tu compra
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Transferí <strong>{formatCurrency(Number(order.total))}</strong> por Mercado Pago
                al alias:
              </p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 font-mono text-base font-semibold">
                {MERCADOPAGO_ALIAS}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Apenas confirmemos la transferencia actualizamos el estado de tu pedido a
                &quot;Pagado&quot;.
              </p>
            </div>
          )}

          {order.paymentMethod === "TARJETA" && (
            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-left">
              <div className="flex items-center gap-2 font-heading font-semibold">
                <CreditCard className="size-5 text-primary" /> Pagás al recibir tu pedido
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Vas a pagar con tarjeta de débito o crédito con posnet en el momento de la
                entrega, en la dirección que indicaste.
              </p>
            </div>
          )}

          {order.preferredDeliverySlot && (
            <div className="mt-6 rounded-2xl border border-border p-5 text-left">
              <div className="flex items-center gap-2 font-heading font-semibold">
                <Clock className="size-5 text-primary" /> Horario de entrega preferido
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {DELIVERY_SLOTS.find((s) => s.value === order.preferredDeliverySlot)?.label ??
                  order.preferredDeliverySlot}
              </p>
              {order.deliveryNotes && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Aclaración: {order.deliveryNotes}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-border p-5 text-left">
            <ul className="flex flex-col gap-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} x {item.product.name}
                  </span>
                  <span className="font-medium">{formatCurrency(Number(item.subtotal))}</span>
                </li>
              ))}
            </ul>
            <div className="my-3 h-px bg-border" />
            <div className="flex justify-between font-heading text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(Number(order.total))}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-2 text-muted-foreground">
          Estamos confirmando tu pago, en breve vas a ver el estado en tus pedidos.
        </p>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" className="rounded-full" render={<Link href="/productos" />}>
          Seguir comprando
        </Button>
        <Button className="rounded-full" render={<Link href="/mi-cuenta/pedidos" />}>
          Ver mis pedidos
        </Button>
      </div>
    </div>
  );
}
