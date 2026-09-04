"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { products } from "@/data/products";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/product/ProductGrid";
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
              New Premium
              <br />
              <span>Streetwear Arrivals</span>
            </h2>
          </div>

          <Link
            href="/shop"
            className="view-products-btn"
          >
            <span>View all products</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}
        <ProductGrid
            products={products.filter((product) => product.featured).slice(0, 4)}
            onQuickView={setSelectedProduct}
          />
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