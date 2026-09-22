"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import type { Collection } from "@/components/home/collectionData";

function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const imageName = collection.id === "essentials" ? "essential" : collection.id;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8%" },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className={`shop-collection-card shop-collection-card--${collection.id} ${isVisible ? "is-visible" : ""}`}
      style={{ "--shop-collection-delay": `${index * 90}ms` } as CSSProperties}
    >
      <Link href={`/collections/${collection.id}`} className="shop-collection-card-link">
        <div className="shop-collection-media">
          <Image
            src={`/images/collections/${imageName}.png`}
            alt={`${collection.title} collection: ${collection.description}`}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 70vw"
            className="shop-collection-image"
          />
          <span className="shop-collection-wash" aria-hidden="true" />
          <span className="shop-collection-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="shop-collection-corner" aria-hidden="true">.DOT</span>
        </div>
        <div className="shop-collection-content">
          <div className="shop-collection-heading">
            <p className="shop-collection-kicker">{String(index + 1).padStart(2, "0")} / COLLECTION</p>
            <h3>{collection.title}</h3>
          </div>
          <p className="shop-collection-description">{collection.description}</p>
          <span className="shop-collection-link">Explore collection <b aria-hidden="true">↗</b></span>
        </div>
      </Link>
    </article>
  );
}

export default function ShopCollectionEditorial({ collections }: { collections: Collection[] }) {
  return (
    <div className="shop-collections-editorial">
      {collections.map((collection, index) => (
        <CollectionCard key={collection.id} collection={collection} index={index} />
      ))}
    </div>
  );
}
