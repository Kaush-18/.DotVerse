import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import PageReveal from "@/components/animations/PageReveal";
import { collections } from "@/components/home/collectionData";
import { products } from "@/data/products";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Size & Fit | DotVerse",
  description:
    "Review available DotVerse sizes and product-specific fit information before choosing your next piece.",
  alternates: { canonical: absoluteUrl("/size-guide") },
  openGraph: {
    title: "Size & Fit | DotVerse",
    description:
      "Review available DotVerse sizes and product-specific fit information before choosing your next piece.",
    type: "website",
    url: absoluteUrl("/size-guide"),
    siteName,
    images: [
      {
        url: absoluteUrl(defaultSocialImage),
        alt: "DotVerse size and fit guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Size & Fit | DotVerse",
    description:
      "Review available DotVerse sizes and product-specific fit information before choosing your next piece.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

const availableSizes = Array.from(
  new Set(products.flatMap((product) => product.sizes)),
);

export default function SizeGuidePage() {
  return (
    <PageReveal>
      <main className="size-guide-page">
        <Container>
          <nav aria-label="Breadcrumb" className="size-guide-breadcrumb">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-violet-300">Size &amp; Fit</span>
          </nav>

          <header className="size-guide-hero">
            <p className="size-guide-kicker">.DOT / FIT SUPPORT</p>
            <h1>Size &amp; Fit</h1>
            <p>
              Every current DotVerse piece is available in S, M, L, XL, and
              XXL. Use the product-specific descriptions below as your starting
              point, then open the product page for the piece you are
              considering.
            </p>
          </header>

          <section
            className="size-guide-overview"
            aria-labelledby="size-guide-overview-heading"
          >
            <div className="size-guide-section-label">
              <span>01</span>
              <span>AVAILABLE SIZES</span>
            </div>
            <div className="size-guide-overview-copy">
              <h2 id="size-guide-overview-heading">Choose your scale.</h2>
              <div className="size-guide-size-list" aria-label="Available sizes">
                {availableSizes.map((size) => (
                  <span key={size}>{size}</span>
                ))}
              </div>
              <p>
                Numerical chest, length, shoulder, and sleeve measurements are
                not currently published in the DotVerse product data, so this
                guide does not estimate or convert them.
              </p>
            </div>
          </section>

          <section
            className="size-guide-products"
            aria-labelledby="size-guide-products-heading"
          >
            <div className="size-guide-section-heading">
              <div className="size-guide-section-label">
                <span>02</span>
                <span>PRODUCT-SPECIFIC FIT</span>
              </div>
              <h2 id="size-guide-products-heading">
                Read the piece, then choose your size.
              </h2>
            </div>

            <div className="size-guide-product-list">
              {products.map((product) => (
                <article key={product.slug} className="size-guide-product">
                  <div>
                    <p className="size-guide-product-category">
                      {product.category}
                    </p>
                    <h3>{product.name}</h3>
                  </div>
                  <p>{product.description}</p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="size-guide-product-link"
                  >
                    View {product.name}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section
            className="size-guide-explore"
            aria-labelledby="size-guide-explore-heading"
          >
            <div>
              <p className="size-guide-kicker">KEEP EXPLORING</p>
              <h2 id="size-guide-explore-heading">Find your frequency.</h2>
              <nav
                className="size-guide-collection-links"
                aria-label="Explore collections"
              >
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.id}`}
                  >
                    {collection.title}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </nav>
            </div>
            <Link href="/shop" className="size-guide-shop-link">
              Explore the full collection
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </Container>
      </main>
    </PageReveal>
  );
}
