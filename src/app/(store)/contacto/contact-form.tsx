"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("¡Gracias! Recibimos tu mensaje y te vamos a responder a la brevedad.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" required placeholder="Tu nombre" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject">Asunto</Label>
        <Input id="subject" name="subject" required placeholder="¿En qué te podemos ayudar?" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea id="message" name="message" required rows={5} placeholder="Contanos tu consulta..." />
      </div>
      <Button type="submit" size="lg" className="w-fit rounded-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
