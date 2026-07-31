import { MercadoPagoConfig, Preference } from "mercadopago";

export const isMercadoPagoConfigured = !!process.env.MERCADOPAGO_ACCESS_TOKEN;

export function getMercadoPagoPreferenceClient() {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return null;
  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });
  return new Preference(client);
}
