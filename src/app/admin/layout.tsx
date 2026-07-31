import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  PawPrint,
  ArrowLeft,
} from "lucide-react";
import { auth } from "@/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/ordenes", label: "Órdenes", icon: ShoppingBag },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card p-4 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <PawPrint className="size-5" />
          </span>
          <span className="font-heading text-base font-semibold">Alimento Canino Ya</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Volver a la tienda
        </Link>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <span className="font-heading font-semibold">Panel admin</span>
          <Link href="/" className="text-sm text-muted-foreground">
            Volver a la tienda
          </Link>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground/70 hover:bg-secondary"
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
