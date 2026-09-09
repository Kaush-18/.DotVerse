import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import PageReveal from "@/components/animations/PageReveal";
import { collections } from "@/components/home/collectionData";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About DotVerse",
  description:
    "Discover the DotVerse streetwear identity, the .Dot design language, and the Cosmic, Essentials, and Signature collections.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    title: "About DotVerse | DotVerse",
    description:
      "Discover the DotVerse streetwear identity, the .Dot design language, and the Cosmic, Essentials, and Signature collections.",
    type: "website",
    url: absoluteUrl("/about"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About DotVerse | DotVerse",
    description:
      "Discover the DotVerse streetwear identity, the .Dot design language, and the Cosmic, Essentials, and Signature collections.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function AboutPage() {
  return (
    <PageReveal>
      <main className="about-page">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="about-breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-violet-300">About</span>
          </nav>

          <header className="about-hero">
            <p className="about-kicker">THE DOTVERSE UNIVERSE</p>
            <h1>
              Built around <em>.Dot.</em>
            </h1>
            <p className="about-hero-copy">
              DotVerse is the broader streetwear identity behind .Dot: a
              design language shaped by bold graphics, considered silhouettes,
              and modern everyday pieces.
            </p>
          </header>

          <section
            className="about-philosophy"
            aria-labelledby="about-universe-heading"
          >
            <div className="about-section-label">
              <span>01</span>
              <span>THE DOTVERSE UNIVERSE</span>
            </div>
            <div className="about-philosophy-copy">
              <h2 id="about-universe-heading">A point of view in motion.</h2>
              <p>
                .Dot is the core identity within DotVerse. Its pieces move
                between graphic expression, clean forms, and everyday wear,
                creating different frequencies without losing the same
                visual point of view.
              </p>
              <p>
                The result is a streetwear wardrobe that can feel futuristic,
                understated, or boldly experimental depending on where you
                enter the universe.
              </p>
            </div>
          </section>

          <section
            className="about-collections"
            aria-labelledby="about-collections-heading"
          >
            <div className="about-section-heading">
              <div className="about-section-label">
                <span>02</span>
                <span>EXPRESSIONS / COLLECTIONS</span>
              </div>
              <h2 id="about-collections-heading">Explore the collections.</h2>
            </div>

            <div className="about-collection-list">
              {collections.map((collection, index) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  className="about-collection-link"
                >
                  <span className="about-collection-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="about-collection-copy">
                    <strong>{collection.title}</strong>
                    <span>{collection.description}</span>
                  </span>
                  <span className="about-collection-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section
            className="about-explore"
            aria-labelledby="about-explore-heading"
          >
            <div>
              <p className="about-kicker">KEEP EXPLORING</p>
              <h2 id="about-explore-heading">Find your frequency.</h2>
            </div>
            <Link href="/shop" className="about-shop-link">
              Explore the full collection
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </Container>
      </main>
    </PageReveal>
  );
}
