"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";

import type { Product } from "@/types/product";

type ProductQuickViewProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductQuickView({
  product,
  onClose,
}: ProductQuickViewProps) {
  useEffect(() => {
    if (!product) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const quickView = (
    <div
      className="quick-view-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} quick view`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="quick-view-modal">
        {/* CLOSE */}
        <button
          type="button"
          className="quick-view-close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>

        {/* IMAGE */}
        <div className="quick-view-image">
          <Image
            src={product.images[0]}
            alt={`${product.name} by DotVerse`}
            fill
            sizes="50vw"
            className="quick-view-product-image"
          />
        </div>

        {/* DETAILS */}
        <div className="quick-view-details">
          <span className="quick-view-category">
            {product.category}
          </span>

          <h2>{product.name}</h2>

          <div className="quick-view-price">
            <span>
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.originalPrice && (
              <del>
                ₹
                {product.originalPrice.toLocaleString("en-IN")}
              </del>
            )}
          </div>

          <div className="quick-view-divider" />

          <p className="quick-view-description">
            {product.description}
          </p>

          {/* COLORS */}
          <div className="quick-view-option">
            <div className="quick-view-option-header">
              <span>Color</span>
              <span>{product.colors[0]?.name || "Black"}</span>
            </div>

            <div className="quick-view-colors">
              {product.colors.map((color, index) => (
                <button
                  key={`${product.id}-quick-color-${index}`}
                  type="button"
                  className={`quick-color ${
                    index === 0 ? "selected" : ""
                  }`}
                  style={{
                    backgroundColor: color.value,
                  }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div className="quick-view-option">
            <div className="quick-view-option-header">
              <span>Size</span>

              <button
                type="button"
                className="size-guide"
              >
                Size guide
              </button>
            </div>

            <div className="size-grid">
              {product.sizes.map((size, index) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-button ${
                      index === 1 ? "selected" : ""
                    }`}
                  >
                    {size}
                  </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="quick-view-option">
            <div className="quick-view-option-header">
              <span>Quantity</span>
            </div>

            <div className="quantity-control">
              <button
                type="button"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>

              <span>1</span>

              <button
                type="button"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="quick-view-actions">
            <button
              type="button"
              className="add-to-cart-button"
            >
              <ShoppingBag size={18} />
              Add to cart
            </button>

            <button
              type="button"
              className="quick-view-wishlist"
              aria-label="Add to wishlist"
            >
              <Heart size={19} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(quickView, document.body);
}