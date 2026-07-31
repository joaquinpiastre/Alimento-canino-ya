import { prisma } from "@/lib/prisma";

function startOfDay(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

export async function getDashboardMetrics() {
  const paidStatuses = ["PAGADO", "ENVIADO", "ENTREGADO"] as const;

  const [dayOrders, weekOrders, monthOrders, allOrders, orderCount, topProducts] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: { in: [...paidStatuses] }, createdAt: { gte: daysAgo(1) } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: [...paidStatuses] }, createdAt: { gte: daysAgo(7) } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: [...paidStatuses] }, createdAt: { gte: daysAgo(30) } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: [...paidStatuses] } },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.product.findMany({
        where: { soldCount: { gt: 0 } },
        orderBy: { soldCount: "desc" },
        take: 5,
      }),
    ]);

  const salesByDay = await prisma.order.findMany({
    where: { status: { in: [...paidStatuses] }, createdAt: { gte: daysAgo(14) } },
    select: { total: true, createdAt: true },
  });

  const salesMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = daysAgo(i);
    salesMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const order of salesByDay) {
    const key = startOfDay(order.createdAt).toISOString().slice(0, 10);
    salesMap.set(key, (salesMap.get(key) ?? 0) + Number(order.total));
  }

  const chartData = Array.from(salesMap.entries()).map(([date, total]) => ({
    date: date.slice(5),
    total,
  }));

  return {
    salesToday: Number(dayOrders._sum.total ?? 0),
    salesWeek: Number(weekOrders._sum.total ?? 0),
    salesMonth: Number(monthOrders._sum.total ?? 0),
    totalRevenue: Number(allOrders._sum.total ?? 0),
    orderCount,
    topProducts: topProducts.map((p) => ({ name: p.name, soldCount: p.soldCount })),
    chartData,
  };
}
