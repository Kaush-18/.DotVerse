"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

import Container from "@/components/layout/Container";
import PageReveal from "@/components/animations/PageReveal";
import ProductGrid from "@/components/product/ProductGrid";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;
    return product.variants.find(
      (v) => v.size === selectedSize && v.colorName === selectedColor
    );
  }, [selectedSize, selectedColor, product.variants]);

  const maxQuantity = useMemo(() => {
    if (!selectedVariant) return 20;
    return Math.min(selectedVariant.stock, 20);
  }, [selectedVariant]);

  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return product.variants.some((v) => v.size === size && v.stock > 0);
    return product.variants.some((v) => v.size === size && v.colorName === selectedColor && v.stock > 0);
  };

  const isColorAvailable = (colorName: string) => {
    if (!selectedSize) return product.variants.some((v) => v.colorName === colorName && v.stock > 0);
    return product.variants.some((v) => v.colorName === colorName && v.size === selectedSize && v.stock > 0);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
    setError(null);
    // If selected color is not available for this size, clear it
    if (selectedColor && !product.variants.some(v => v.size === size && v.colorName === selectedColor && v.stock > 0)) {
      setSelectedColor(null);
    }
  };

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    setQuantity(1);
    setError(null);
    // If selected size is not available for this color, clear it
    if (selectedSize && !product.variants.some(v => v.size === selectedSize && v.colorName === colorName && v.stock > 0)) {
      setSelectedSize(null);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    if (!selectedColor) {
      setError("Please select a color");
      return;
    }
    if (!selectedVariant || selectedVariant.stock === 0) {
      setError("Selected variant is out of stock");
      return;
    }

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
    }, quantity);

    setIsAdding(true);
    setError(null);
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <PageReveal>
      <main>
        <Container>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 pt-8 text-[10px] uppercase tracking-[0.2em] text-white/35">
            <Link href="/shop" className="transition-colors hover:text-white">Shop</Link>
            <span>/</span>
            <span className="text-violet-300">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 py-10 sm:py-12 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0b0714] sm:rounded-3xl">
              <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover" />
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="text-[clamp(2.6rem,6vw,4.5rem)] font-black leading-[0.9] tracking-[-0.05em] text-white">{product.name}</h1>

              {/* Price and Badges */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-white">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-white/50 line-through">₹{product.originalPrice}</span>
                )}
              </div>

              {/* Colors */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">Color</p>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => {
                    const available = isColorAvailable(color.name);
                    return (
                      <button
                        key={`${product.id}-${color.value}`}
                        type="button"
                        onClick={() => handleColorSelect(color.name)}
                        disabled={!available}
                        className={`h-9 w-9 rounded-full border border-white/20 transition-transform duration-300 hover:scale-110 ${selectedColor === color.name ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-[#08050f]' : ''} ${!available ? 'opacity-30 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: color.value }}
                        aria-label={`Select ${color.name}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">Size</p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.sizes.map((size) => {
                    const available = isSizeAvailable(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        disabled={!available}
                        className={`min-w-[48px] rounded-full border px-4 py-2.5 text-xs font-medium transition-all duration-300 ${selectedSize === size ? 'border-violet-500 bg-white/10 text-white' : 'border-white/15 text-white/70'} ${!available ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              {selectedVariant && selectedVariant.stock > 0 && (
                <div className="mt-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 rounded-full border border-white/20 text-white">-</button>
                    <span className="text-white">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} className="h-10 w-10 rounded-full border border-white/20 text-white">+</button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding || (selectedVariant?.stock === 0)}
                  className="w-full rounded-full bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                >
                  {isAdding ? "Added to cart ✓" : "Add to cart"}
                </button>
                {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
              </div>
            </div>
          </div>
          {/* Related products */}
          <section className="border-t border-white/[0.08] py-16 sm:py-20">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-violet-500" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300">
                More from the universe
              </p>
            </div>

            {relatedProducts.length > 0 && (
              <ProductGrid products={relatedProducts} />
            )}
          </section>
        </Container>
      </main>
    </PageReveal>
  );
}
