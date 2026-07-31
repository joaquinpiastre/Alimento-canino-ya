import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories = [
  {
    name: "Perros Adultos",
    description: "Alimento balanceado para perros adultos de todas las razas.",
    image: "https://placedog.net/800/600?id=1",
  },
  {
    name: "Cachorros",
    description: "Nutrición especial para el crecimiento de tu cachorro.",
    image: "https://placedog.net/800/600?id=2",
  },
  {
    name: "Perros Senior",
    description: "Fórmulas pensadas para perros mayores de 7 años.",
    image: "https://placedog.net/800/600?id=3",
  },
  {
    name: "Snacks y Premios",
    description: "Golosinas y premios para entrenar y consentir.",
    image: "https://placedog.net/800/600?id=4",
  },
  {
    name: "Accesorios",
    description: "Correas, camas, juguetes y más para tu mascota.",
    image: "https://placedog.net/800/600?id=5",
  },
];

const products = [
  {
    name: "Vital Can Adulto Pollo y Arroz 15kg",
    brand: "Vital Can",
    category: "Perros Adultos",
    price: 45000,
    offerPrice: 39900,
    stock: 40,
    weight: "15kg",
    featured: true,
    description:
      "Alimento balanceado premium para perros adultos, con pollo real y arroz integral. Favorece una piel y pelaje saludable.",
  },
  {
    name: "Vital Can Adulto Raza Pequeña 3kg",
    brand: "Vital Can",
    category: "Perros Adultos",
    price: 14500,
    stock: 60,
    weight: "3kg",
    featured: false,
    description:
      "Croquetas de tamaño reducido pensadas para razas pequeñas adultas, con alta densidad energética.",
  },
  {
    name: "ProCanino Gold Adulto 21kg",
    brand: "ProCanino",
    category: "Perros Adultos",
    price: 58000,
    offerPrice: 52000,
    stock: 25,
    weight: "21kg",
    featured: true,
    description:
      "Fórmula gold con omega 3 y 6, ideal para perros adultos activos. Mejora el sistema inmunológico.",
  },
  {
    name: "Nutrilar Balanceado Adulto Carne 10kg",
    brand: "Nutrilar",
    category: "Perros Adultos",
    price: 32000,
    stock: 35,
    weight: "10kg",
    featured: false,
    description: "Balanceado económico y nutritivo a base de carne vacuna para el día a día.",
  },
  {
    name: "Vital Can Cachorro Pollo 10kg",
    brand: "Vital Can",
    category: "Cachorros",
    price: 38000,
    stock: 30,
    weight: "10kg",
    featured: true,
    description:
      "Alimento para cachorros de todas las razas, enriquecido con DHA para el desarrollo cerebral.",
  },
  {
    name: "ProCanino Puppy Raza Grande 15kg",
    brand: "ProCanino",
    category: "Cachorros",
    price: 47000,
    offerPrice: 42500,
    stock: 20,
    weight: "15kg",
    featured: false,
    description:
      "Especialmente formulado para cachorros de razas grandes, con calcio y fósforo balanceados.",
  },
  {
    name: "Nutrilar Cachorro Raza Pequeña 3kg",
    brand: "Nutrilar",
    category: "Cachorros",
    price: 16000,
    stock: 45,
    weight: "3kg",
    featured: false,
    description: "Nutrición completa para cachorros de razas pequeñas hasta los 12 meses.",
  },
  {
    name: "Vital Can Senior 7+ 12kg",
    brand: "Vital Can",
    category: "Perros Senior",
    price: 41000,
    stock: 22,
    weight: "12kg",
    featured: true,
    description:
      "Fórmula para perros senior con glucosamina y condroitina para el cuidado de las articulaciones.",
  },
  {
    name: "ProCanino Senior Light 10kg",
    brand: "ProCanino",
    category: "Perros Senior",
    price: 39000,
    stock: 18,
    weight: "10kg",
    featured: false,
    description: "Bajo en grasas, ideal para perros mayores con tendencia al sobrepeso.",
  },
  {
    name: "Huesitos de Cuero Prensado x5",
    brand: "DogTreats",
    category: "Snacks y Premios",
    price: 6500,
    stock: 80,
    weight: "500g",
    featured: false,
    description: "Pack de 5 huesos de cuero prensado, ideales para la limpieza dental.",
  },
  {
    name: "Snacks de Hígado Deshidratado 200g",
    brand: "DogTreats",
    category: "Snacks y Premios",
    price: 5200,
    offerPrice: 4300,
    stock: 55,
    weight: "200g",
    featured: true,
    description: "Premios naturales 100% hígado vacuno deshidratado, sin conservantes.",
  },
  {
    name: "Galletitas de Entrenamiento Mini 300g",
    brand: "TrainerPet",
    category: "Snacks y Premios",
    price: 4800,
    stock: 70,
    weight: "300g",
    featured: false,
    description: "Pequeñas galletitas perfectas para reforzar el entrenamiento positivo.",
  },
  {
    name: "Cama Ortopédica Mediana",
    brand: "ComfyPet",
    category: "Accesorios",
    price: 32000,
    stock: 15,
    weight: "M",
    featured: true,
    description: "Cama con espuma viscoelástica que se adapta al cuerpo de tu perro.",
  },
  {
    name: "Correa Retráctil 5m",
    brand: "ComfyPet",
    category: "Accesorios",
    price: 18500,
    stock: 25,
    weight: "Única",
    featured: false,
    description: "Correa retráctil resistente, con freno y agarre ergonómico.",
  },
  {
    name: "Pelota Interactiva con Dispensador de Premios",
    brand: "PlayDog",
    category: "Accesorios",
    price: 9800,
    offerPrice: 8200,
    stock: 40,
    weight: "Única",
    featured: true,
    description: "Juguete que estimula la mente de tu perro mientras dispensa premios.",
  },
];

async function main() {
  console.log("Seed: creando categorías...");
  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: slugify(cat.name) },
      update: {},
      create: {
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
        image: cat.image,
      },
    });
    categoryMap.set(cat.name, created.id);
  }

  console.log("Seed: creando productos...");
  let sku = 1000;
  for (const p of products) {
    sku += 1;
    const categoryId = categoryMap.get(p.category);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: slugify(p.name) },
      update: {},
      create: {
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        price: p.price,
        offerPrice: p.offerPrice ?? null,
        stock: p.stock,
        sku: `ACY-${sku}`,
        images: [`https://placedog.net/600/600?id=${sku}`],
        brand: p.brand,
        weight: p.weight,
        featured: p.featured,
        active: true,
        categoryId,
      },
    });
  }

  console.log("Seed: creando usuario admin...");
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@alimentocaninoya.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@alimentocaninoya.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+54 9 11 0000-0000",
    },
  });

  console.log("Seed: creando usuario cliente de prueba...");
  const customerPassword = await bcrypt.hash("Cliente123!", 10);
  await prisma.user.upsert({
    where: { email: "cliente@ejemplo.com" },
    update: {},
    create: {
      name: "Cliente de Prueba",
      email: "cliente@ejemplo.com",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+54 9 11 1111-1111",
    },
  });

  console.log("Seed completado ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
