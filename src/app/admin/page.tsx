import { DollarSign, ShoppingBag, TrendingUp, Calendar } from "lucide-react";
import { getDashboardMetrics } from "@/lib/admin";
import { formatCurrency } from "@/lib/utils";
import { SalesChart } from "./sales-chart";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const cards = [
    { label: "Ventas de hoy", value: formatCurrency(metrics.salesToday), icon: Calendar },
    { label: "Ventas de la semana", value: formatCurrency(metrics.salesWeek), icon: TrendingUp },
    { label: "Ventas del mes", value: formatCurrency(metrics.salesMonth), icon: TrendingUp },
    { label: "Ingresos totales", value: formatCurrency(metrics.totalRevenue), icon: DollarSign },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen general de la tienda</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-heading text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cantidad de órdenes</span>
            <ShoppingBag className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-heading text-2xl font-semibold">{metrics.orderCount}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">Ventas últimos 14 días</h2>
          <SalesChart data={metrics.chartData} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">Productos más vendidos</h2>
          {metrics.topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay ventas.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {metrics.topProducts.map((product, i) => (
                <li key={product.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    {product.name}
                  </span>
                  <span className="font-medium">{product.soldCount} vendidos</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
