"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Logo, LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/components/cart/cart-provider";
import { CartSheet } from "@/components/cart/cart-sheet";
import { Badge } from "@/components/ui/badge";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Tienda" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  const { data: session } = useSession();
  const { count, setIsOpen } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/productos${search ? `?q=${encodeURIComponent(search)}` : ""}`);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center">
                  <Logo height={32} />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex shrink-0 items-center">
          <LogoMark size={36} className="sm:hidden" />
          <Logo height={34} className="hidden sm:inline-block" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="relative ml-auto hidden max-w-sm flex-1 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar alimento, snacks, marca..."
            className="rounded-full pl-9"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            render={<Link href="/productos" />}
          >
            <Search className="size-5" />
          </Button>

          {session?.user && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              render={<Link href="/mi-cuenta/favoritos" />}
            >
              <Heart className="size-5" />
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[11px]">
                {count}
              </Badge>
            )}
          </Button>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                <User className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium truncate">
                  {session.user.name}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/mi-cuenta" />}>Mi cuenta</DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/mi-cuenta/pedidos" />}>
                  Mis pedidos
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/mi-cuenta/direcciones" />}>
                  Direcciones
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem render={<Link href="/admin" />}>Panel admin</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="rounded-full" render={<Link href="/ingresar" />}>
              Ingresar
            </Button>
          )}
        </div>
      </div>
      <CartSheet />
    </header>
  );
}
