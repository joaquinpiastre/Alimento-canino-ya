"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagina", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => goTo(currentPage - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="px-3 text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => goTo(currentPage + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
