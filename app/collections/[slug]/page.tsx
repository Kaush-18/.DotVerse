import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    return { title: "Collection Not Found | DotVerse", robots: { index: false } };
  }

  const title = `${collection.title} Collection | DotVerse`;
  const description = collection.description;
  const url = absoluteUrl(`/collections/${collection.id}`);

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  return (
    <PageReveal>
      <main className="pt-28 pb-20">
        <Container>
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
            <ProductGrid products={products} />
          ) : (
            <p className="py-20 text-center text-white/60">
              This collection is being tuned for its next drop.
            </p>
          )}
        </Container>
      </main>
    </PageReveal>
  );
}
