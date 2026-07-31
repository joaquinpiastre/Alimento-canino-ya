import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";
import { STORE_ADDRESS, STORE_HOURS } from "@/lib/store-info";

export const metadata: Metadata = { title: "Contacto" };

const INFO = [
  { icon: Phone, label: "Teléfono / WhatsApp", value: "+54 9 2604 53-0801" },
  { icon: Mail, label: "Email", value: "hola@alimentocaninoya.com" },
  { icon: MapPin, label: "Ubicación", value: STORE_ADDRESS },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-4xl font-semibold">Contactanos</h1>
        <p className="mt-3 text-muted-foreground">
          ¿Tenés dudas sobre un producto, tu pedido o querés hacernos una sugerencia? Escribinos.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          {INFO.map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="size-5" />
            </span>
            <div className="flex-1">
              <p className="mb-1 text-sm text-muted-foreground">Horario de atención</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
                {STORE_HOURS.map((item) => (
                  <div key={item.day} className="contents">
                    <dt className="font-medium">{item.day}</dt>
                    <dd className="text-muted-foreground">{item.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
