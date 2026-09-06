"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { products } from "@/data/products";
import Container from "@/components/layout/Container";
import NewArrivalCard from "./NewArrivalCard";

export default function NewArrivals() {
  return (
    <section className="new-arrivals-section new-arrivals-rebuild">
      <Container>
        <header className="new-arrivals-rebuild-header">
          <div className="new-arrivals-rebuild-heading">
            <span>NEW ARRIVALS</span>
            <h2>
              Fresh drops.
              <br />
              <em>Higher dreams.</em>
            </h2>
            <p>
              The latest from the DotVerse universe. New designs. New expressions. Same frequency.
            </p>
          </div>

          <div className="new-arrivals-rebuild-side">
            <span className="new-arrivals-rebuild-side-mark" aria-hidden="true">✦</span>
            <p>
              WEAR
              <br />
              THE NEXT
              <br />
              FREQUENCY.
            </p>
            <small>
              LIMITED DROPS.
              <br />
              INFINITE STORIES.
            </small>
          </div>

          <Link href="/shop" className="new-arrivals-rebuild-view-all">
            <span>VIEW ALL<br />PRODUCTS</span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </header>

        <div className="new-arrivals-rebuild-grid">
          {products.filter((product) => product.featured).slice(0, 4).map((product, index) => (
            <NewArrivalCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <footer className="new-arrivals-rebuild-footer">
          <span aria-hidden="true">→</span>
          <p>
            SAME FABRIC.
            <br />
            A BRIGHTER YOU.
          </p>
          <span>
            .DOTVERSE
            <br />
            EST. 2026
          </span>
        </footer>
      </Container>
    </section>
  );
}