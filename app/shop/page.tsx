import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";
import ShopControls from "@/components/shop/ShopControls";
import { collections } from "@/components/home/collectionData";
import { getFilteredProducts } from "@/services/products";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    collection?: string;
    color?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Object.values(params).some(Boolean);
  const title = "Shop DotVerse Graphic T-Shirts & Streetwear";
  const description = "Browse DotVerse's original graphic T-shirts and modern streetwear collection, designed with distinctive visuals, everyday comfort, and a bold point of view.";

  return {
    title,
    description,
    alternates: { canonical: "https://dotverse.store/shop" },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: "https://dotverse.store/shop", siteName, type: "website", images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse graphic T-shirts and modern streetwear" }] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(defaultSocialImage)] },
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = await getFilteredProducts({
    q: params.q,
    category: params.category,
    collection: params.collection,
    color: params.color,
    size: params.size,
    minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
    inStock: params.inStock === "true",
    sort: params.sort,
  });
  const activeCollection = params.collection ?? "";

  return (
    <main className="dot-shop dot-shop-reference">
      <div className="dot-shop-reference-background" aria-hidden="true" />
      <section className="dot-shop-reference-hero" aria-labelledby="shop-heading">
        <Image className="dot-shop-reference-hero-bg" src="/images/hero/dotverse-cosmic-hero-bg.png" alt="" fill priority sizes="100vw" />
        <div className="dot-shop-reference-hero-shade" aria-hidden="true" />
        <Container className="dot-shop-reference-hero-inner">
          <div className="dot-shop-reference-hero-copy">
            <p className="dot-shop-reference-kicker">.DOT / DIGITAL SHOWROOM</p>
            <h1 id="shop-heading">WEAR<br /><em>YOUR POINT.</em></h1>
            <p className="dot-shop-reference-description">Explore the full .Dot collection — pieces designed around identity, movement and individuality.</p>
            <div className="dot-shop-reference-stats" aria-label="Shop statistics">
              <span><strong>{products.length.toString().padStart(2, "0")}</strong><small>PIECES</small></span>
              <span><strong>03</strong><small>COLLECTIONS</small></span>
            </div>
          </div>
          <div className="dot-shop-reference-hero-art" aria-label=".Dot cosmic collection hero image">
            <div className="dot-shop-reference-orbit dot-shop-reference-orbit-one" aria-hidden="true" />
            <div className="dot-shop-reference-orbit dot-shop-reference-orbit-two" aria-hidden="true" />
            <Image src="/images/hero/dotverse-hero-tshirts.png" alt=".Dot cosmic T-shirts" fill sizes="(max-width: 700px) 90vw, 58vw" />
            <span className="dot-shop-reference-hero-note">CLOTHES<br />FOR A BRIGHTER<br />TOMORROW</span>
            <span className="dot-shop-reference-hero-index">01 / 03</span>
          </div>
        </Container>
        <div className="dot-shop-reference-slides" aria-hidden="true"><span className="is-active">01</span><span>02</span><span>03</span></div>
      </section>

      <Container>
        <nav className="dot-shop-reference-tabs" aria-label="Shop collections">
          <span className="dot-shop-reference-section-label">THE EDIT / 2026</span>
          <div className="dot-shop-reference-tab-list">
            <Link href="/shop" className={!activeCollection ? "is-active" : ""} aria-current={!activeCollection ? "page" : undefined}>ALL <span>{products.length.toString().padStart(2, "0")}</span></Link>
            {collections.map((collection) => (
              <Link key={collection.id} href={`/shop?collection=${collection.id}`} className={activeCollection === collection.id ? "is-active" : ""} aria-current={activeCollection === collection.id ? "page" : undefined}>{collection.title}</Link>
            ))}
          </div>
        </nav>

        <ShopControls productCount={products.length} />

        {products.length > 0 ? (
          <ProductGrid products={products} className="dot-shop-reference-grid" />
        ) : (
          <section className="dot-shop-reference-empty" aria-labelledby="shop-empty-heading">
            <span className="dot-shop-reference-kicker">THE EDIT IS QUIET HERE</span>
            <h2 id="shop-empty-heading">Nothing here.</h2>
            <p>Try another collection or reset your filters.</p>
            <Link href="/shop" className="dot-shop-reference-button">Reset filters <span aria-hidden="true">→</span></Link>
          </section>
        )}

        <section className="dot-shop-reference-editorial" aria-labelledby="shop-editorial-heading">
          <Image src="/images/hero/ChatGPT Image Sep 7, 2026, 03_18_56 AM.png" alt="Atmospheric rocky landscape beneath a moon" fill sizes="100vw" />
          <div className="dot-shop-reference-editorial-shade" aria-hidden="true" />
          <div className="dot-shop-reference-editorial-copy">
            <p className="dot-shop-reference-kicker">THE POINT OF VIEW CONTINUES</p>
            <h2 id="shop-editorial-heading">IDENTITY<br /><em>IN EVERY THREAD.</em></h2>
            <p>More than just fashion. A reflection of who you are and where you&apos;re heading.</p>
            <Link href="/#collections" className="dot-shop-reference-button">Explore collections <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="dot-shop-reference-worlds" aria-labelledby="shop-worlds-heading">
          <div className="dot-shop-reference-worlds-heading">
            <p className="dot-shop-reference-kicker">OUR COLLECTIONS</p>
            <h2 id="shop-worlds-heading">THREE WORLDS.<br /><em>ONE UNIVERSE.</em></h2>
          </div>
          <div className="dot-shop-reference-world-grid">
            {collections.map((collection, index) => (
              <Link key={collection.id} href={`/collections/${collection.id}`} className="dot-shop-reference-world">
                <Image src={`/images/collections/${collection.id === "essentials" ? "essential" : collection.id}.png`} alt={`${collection.title} collection`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                <span className="dot-shop-reference-world-shade" aria-hidden="true" />
                <span className="dot-shop-reference-world-number">0{index + 1}</span>
                <span className="dot-shop-reference-world-copy"><strong>{collection.title}</strong><small>{index === 0 ? "A visual exploration of the unknown." : index === 1 ? "The foundation of everyday identity." : "Statement pieces built around the .Dot philosophy."}</small><b>Explore <i aria-hidden="true">→</i></b></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="dot-shop-reference-final" aria-labelledby="shop-final-heading">
          <span className="dot-shop-reference-final-dot" aria-hidden="true">.</span>
          <p className="dot-shop-reference-kicker">THE NEXT CHAPTER IS YOURS</p>
          <h2 id="shop-final-heading">FIND YOUR<br /><em>POINT.</em></h2>
          <p>Explore the full collection and be part of something bigger.</p>
          <Link href="/shop" className="dot-shop-reference-button">Shop now <span aria-hidden="true">→</span></Link>
        </section>
      </Container>
    </main>
  );
}
