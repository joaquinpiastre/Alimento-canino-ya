import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CustomerRowActions } from "./customer-row-actions";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: { select: { total: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Clientes</h1>
        <p className="text-sm text-muted-foreground">{customers.length} clientes registrados</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Cliente</th>
              <th className="p-3 font-medium">Registro</th>
              <th className="p-3 font-medium">Pedidos</th>
              <th className="p-3 font-medium">Total comprado</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const paidOrders = customer.orders.filter((o) =>
                ["PAGADO", "ENVIADO", "ENTREGADO"].includes(o.status)
              );
              const totalSpent = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
              return (
                <tr key={customer.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.email}</div>
                  </td>
                  <td className="p-3 text-muted-foreground">{formatDate(customer.createdAt)}</td>
                  <td className="p-3">{customer.orders.length}</td>
                  <td className="p-3 font-medium">{formatCurrency(totalSpent)}</td>
                  <td className="p-3">
                    <CustomerRowActions customerId={customer.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
