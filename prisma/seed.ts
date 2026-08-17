import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { products } from "../data/products";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Delete existing data to prevent unique constraint errors on re-run
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();

  // Extract unique categories and collections
  const categoryNames = Array.from(new Set(products.map((p) => p.category)));
  const collectionNames = Array.from(
    new Set(products.map((p) => p.collection))
  );

  // Create categories
  const categories = new Map<string, { id: string }>();

  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: {
        name,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      },
    });

    categories.set(name, category);

    console.log(`✨ Category: ${name}`);
  }

  // Create collections
  const collections = new Map<string, { id: string }>();

  for (const name of collectionNames) {
    const collection = await prisma.collection.create({
      data: {
        name,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      },
    });

    collections.set(name, collection);

    console.log(`✨ Collection: ${name}`);
  }

  // Create products
  for (const product of products) {
    const category = categories.get(product.category);
    const collection = collections.get(product.collection);

    if (!category || !collection) {
      throw new Error(
        `Missing category or collection for ${product.name}`
      );
    }

    const createdProduct = await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        badge: product.badge,
        featured: product.featured,
        isNew: product.isNew,

        categoryId: category.id,
        collectionId: collection.id,

        images: {
          create: product.images.map((url, index) => ({
            url,
            alt: product.name,
            position: index,
          })),
        },

        variants: {
          create: product.colors.flatMap((color) =>
            product.sizes.map((size) => ({
              size,
              colorName: color.name,
              colorValue: color.value,
              stock: product.stock,
            }))
          ),
        },
      },
    });

    console.log(
      `👕 Product: ${createdProduct.name}`
    );
  }

  console.log("✅ Database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
