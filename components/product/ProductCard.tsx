"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index: number;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  index,
  onQuickView,
}: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="product-card"
    >
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}
      <div className="product-image-wrapper">
        {/* Badge */}
        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          className="product-wishlist"
          aria-label={
            liked
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={() => setLiked((value) => !value)}
        >
          <Heart
            size={18}
            fill={liked ? "currentColor" : "none"}
          />
        </button>

        {/* Image */}
        <Link
          href={`/products/${product.slug}`}
          className="product-image"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 700px) 50vw, 25vw"
            className="product-img"
          />
        </Link>

        {/* Quick View */}
        <button
          type="button"
          className="quick-view-btn"
          onClick={() => onQuickView?.(product)}
        >
          <ShoppingBag size={15} />
          <span>Quick view</span>
        </button>
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}
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
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {product.originalPrice && (
          <div className="product-original-price">
            ₹
            {product.originalPrice.toLocaleString("en-IN")}
          </div>
        )}

        {/* Colors */}
        <div className="product-colors">
          <div className="color-options">
            {product.colors.map((color, colorIndex) => (
              <button
                key={`${product.id}-${color.value}`}
                type="button"
                className={`color-dot ${
                  colorIndex === 0 ? "active" : ""
                }`}
                style={{
                  backgroundColor: color.value,
                }}
                aria-label={color.name}
              />
            ))}
          </div>

          <span className="color-count">
            {product.colors.length} colors
          </span>
        </div>
      </div>
    </motion.article>
  );
}