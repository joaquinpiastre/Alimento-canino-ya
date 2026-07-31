"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilters } from "@/components/store/product-filters";

export function MobileFilters({
  categories,
  brands,
}: {
  categories: { slug: string; name: string }[];
  brands: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" className="lg:hidden" />}>
        <SlidersHorizontal className="size-4" /> Filtros
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <ProductFilters categories={categories} brands={brands} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
