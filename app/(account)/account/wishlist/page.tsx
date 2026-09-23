"use client";

import Link from "next/link";
import { ArrowRight, Heart, RefreshCw } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlistItems, loading, error, retry } = useWishlist();

  return (
    <div className="dot-wishlist-collection">
      <header className="dot-wishlist-header">
        <div>
          <p className="dot-wishlist-kicker">.DOT / PRIVATE COLLECTION</p>
          <h1>
            PRIVATE
            <br />
            <em>COLLECTION.</em>
          </h1>
          <p className="dot-wishlist-intro">The pieces you chose to keep.</p>
        </div>
        <div className="dot-wishlist-count" aria-label={`${wishlistItems.length} saved pieces`}>
          <span>ARCHIVE INDEX</span>
          <strong>{String(wishlistItems.length).padStart(2, "0")}</strong>
          <span>{wishlistItems.length === 1 ? "SAVED PIECE" : "SAVED PIECES"}</span>
        </div>
      </header>

      <section className="dot-wishlist-content" aria-labelledby="wishlist-heading">
        <div className="dot-wishlist-section-heading">
          <div className="dot-wishlist-label">
            <span>01</span>
            <span id="wishlist-heading">Your collection</span>
          </div>
          {!loading && !error && wishlistItems.length > 0 && (
            <span className="dot-wishlist-count-label">{wishlistItems.length} saved</span>
          )}
        </div>

        {loading ? (
          <div className="dot-wishlist-grid" aria-busy="true" aria-label="Loading your private collection">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className="dot-wishlist-skeleton" />)}
          </div>
        ) : error ? (
          <div className="dot-wishlist-state dot-wishlist-error-state" role="alert">
            <Heart size={20} aria-hidden="true" />
            <p className="dot-wishlist-kicker">Private collection unavailable</p>
            <h2>UNABLE TO LOAD<br />YOUR PIECES.</h2>
            <p>Unable to load your saved pieces right now.</p>
            <button type="button" className="dot-wishlist-primary" onClick={retry}>
              <RefreshCw size={15} aria-hidden="true" /> Retry
            </button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="dot-wishlist-state">
            <Heart size={20} aria-hidden="true" />
            <p className="dot-wishlist-kicker">Private collection</p>
            <h2>NOTHING<br />SAVED YET.</h2>
            <p>Your collection is waiting for its first piece.</p>
            <Link href="/shop" className="dot-wishlist-primary">
              Explore the collection <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <span className="dot-wishlist-state-note">Find something worth keeping.</span>
          </div>
        ) : (
          <div className="dot-wishlist-grid">
            {wishlistItems.map(({ product }, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
