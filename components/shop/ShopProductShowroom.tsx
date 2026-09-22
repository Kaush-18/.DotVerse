"use client";

import { useState } from "react";

import ProductQuickView from "@/components/home/ProductQuickView";
import ProductGrid from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";

export default function ShopProductShowroom({ products }: { products: Product[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <ProductGrid
        products={products}
        onQuickView={setQuickViewProduct}
        className="shop-redesign-product-grid"
      />
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
