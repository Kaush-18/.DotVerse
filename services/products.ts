import { prisma } from "@/lib/prisma";
import { Product, ProductBadge } from "@/types/product";
import { Product as PrismaProduct, Category, Collection, ProductImage, ProductVariant, Prisma } from "../generated/prisma/client";

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
    variants: product.variants.map((v) => ({
      size: v.size,
      colorName: v.colorName,
      colorValue: v.colorValue,
      stock: v.stock,
    })),
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
  collectionName: string,
  categoryName: string,
  limit = 3,
): Promise<Product[]> {
  const sameCollection = await prisma.product.findMany({
    where: {
      id: {
        not: productId,
      },
      collection: {
        name: collectionName,
      },
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

  if (sameCollection.length >= limit) {
    return sameCollection.map(mapProduct);
  }

  const existingIds = [
    productId,
    ...sameCollection.map((product) => product.id),
  ];

  const sameCategory = await prisma.product.findMany({
    where: {
      id: {
        notIn: existingIds,
      },
      category: {
        name: categoryName,
      },
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
    take: limit - sameCollection.length,
  });

  return [...sameCollection, ...sameCategory].map(mapProduct);
}

export async function getFilteredProducts(params: {
  q?: string;
  category?: string;
  collection?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
}): Promise<Product[]> {
  const where: Prisma.ProductWhereInput = {};

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ];
  }

  if (params.category) where.category = { slug: params.category };
  if (params.collection) where.collection = { slug: params.collection };

  if (params.color || params.size) {
    where.variants = {
      some: {
        ...(params.color ? { colorName: params.color } : {}),
        ...(params.size ? { size: params.size } : {}),
      },
    };
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.price = {
      ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
      ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
    };
  }

  if (params.inStock) {
    where.variants = { some: { stock: { gt: 0 } } };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  switch (params.sort) {
    case 'price-asc': orderBy.price = 'asc'; break;
    case 'price-desc': orderBy.price = 'desc'; break;
    case 'newest': orderBy.createdAt = 'desc'; break;
    case 'name-asc': orderBy.name = 'asc'; break;
    default: orderBy.featured = 'desc';
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      collection: true,
      images: { orderBy: { position: 'asc' } },
      variants: true,
    },
  });

  return products.map(mapProduct);
}
