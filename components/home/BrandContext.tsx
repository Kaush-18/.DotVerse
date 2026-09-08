"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import { collections } from "./collectionData";

export default function BrandContext() {
  return (
    <section className="home-brand-context">
      <Container>
        <div className="home-brand-context-layout">
          <motion.div
            className="home-brand-context-intro"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="home-brand-context-kicker">THE DOTVERSE UNIVERSE</span>
            <h2>Built around <em>.Dot.</em></h2>
            <p>
              DotVerse is a streetwear identity shaped by bold graphics,
              considered silhouettes, and modern everyday pieces. Explore
              graphic T-shirts, oversized T-shirts, and premium everyday
              pieces designed to carry their own frequency.
            </p>
            <Link href="/shop" className="home-brand-context-shop-link">
              Shop the collection
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>

          <motion.div
            className="home-brand-context-collections"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="home-brand-context-collection"
              >
                <span className="home-brand-context-collection-index">
                  {collection.eyebrow.split(" ")[0]}
                </span>
                <span className="home-brand-context-collection-copy">
                  <strong>Explore {collection.title}</strong>
                  <span>{collection.description}</span>
                </span>
                <span className="home-brand-context-collection-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
