export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  colors: string[];
  image: string;
};

export const products: Product[] = [
  {
    id: "cosmic-tee",
    name: "Cosmic Tee",
    category: "GRAPHIC T-SHIRT",
    price: 899,
    originalPrice: 1499,
    badge: "NEW",
    colors: ["#171717", "#F2F2F2", "#6D28D9"],
    image: "/products/cosmic-tee.webp",
  },

  {
    id: "void-tee",
    name: "Void Tee",
    category: "OVERSIZED T-SHIRT",
    price: 999,
    originalPrice: 1299,
    badge: "NEW",
    colors: ["#111111", "#292929"],
    image: "/products/void-tee.webp",
  },

  {
    id: "orbit-tee",
    name: "Orbit Tee",
    category: "PREMIUM T-SHIRT",
    price: 899,
    originalPrice: 1399,
    colors: ["#1A1A1A", "#E5E5E5", "#6D28D9"],
    image: "/products/orbit-tee.webp",
  },

  {
    id: "frequency-tee",
    name: "Frequency Tee",
    category: "GRAPHIC T-SHIRT",
    price: 1099,
    originalPrice: 1399,
    badge: "LIMITED",
    colors: ["#171717", "#312E81"],
    image: "/products/frequency-tee.webp",
  },
];