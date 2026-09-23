"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
} from "lucide-react";

import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

type ProductQuickViewProps = {
  product: Product | null;
  onClose: () => void;
};

function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const liked = isWishlisted(product.id);

  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || "Black",
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0] || "M",
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const modal = document.querySelector<HTMLElement>(".quick-view-modal");
      if (!modal) return;
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleAddToCart = () => {
    const color = selectedColor || product.colors[0]?.name || "Black";
    const size = selectedSize || product.sizes[0] || "M";

    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
        color,
      },
      quantity,
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

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
          ref={closeButtonRef}
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
              <span>{selectedColor}</span>
            </div>

            <div className="quick-view-colors">
              {product.colors.map((color, index) => (
                <button
                  key={`${product.id}-quick-color-${index}`}
                  type="button"
                  className={`quick-color ${
                    selectedColor === color.name ? "selected" : ""
                  }`}
                  style={{
                    backgroundColor: color.value,
                  }}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={color.name}
                  aria-pressed={selectedColor === color.name}
                />
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div className="quick-view-option">
            <div className="quick-view-option-header">
              <span>Size</span>

              <Link
                href="/size-guide"
                className="size-guide"
                onClick={onClose}
              >
                Size guide
              </Link>
            </div>

            <div className="size-grid">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
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
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={15} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                disabled={quantity >= 20}
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
              onClick={handleAddToCart}
              disabled={isAdded}
            >
              {isAdded ? (
                <>
                  <Check size={18} />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Add to cart
                </>
              )}
            </button>

            <button
              type="button"
              className="quick-view-wishlist"
              aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              onClick={() => void toggleWishlist(product.id, product)}
            >
              <Heart size={19} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(quickView, document.body);
}

export default function ProductQuickView({
  product,
  onClose,
}: ProductQuickViewProps) {
  if (!product) return null;

  return <QuickViewModal key={product.id} product={product} onClose={onClose} />;
}
