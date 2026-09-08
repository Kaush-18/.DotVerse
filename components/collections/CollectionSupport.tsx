"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { Collection } from "@/components/home/collectionData";
import { collections } from "@/components/home/collectionData";

export default function CollectionSupport({
  collection,
}: {
  collection: Collection;
}) {
  const otherCollections = collections.filter(
    (item) => item.id !== collection.id,
  );

  return (
    <motion.section
      className="collection-support"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="collection-support-heading"
    >
      <div className="collection-support-copy">
        <span className="collection-support-kicker">.DOT / DOTVERSE</span>
        <p>{collection.supportingDescription}</p>
        <Link href="/shop" className="collection-support-shop-link">
          Shop all DotVerse pieces
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <nav
        className="collection-support-nav"
        aria-label="Explore other collections"
      >
        <h2 id="collection-support-heading" className="collection-support-nav-label">
          Continue exploring
        </h2>
        <div className="collection-support-nav-links">
          {otherCollections.map((item) => (
            <Link key={item.id} href={`/collections/${item.id}`}>
              Explore {item.title}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </nav>
    </motion.section>
  );
}
