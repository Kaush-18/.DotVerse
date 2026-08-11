"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import PageReveal from "@/components/animations/PageReveal";
import ProductGrid from "@/components/product/ProductGrid";
import { getProductBySlug, products } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Using React.use to unwrap the params promise
  const { slug } = React.use(params);
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addToCart } = useCart();

  const relatedProducts = products.filter(
    (item) => item.slug !== product.slug
  );

  return (
    <PageReveal>
      <Navbar />

      <main>
        <Container>
          {/* ... breadcrumb ... */}
          <nav
            aria-label="Breadcrumb"
            className="
              flex
              items-center
              gap-2
              pt-8
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-white/35
            "
          >
            <Link
              href="/shop"
              className="transition-colors hover:text-white"
            >
              Shop
            </Link>
            <span>/</span>
            <span className="text-violet-300">
              {product.name}
            </span>
          </nav>

          {/* ... product detail ... */}
          <div
            className="
              grid
              grid-cols-1
              gap-10
              py-10
              sm:py-12
              md:grid-cols-2
              md:gap-12
              lg:gap-16
            "
          >
            {/* Image */}
            <div
              className="
                relative
                aspect-square
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.1]
                bg-[#0b0714]
                sm:rounded-3xl
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-0
                  bg-[radial-gradient(circle_at_50%_20%,rgba(116,55,220,0.25),transparent_55%)]
                "
              />
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="relative z-10 object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1
                className="
                  text-[clamp(2.6rem,6vw,4.5rem)]
                  font-black
                  leading-[0.9]
                  tracking-[-0.05em]
                  text-white
                "
              >
                {product.name}
              </h1>

              {/* ... colors ... */}
              <div className="mt-8">
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={`${product.id}-${color.value}`}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`
                        h-9
                        w-9
                        rounded-full
                        border
                        border-white/20
                        transition-transform
                        duration-300
                        hover:scale-110
                        ${selectedColor === color.name ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-[#08050f]' : ''}
                      `}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Color ${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* ... sizes ... */}
              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`
                        min-w-[48px]
                        rounded-full
                        border
                        px-4
                        py-2.5
                        text-xs
                        font-medium
                        transition-all
                        duration-300
                        ${selectedSize === size ? 'border-violet-500 bg-white/10 text-white' : 'border-white/15 text-white/70'}
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedSize) {
                      alert("Please select a size");
                      return;
                    }

                    if (!selectedColor) {
                      alert("Please select a color");
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
                    });
                  }}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-full
                    bg-gradient-to-r
                    from-violet-700
                    via-violet-600
                    to-indigo-600
                    px-8
                    py-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_10px_35px_rgba(124,58,237,.35)]
                    transition-all
                    duration-500
                    hover:scale-105
                    hover:shadow-[0_15px_55px_rgba(124,58,237,.55)]
                    active:scale-95
                  "
                >
                  <span className="relative z-10">
                    Add to cart
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}

// Needed to import React for the 'React.use' call above
import * as React from 'react';
