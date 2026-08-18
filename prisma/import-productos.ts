import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function parseCsv(content: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (inQuotes) {
      if (char === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...dataRows] = rows.filter((r) => r.some((c) => c.trim() !== ""));
  return dataRows.map((r) =>
    Object.fromEntries(header.map((key, i) => [key, (r[i] ?? "").trim()]))
  );
}

async function main() {
  const csvPath = path.join(__dirname, "data", "productos_alimento_canino_ya.csv");
  const rows = parseCsv(readFileSync(csvPath, "utf-8"));

  console.log(`Import: ${rows.length} filas encontradas en el CSV.`);

  const categoryNames = [...new Set(rows.map((r) => r.categoria))];
  const categoryMap = new Map<string, string>();

  console.log("Import: creando/actualizando categorias...");
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
    categoryMap.set(name, category.id);
  }

  console.log("Import: creando/actualizando productos...");
  for (const r of rows) {
    const categoryId = categoryMap.get(r.categoria);
    if (!categoryId) {
      console.warn(`  Omitido "${r.nombre}": categoria "${r.categoria}" no encontrada.`);
      continue;
    }

    const price = Number(r.precio);
    const offerPriceValue = Number(r.precio_oferta);
    const offerPrice = offerPriceValue && offerPriceValue !== price ? offerPriceValue : null;

    await prisma.product.upsert({
      where: { sku: r.sku },
      update: {
        name: r.nombre,
        slug: slugify(r.nombre),
        description: r.descripcion,
        price,
        offerPrice,
        stock: Number(r.stock),
        brand: r.marca,
        weight: r.peso_tamano || null,
        featured: r.destacado.toLowerCase() === "si",
        active: r.activo.toLowerCase() === "si",
        categoryId,
      },
      create: {
        name: r.nombre,
        slug: slugify(r.nombre),
        description: r.descripcion,
        price,
        offerPrice,
        stock: Number(r.stock),
        sku: r.sku,
        images: [],
        brand: r.marca,
        weight: r.peso_tamano || null,
        featured: r.destacado.toLowerCase() === "si",
        active: r.activo.toLowerCase() === "si",
        categoryId,
      },
    });
  }

  console.log("Import completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
