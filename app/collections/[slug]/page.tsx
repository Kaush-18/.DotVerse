import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Container from "@/components/layout/Container";
import PageReveal from "@/components/animations/PageReveal";
import ProductGrid from "@/components/product/ProductGrid";
import { collections } from "@/components/home/collectionData";
import { getFilteredProducts } from "@/services/products";
import { absoluteUrl, siteName } from "@/lib/seo";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.id }));
}

function getCollection(slug: string) {
  return collections.find((collection) => collection.id === slug);
}

const collectionImages: Record<string, string> = {
  cosmic: "/images/collections/cosmic.png",
  essentials: "/images/collections/essential.png",
  signature: "/images/collections/signature.png",
};

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    return { title: "Collection Not Found | DotVerse", robots: { index: false } };
  }

  const title = `${collection.title} Collection`;
  const description = collection.description;
  const url = absoluteUrl(`/collections/${collection.id}`);
  const image = absoluteUrl(collectionImages[collection.id]);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName,
      images: [{ url: image, alt: `${collection.title} collection by DotVerse` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  const products = await getFilteredProducts({ collection: collection.id });
  const collectionUrl = absoluteUrl(`/collections/${collection.id}`);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Collections", item: absoluteUrl("/#collections") },
      { "@type": "ListItem", position: 3, name: `${collection.title} Collection`, item: collectionUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <PageReveal>
      <main className="pt-28 pb-20">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/#collections" className="transition-colors hover:text-white">Collections</Link>
            <span>/</span>
            <span className="text-violet-300">{collection.title}</span>
          </nav>
          <header className="mb-12 max-w-3xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300">
              {collection.eyebrow}
            </p>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.86] tracking-[-0.08em] text-white">
              {collection.title}
              <span className="block text-white/35">COLLECTION.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-white/65">
              {collection.description}
            </p>
          </header>

          {products.length > 0 ? (
            <section aria-labelledby="collection-products-heading">
              <h2 id="collection-products-heading" className="sr-only">
                {collection.title} collection products
              </h2>
              <ProductGrid products={products} />
            </section>
          ) : (
            <p className="py-20 text-center text-white/60">
              This collection is being tuned for its next drop.
            </p>
          )}
        </Container>
      </main>
      </PageReveal>
    </>
  );
}
