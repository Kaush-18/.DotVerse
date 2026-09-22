import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import ShopCollectionEditorial from "@/components/shop/ShopCollectionEditorial";
import ShopPageShell from "@/components/shop/ShopPageShell";
import ShopControls from "@/components/shop/ShopControls";
import ShopProductShowroom from "@/components/shop/ShopProductShowroom";
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

type ShopParams = Awaited<ShopPageProps["searchParams"]>;

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

function collectionHref(params: ShopParams, collection?: string) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (key !== "collection" && value) query.set(key, value);
  });
  if (collection) query.set("collection", collection);
  const search = query.toString();
  return search ? `/shop?${search}` : "/shop";
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
    <ShopPageShell>
      <div className="shop-redesign-atmosphere" aria-hidden="true" />
      <Container>
        <header className="shop-redesign-header" aria-labelledby="shop-heading">
          <div>
            <p className="shop-redesign-section-kicker">.DOT / SHOP</p>
            <h1 id="shop-heading">THE .DOT COLLECTION</h1>
            <p>Pieces designed around identity, movement and individuality.</p>
          </div>
          <div className="shop-redesign-header-stats" aria-label="Shop overview">
            <span><strong>{products.length.toString().padStart(2, "0")}</strong><small>PIECES</small></span>
            <span><strong>{collections.length.toString().padStart(2, "0")}</strong><small>COLLECTIONS</small></span>
          </div>
        </header>

        <nav className="shop-redesign-collections" aria-label="Shop collections">
          <div>
            <p className="shop-redesign-section-kicker">THE EDIT / 2026</p>
            <p className="shop-redesign-collection-note">A curated point of view</p>
          </div>
          <div className="shop-redesign-collection-links">
            <Link href={collectionHref(params, undefined)} className={!activeCollection ? "is-active" : ""} aria-current={!activeCollection ? "page" : undefined}>All <small>{products.length.toString().padStart(2, "0")}</small></Link>
            {collections.map((collection) => (
              <Link key={collection.id} href={collectionHref(params, collection.id)} className={activeCollection === collection.id ? "is-active" : ""} aria-current={activeCollection === collection.id ? "page" : undefined}>{collection.title}</Link>
            ))}
          </div>
        </nav>

        <section id="shop-showroom" className="shop-redesign-showroom" aria-labelledby="shop-showroom-heading">
          <h2 id="shop-showroom-heading" className="sr-only">Shop products</h2>
          <ShopControls productCount={products.length} />
          {products.length > 0 ? (
            <ShopProductShowroom products={products} />
          ) : (
            <section className="shop-redesign-empty" aria-labelledby="shop-empty-heading">
              <p className="shop-redesign-section-kicker">THE EDIT IS QUIET HERE</p>
              <h2 id="shop-empty-heading">Nothing here.</h2>
              <p>Try another collection or reset your filters.</p>
              <Link href="/shop" className="shop-redesign-primary-link">Reset filters <span aria-hidden="true">↗</span></Link>
            </section>
          )}
        </section>

        <section className="shop-redesign-stories" aria-labelledby="shop-stories-heading">
          <div className="shop-redesign-stories-heading">
            <div>
              <p className="shop-redesign-section-kicker">THREE WORLDS</p>
              <h2 id="shop-stories-heading">One universe.</h2>
            </div>
            <p>Explore the distinct energies that make .Dot.</p>
          </div>
          <ShopCollectionEditorial collections={collections} />
        </section>

        <section className="shop-redesign-final" aria-labelledby="shop-final-heading">
          <div className="shop-redesign-final-aura" aria-hidden="true" />
          <p className="shop-redesign-section-kicker">THE NEXT CHAPTER IS YOURS</p>
          <h2 id="shop-final-heading">Find your<br /><em>point.</em></h2>
          <p>Explore the .Dot universe.</p>
          <Link href="/shop" className="shop-redesign-primary-link">Shop the collection <span aria-hidden="true">↗</span></Link>
        </section>
      </Container>
    </ShopPageShell>
  );
}
