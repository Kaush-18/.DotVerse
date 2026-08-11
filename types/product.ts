export type ProductBadge = "NEW" | "LIMITED" | "BESTSELLER";

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

  featured?: boolean;
  isNew?: boolean;
};
