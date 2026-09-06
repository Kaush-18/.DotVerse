"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Collection } from "./collectionData";

const artwork: Record<Collection["id"], string> = {
  cosmic: "/images/collections/cosmic.png",
  essentials: "/images/collections/essential.png",
  signature: "/images/collections/signature.png",
};

const microCopy: Record<Collection["id"], [string, string]> = {
  cosmic: ["EXPLORE", "A HIGHER REALITY"],
  essentials: ["BUILT FOR", "EVERYDAY"],
  signature: ["LIMITED", "EXPRESSION"],
};

export default function CollectionCard({
  collection,
  index,
}: {
  collection: Collection;
  index: number;
}) {
  const note = microCopy[collection.id];

  return (
    <motion.article
      className={`collections-rebuild-card collections-rebuild-card--${collection.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="collections-rebuild-card-glow" aria-hidden="true" />
      <div className="collections-rebuild-card-grid" aria-hidden="true" />
      {collection.id === "cosmic" && (
        <div className="collections-rebuild-orbit" aria-hidden="true">
          <span />
        </div>
      )}

      <div className="collections-rebuild-art">
        <Image
          src={artwork[collection.id]}
          alt={`DotVerse ${collection.title[0]}${collection.title.slice(1).toLowerCase()} T-shirt`}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="collections-rebuild-art-image"
        />
      </div>

      <Link
        href={`/collections/${collection.id}`}
        className="collections-rebuild-card-link"
        aria-label={`Explore the ${collection.title.toLowerCase()} collection`}
      >
        <div className="collections-rebuild-card-top">
          <span className="collections-rebuild-card-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="collections-rebuild-card-dash" aria-hidden="true">
            —
          </span>
          <span className="collections-rebuild-card-meta">{collection.title}</span>
          <span className="collections-rebuild-card-note">
            {note[0]}
            <br />
            {note[1]}
          </span>
        </div>

        <div className="collections-rebuild-card-copy">
          <h3>{collection.title}</h3>
          <span>COLLECTION</span>
          <p>{collection.description}</p>
        </div>

        <div className="collections-rebuild-card-cta">
          <span>EXPLORE COLLECTION</span>
          <span aria-hidden="true">→</span>
          <span className="collections-rebuild-arrow" aria-hidden="true">
            ↗
          </span>
        </div>

        <span className="collections-rebuild-background-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>
    </motion.article>
  );
}
