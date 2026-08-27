import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "cosmic-tee",
    slug: "cosmic-tee",

    name: "Cosmic Tee",
    category: "Graphic T-Shirt",
    collection: "Cosmic",

    description:
      "A heavy graphic tee built around the DotVerse cosmos. Dense-print artwork, drop-shoulder cut and a relaxed drape engineered for all-day wear.",

    price: 899,
    originalPrice: 1499,

    badge: "NEW",

    images: [
      "/images/products/cosmic-tee.png",
    ],

    colors: [
      {
        name: "Black",
        value: "#171717",
      },
      {
        name: "White",
        value: "#F2F2F2",
      },
      {
        name: "Cosmic Purple",
        value: "#6D28D9",
      },
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    stock: 50,
    variants: [],

    featured: true,
    isNew: true,
  },

  {
    id: "void-tee",
    slug: "void-tee",

    name: "Void Tee",
    category: "Oversized T-Shirt",
    collection: "Essentials",

    description:
      "An oversized silhouette sharpened by contrast-ribbed trims. Cut from a structured heavyweight jersey that holds its shape, no matter the orbit.",

    price: 999,
    originalPrice: 1299,

    badge: "NEW",

    images: [
      "/images/products/void-tee.png",
    ],

    colors: [
      {
        name: "Black",
        value: "#111111",
      },
      {
        name: "Charcoal",
        value: "#292929",
      },
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    stock: 40,
    variants: [],

    featured: true,
    isNew: true,
  },

  {
    id: "orbit-tee",
    slug: "orbit-tee",

    name: "Orbit Tee",
    category: "Premium T-Shirt",
    collection: "Cosmic",

    description:
      "A premium everyday staple with a sculpted collar and clean lines. Finely spun cotton for a soft hand-feel and a sharp, lasting drape.",

    price: 899,
    originalPrice: 1399,

    badge: "NEW",

    images: [
      "/images/products/orbit-tee.png",
    ],

    colors: [
      {
        name: "Black",
        value: "#1A1A1A",
      },
      {
        name: "White",
        value: "#E5E5E5",
      },
      {
        name: "Purple",
        value: "#6D28D9",
      },
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    stock: 35,
    variants: [],

    featured: true,
    isNew: true,
  },

  {
    id: "frequency-tee",
    slug: "frequency-tee",

    name: "Frequency Tee",
    category: "Graphic T-Shirt",
    collection: "Signature",

    description:
      "A limited-run graphic piece tuned to a single frequency. Hand-drawn electrostatic artwork with a boxy fit and tonal, sculpted ribbing.",

    price: 1099,
    originalPrice: 1399,

    badge: "LIMITED",

    images: [
      "/images/products/frequency-tee.png",
    ],

    colors: [
      {
        name: "Black",
        value: "#171717",
      },
      {
        name: "Deep Purple",
        value: "#312E81",
      },
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    stock: 20,
    variants: [],

    featured: true,
  },
];

export const getProductBySlug = (slug: string) => {
  return products.find((product) => product.slug === slug);
};
