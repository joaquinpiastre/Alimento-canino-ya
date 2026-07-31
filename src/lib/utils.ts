import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ACY-${timestamp}-${random}`
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  MERCADO_PAGO: "Transferencia por Mercado Pago",
  TARJETA: "Tarjeta con posnet al recibir",
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia bancaria",
}
