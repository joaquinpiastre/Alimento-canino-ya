import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { STORE_ADDRESS } from "@/lib/store-info";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="inline-flex items-center">
            <Logo height={34} />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Todo lo que tu perro necesita, con la calidez de una tienda que entiende de mascotas.
          </p>
          <div className="mt-4 flex gap-3 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary">Facebook</a>
            <a href="#" className="hover:text-primary">Instagram</a>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
            Tienda
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/productos" className="hover:text-foreground">Todos los productos</Link></li>
            <li><Link href="/productos?categoria=perros-adultos" className="hover:text-foreground">Perros adultos</Link></li>
            <li><Link href="/productos?categoria=cachorros" className="hover:text-foreground">Cachorros</Link></li>
            <li><Link href="/productos?categoria=accesorios" className="hover:text-foreground">Accesorios</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
            Mi cuenta
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/mi-cuenta" className="hover:text-foreground">Panel de cuenta</Link></li>
            <li><Link href="/mi-cuenta/pedidos" className="hover:text-foreground">Mis pedidos</Link></li>
            <li><Link href="/mi-cuenta/direcciones" className="hover:text-foreground">Direcciones</Link></li>
            <li><Link href="/ingresar" className="hover:text-foreground">Ingresar</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
            Contacto
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4" /> hola@alimentocaninoya.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" /> +54 9 2604 53-0801
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4" /> {STORE_ADDRESS}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Alimento Canino Ya. Todos los derechos reservados.
      </div>
    </footer>
  );
}
