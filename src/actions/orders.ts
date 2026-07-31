"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import type { $Enums } from "@/generated/prisma/client";

export type CheckoutCartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutShipping = {
  addressId?: string;
  street?: string;
  city?: string;
  province?: string;
  zip?: string;
  phone?: string;
};

export type CheckoutPaymentMethod = "MERCADO_PAGO" | "TARJETA";

export type CheckoutDelivery = {
  preferredSlot?: string;
  notes?: string;
};

export type CreateOrderResult =
  | { ok: true; redirectUrl: string; orderNumber: string }
  | { ok: false; message: string };

export async function createOrder(
  items: CheckoutCartItem[],
  shipping: CheckoutShipping,
  paymentMethod: CheckoutPaymentMethod = "MERCADO_PAGO",
  delivery: CheckoutDelivery = {}
): Promise<CreateOrderResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Tenés que ingresar para finalizar la compra" };
  }

  if (items.length === 0) {
    return { ok: false, message: "Tu carrito está vacío" };
  }

  let shippingData: {
    street: string;
    city: string;
    province: string;
    zip: string;
    phone: string;
  };

  if (shipping.addressId) {
    const address = await prisma.address.findFirst({
      where: { id: shipping.addressId, userId: session.user.id },
    });
    if (!address) return { ok: false, message: "Dirección no encontrada" };
    shippingData = address;
  } else if (
    shipping.street &&
    shipping.city &&
    shipping.province &&
    shipping.zip &&
    shipping.phone
  ) {
    shippingData = {
      street: shipping.street,
      city: shipping.city,
      province: shipping.province,
      zip: shipping.zip,
      phone: shipping.phone,
    };
  } else {
    return { ok: false, message: "Completá los datos de envío" };
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, active: true },
  });

  if (products.length !== items.length) {
    return { ok: false, message: "Algún producto ya no está disponible" };
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      return { ok: false, message: `Sin stock suficiente de "${product.name}"` };
    }
  }

  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const unitPrice = product.offerPrice ? Number(product.offerPrice) : Number(product.price);
    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
      name: product.name,
    };
  });

  const total = orderItemsData.reduce((sum, i) => sum + i.subtotal, 0);
  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      status: "PENDIENTE",
      total,
      paymentMethod: paymentMethod as $Enums.PaymentMethod,
      shippingStreet: shippingData.street,
      shippingCity: shippingData.city,
      shippingProvince: shippingData.province,
      shippingZip: shippingData.zip,
      shippingPhone: shippingData.phone,
      preferredDeliverySlot: delivery.preferredSlot || null,
      deliveryNotes: delivery.notes || null,
      items: {
        create: orderItemsData.map(({ productId, quantity, unitPrice, subtotal }) => ({
          productId,
          quantity,
          unitPrice,
          subtotal,
        })),
      },
    },
  });

  await Promise.all(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity }, soldCount: { increment: item.quantity } },
      })
    )
  );

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

  return {
    ok: true,
    redirectUrl: `/checkout/confirmacion?orden=${order.orderNumber}`,
    orderNumber: order.orderNumber,
  };
}
