"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-2xl font-semibold">Algo salió mal</h1>
      <p className="text-muted-foreground">
        Ocurrió un error inesperado. Podés intentar de nuevo.
      </p>
      <Button className="rounded-full" onClick={() => reset()}>
        Reintentar
      </Button>
    </div>
  );
}
