"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { products } from "./productData";
import type { Product } from "./productData";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import Container from "@/components/layout/Container";

export default function NewArrivals() {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  return (
    <section className="new-arrivals-section">
      <Container>
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="new-arrivals-header">
          <div>
            <div className="section-eyebrow">
              <span />
              <span>NEW ARRIVALS</span>
            </div>

            <h2 className="new-arrivals-title">
              Fresh from
              <br />
              <span>the universe.</span>
            </h2>
          </div>

          <button
            type="button"
            className="view-products-btn"
          >
            <span>View all products</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}
        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onQuickView={setSelectedProduct}
            />
          ))}
        </div>
      </Container>

      {/* =====================================================
          QUICK VIEW
      ===================================================== */}
      <ProductQuickView
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}