import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Percent, PawPrint } from "lucide-react";
import { getCategories, getFeaturedProducts, serializeProduct } from "@/lib/products";
import { ProductCard } from "@/components/store/product-card";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts()]);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <PawPrint className="size-4" /> Envíos a todo San Rafael
            </span>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Todo lo que tu perro necesita, <span className="text-primary">ya</span>.
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Alimento balanceado, snacks y accesorios de las mejores marcas. Comprá online
              en minutos y recibilo en la puerta de tu casa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
              >
                Ver catálogo <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/productos?ofertas=1"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 font-medium hover:bg-secondary"
              >
                Ver ofertas
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-6 rounded-[3rem] bg-primary/15 blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border-4 border-background shadow-2xl">
              <Image
                src="https://placedog.net/800/800?id=99"
                alt="Perro feliz"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Envío rápido", desc: "Recibí tu pedido en 24/48hs" },
            { icon: ShieldCheck, title: "Compra segura", desc: "Pagos protegidos con Mercado Pago" },
            { icon: Percent, title: "Ofertas semanales", desc: "Descuentos en tus marcas favoritas" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Categorías</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.slug}`}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 font-heading text-sm font-medium text-white sm:text-base">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Productos destacados</h2>
          <Link href="/productos" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={serializeProduct(product)} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            ¿Todavía no probaste nuestro alimento premium?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Descubrí por qué miles de perros ya son parte de la familia Alimento Canino Ya.
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-medium text-foreground"
          >
            Empezar a comprar <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
