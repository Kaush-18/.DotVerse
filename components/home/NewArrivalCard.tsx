"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

const taglines: Record<string, string> = {
  "cosmic-tee": "Beyond the ordinary.",
  "void-tee": "Everyday frequency.",
  "orbit-tee": "More than apparel.",
  "frequency-tee": "A higher perspective.",
};

export default function NewArrivalCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();
  const color = product.colors[0];
  const size = product.sizes[0] ?? "M";

  return (
    <motion.article
      className="new-arrivals-rebuild-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="new-arrivals-rebuild-art">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 25vw"
            className="new-arrivals-rebuild-image"
          />
        </Link>

        {product.badge && (
          <span className="new-arrivals-rebuild-badge">{product.badge}</span>
        )}

        <button
          type="button"
          className={`new-arrivals-rebuild-wishlist${liked ? " is-liked" : ""}`}
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => setLiked((value) => !value)}
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="new-arrivals-rebuild-info">
        <div className="new-arrivals-rebuild-name-row">
          <h3>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <span>₹{product.price.toLocaleString("en-IN")}</span>
        </div>

        <p>{taglines[product.id] ?? product.description}</p>

        <div className="new-arrivals-rebuild-options">
          <div className="new-arrivals-rebuild-colors" aria-label="Available colors">
            {product.colors.slice(0, 3).map((item, colorIndex) => (
              <span
                key={`${product.id}-${item.name}`}
                className={colorIndex === 0 ? "is-active" : ""}
                style={{ backgroundColor: item.value }}
                title={item.name}
              />
            ))}
          </div>

          <div className="new-arrivals-rebuild-sizes" aria-label="Available sizes">
            {product.sizes.slice(0, 4).map((item) => (
              <span key={`${product.id}-${item}`}>{item}</span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="new-arrivals-rebuild-cart"
          onClick={() =>
            addToCart({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
              size,
              color: color.name,
            })
          }
        >
          <span>ADD TO CART</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.article>
  );
}
