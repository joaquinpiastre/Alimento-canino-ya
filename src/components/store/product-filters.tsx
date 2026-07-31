"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductFilters({
  categories,
  brands,
}: {
  categories: { slug: string; name: string }[];
  brands: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("precioMin") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("precioMax") ?? "");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("pagina");
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyPriceRange() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("precioMin", minPrice);
    else params.delete("precioMin");
    if (maxPrice) params.set("precioMax", maxPrice);
    else params.delete("precioMax");
    params.delete("pagina");
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentCategory = searchParams.get("categoria") ?? "";
  const currentBrand = searchParams.get("marca") ?? "";
  const inStock = searchParams.get("stock") === "1";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide">
          Categoría
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => updateParam("categoria", null)}
            className={`text-left text-sm ${!currentCategory ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParam("categoria", cat.slug)}
              className={`text-left text-sm ${currentCategory === cat.slug ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide">Marca</h3>
        <Select
          items={{ all: "Todas las marcas", ...Object.fromEntries(brands.map((b) => [b, b])) }}
          value={currentBrand || "all"}
          onValueChange={(v) => updateParam("marca", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas las marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide">Precio</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={applyPriceRange}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={applyPriceRange}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="stock"
          checked={inStock}
          onCheckedChange={(checked) => updateParam("stock", checked ? "1" : null)}
        />
        <Label htmlFor="stock" className="text-sm font-normal">
          Solo con stock disponible
        </Label>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(pathname)}
        className="self-start"
      >
        Limpiar filtros
      </Button>
    </div>
  );
}
