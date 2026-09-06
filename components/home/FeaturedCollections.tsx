"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import CollectionCard from "./CollectionCard";
import { collections } from "./collectionData";

export default function FeaturedCollections() {
  return (
    <section id="collections" className="collections-rebuild">
      <Container>
        <header className="collections-rebuild-intro">
          <motion.div
            className="collections-rebuild-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>DROPS / COLLECTIONS</span>
            <h2>
              Find your <em>frequency.</em>
            </h2>
          </motion.div>

          <motion.div
            className="collections-rebuild-support"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>
              Three distinct
              <br />
              expressions.
              <br />
              One universe.
            </p>
            <span>
              DIFFERENT WORLDS.
              <br />
              SAME MINDSET.
            </span>
          </motion.div>

          <div className="collections-rebuild-nav" aria-hidden="true">
            <span>→ WEAR</span>
            <span>→ EXPLORE</span>
            <span>→ BELONG</span>
          </div>
        </header>

        <div className="collections-rebuild-grid">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>

        <motion.footer
          className="collections-rebuild-footer"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          <span className="collections-rebuild-footer-mark" aria-hidden="true">
            →
          </span>
          <p>
            CLOTHES AREN&apos;T JUST FABRIC.
            <br />
            THEY&apos;RE FREQUENCIES YOU WEAR.
          </p>
          <span className="collections-rebuild-signoff">
            .DOTVERSE
            <br />
            EST. 2026
          </span>
        </motion.footer>
      </Container>
    </section>
  );
}
