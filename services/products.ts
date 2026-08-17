import { prisma } from "@/lib/prisma";
import { Product, ProductBadge } from "@/types/product";
import { Product as PrismaProduct, Category, Collection, ProductImage, ProductVariant } from "../generated/prisma/client";

type FullProduct = PrismaProduct & {
  category: Category;
  collection: Collection;
  images: ProductImage[];
  variants: ProductVariant[];
};

function mapProduct(product: FullProduct): Product {
  const colors = Array.from(
    new Map(
      product.variants.map((v) => [v.colorValue, { name: v.colorName, value: v.colorValue }])
    ).values()
  ) as { name: string; value: string }[];

  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));

  const stock = product.variants.reduce((acc, v) => acc + v.stock, 0);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    badge: (product.badge as ProductBadge) ?? undefined,
    featured: product.featured,
    isNew: product.isNew,
    category: product.category.name,
    collection: product.collection.name,
    images: product.images.map((img) => img.url),
    colors,
    sizes,
    stock,
  };
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      collection: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
      variants: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      collection: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
      variants: true,
    },
  });

  return product ? mapProduct(product) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
    include: {
      category: true,
      collection: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
      variants: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return products.map(mapProduct);
}

export async function getNewProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      isNew: true,
    },
    include: {
      category: true,
      collection: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
      variants: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return products.map(mapProduct);
}

export async function getRelatedProducts(
  productId: string,
  collectionId: string,
  limit = 3,
): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      id: {
        not: productId,
      },
      collectionId,
    },
    include: {
      category: true,
      collection: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
      variants: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: limit,
  });

  return products.map(mapProduct);
}
