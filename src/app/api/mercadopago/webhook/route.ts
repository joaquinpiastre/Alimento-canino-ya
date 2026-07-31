import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json({ received: true });
  }

  const body = await request.json().catch(() => null);
  const paymentId = body?.data?.id;

  if (!paymentId) {
    return NextResponse.json({ received: true });
  }

  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: paymentId });

    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const status =
      payment.status === "approved"
        ? "PAGADO"
        : payment.status === "rejected" || payment.status === "cancelled"
          ? "CANCELADO"
          : "PENDIENTE";

    await prisma.order.update({
      where: { id: orderId },
      data: { status, paymentId: String(payment.id) },
    });
  } catch (error) {
    console.error("[mercadopago-webhook]", error);
  }

  return NextResponse.json({ received: true });
}
