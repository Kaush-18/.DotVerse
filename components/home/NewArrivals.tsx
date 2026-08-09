"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Heart,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { products } from "./productData";
import type { Product } from "./productData";
import ProductQuickView from "./ProductQuickView";

export default function NewArrivals() {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  return (
    <section className="new-arrivals-section">
      <div className="container">
        {/* HEADER */}
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

          <button className="view-products-btn">
            <span>View all products</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* PRODUCTS */}
        <div className="products-grid">
          {products.map((product) => (
            <article
              key={product.id}
              className="product-card"
            >
              {/* IMAGE */}
              <div className="product-image-wrapper">
                {product.badge && (
                  <span className="product-badge">
                    {product.badge}
                  </span>
                )}

                <button
                  className="product-wishlist"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <Heart size={18} />
                </button>

                <div className="product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="product-img"
                  />
                </div>

                <button
                  className="quick-view-btn"
                  onClick={() => setSelectedProduct(product)}
                >
                  <ShoppingBag size={15} />
                  <span>Quick view</span>
                </button>
              </div>

              {/* PRODUCT INFO */}
              <div className="product-info">
                <div className="product-top-row">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <span className="product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <h3 className="product-name">
                  {product.name}
                </h3>

                {product.originalPrice && (
                  <div className="product-original-price">
                    ₹
                    {product.originalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </div>
                )}

                <div className="product-colors">
                  <div className="color-options">
                    {product.colors.map((color, index) => (
                      <button
                        key={`${product.id}-${color}`}
                        className={`color-dot ${
                          index === 0 ? "active" : ""
                        }`}
                        style={{
                          backgroundColor: color,
                        }}
                        aria-label={`Color ${index + 1}`}
                      />
                    ))}
                  </div>

                  <span className="color-count">
                    {product.colors.length} colors
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProductQuickView
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}