import Link from "next/link";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <PawPrint className="size-14 text-muted-foreground" />
      <h1 className="font-heading text-3xl font-semibold">Página no encontrada</h1>
      <p className="text-muted-foreground">
        Parece que este hueso no estaba enterrado acá. Volvé al catálogo para seguir buscando.
      </p>
      <Button className="rounded-full" render={<Link href="/productos" />}>
        Ver catálogo
      </Button>
    </div>
  );
}
