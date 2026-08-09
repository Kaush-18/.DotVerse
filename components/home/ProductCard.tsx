"use client";

import { useState } from "react";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "./productData";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({
  product,
  index,
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
      className="group"
    >
      {/* Product image */}
      <div
        className="
          relative
          aspect-[4/5]
          overflow-hidden
          rounded-[24px]
          border
          border-white/[0.08]
          bg-[#10091c]
        "
      >
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={product.image}
            alt={product.name}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            "
          />
        </div>

        {/* Purple ambient gradient */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.22),transparent_35%)]
            opacity-70
          "
        />

        {/* Bottom gradient */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-1/2
            bg-gradient-to-t
            from-black/50
            to-transparent
          "
        />

        {/* Badge */}
        {product.badge && (
          <div
            className="
              absolute
              left-4
              top-4
              rounded-full
              border
              border-violet-400/20
              bg-black/40
              px-3
              py-1.5
              text-[9px]
              font-semibold
              tracking-[0.2em]
              text-violet-200
              backdrop-blur-md
            "
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={
            liked
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={() => setLiked((value) => !value)}
          className="
            absolute
            right-4
            top-4
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-black/35
            text-white
            backdrop-blur-md
            transition-all
            duration-300
            hover:border-violet-400/40
            hover:bg-violet-500
          "
        >
          <Heart
            size={16}
            strokeWidth={1.7}
            fill={liked ? "currentColor" : "none"}
          />
        </button>

        {/* Quick view */}
        <motion.button
          type="button"
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileHover={{
            scale: 1.02,
          }}
          className="
            absolute
            bottom-5
            left-1/2
            flex
            -translate-x-1/2
            items-center
            gap-2
            whitespace-nowrap
            rounded-full
            border
            border-white/10
            bg-white/[0.08]
            px-5
            py-3
            text-xs
            font-semibold
            text-white
            opacity-0
            backdrop-blur-xl
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
            hover:bg-violet-600
          "
        >
          Quick view
          <ArrowUpRight size={14} />
        </motion.button>
      </div>

      {/* Product information */}
      <div className="px-1 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.2em] text-violet-400/70">
              {product.category}
            </p>

            <h3 className="text-base font-semibold tracking-tight text-white">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <ShoppingBag
              size={14}
              className="
                text-white/30
                transition-colors
                duration-300
                group-hover:text-violet-400
              "
            />

            <span className="text-sm font-semibold text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Price */}
        {product.originalPrice && (
          <p className="mt-1 text-xs text-white/25 line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </p>
        )}

        {/* Colors */}
        <div className="mt-4 flex items-center gap-2">
          {product.colors.map((color) => (
            <span
              key={color}
              className="
                h-3.5
                w-3.5
                rounded-full
                border
                border-white/20
                shadow-inner
              "
              style={{
                backgroundColor: color,
              }}
            />
          ))}

          <span className="ml-1 text-[10px] text-white/25">
            {product.colors.length} colors
          </span>
        </div>
      </div>
    </motion.article>
  );
}