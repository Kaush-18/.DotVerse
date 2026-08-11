"use client";

import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onQuickView,
}: ProductGridProps) {
  return (
    <div className="products-grid">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}