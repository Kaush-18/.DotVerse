export type ProductBadge = "NEW" | "LIMITED" | "BESTSELLER";

export type ProductVariant = {
  size: string;
  colorName: string;
  colorValue: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;

  name: string;
  category: string;
  collection: string;

  description: string;

  price: number;
  originalPrice?: number;

  badge?: ProductBadge;

  images: string[];

  colors: {
    name: string;
    value: string;
  }[];

  sizes: string[];

  stock: number;
  variants: ProductVariant[];

  featured?: boolean;
  isNew?: boolean;
};
