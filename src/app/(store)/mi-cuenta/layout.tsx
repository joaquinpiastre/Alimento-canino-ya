import Link from "next/link";
import { User, Package, MapPin, Heart } from "lucide-react";

const NAV = [
  { href: "/mi-cuenta", label: "Mis datos", icon: User },
  { href: "/mi-cuenta/pedidos", label: "Mis pedidos", icon: Package },
  { href: "/mi-cuenta/direcciones", label: "Direcciones", icon: MapPin },
  { href: "/mi-cuenta/favoritos", label: "Favoritos", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl font-semibold">Mi cuenta</h1>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
