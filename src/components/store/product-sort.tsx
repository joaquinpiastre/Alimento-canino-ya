"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS = [
  { value: "nuevos", label: "Más nuevos" },
  { value: "mas-vendidos", label: "Más vendidos" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("orden") ?? "nuevos";

  function handleChange(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("orden", value);
    params.delete("pagina");
    router.push(`${pathname}?${params.toString()}`);
  }

  const items = Object.fromEntries(OPTIONS.map((opt) => [opt.value, opt.label]));

  return (
    <Select items={items} value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
