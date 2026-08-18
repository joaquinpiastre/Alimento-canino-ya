import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Truck, ShieldCheck, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Nosotros" };

const VALUES = [
  {
    icon: Heart,
    title: "Amor por las mascotas",
    description: "Elegimos cada producto pensando en la salud y felicidad de tu perro.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad garantizada",
    description: "Trabajamos solo con marcas confiables y productos de primera calidad.",
  },
  {
    icon: Truck,
    title: "Envíos a todo San Rafael",
    description: "Recibí tu pedido en la puerta de tu casa, estés donde estés en San Rafael.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-secondary/40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <PawPrint className="size-4" /> Nuestra historia
            </span>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
              Somos Alimento Canino Ya
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Nacimos con una idea simple: que conseguir alimento y productos de calidad para tu
              perro sea tan fácil y cálido como cuidarlo. Somos un equipo de amantes de los
              animales trabajando todos los días para que cada pedido llegue a tiempo y con la
              mejor atención.
            </p>
            <Button className="mt-6 rounded-full" render={<Link href="/productos" />}>
              Conocer el catálogo
            </Button>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-background shadow-2xl">
            <Image
              src="https://placedog.net/800/800?id=44"
              alt="Perro feliz junto a su dueño"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-center font-heading text-3xl font-semibold">
          Lo que nos mueve
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-2xl border border-border bg-card p-6 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <value.icon className="size-6" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            ¿Tenés alguna consulta?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Estamos para ayudarte a elegir lo mejor para tu perro.
          </p>
          <Button
            variant="secondary"
            className="mt-6 rounded-full"
            render={<Link href="/contacto" />}
          >
            Contactanos
          </Button>
        </div>
      </section>
    </div>
  );
}
