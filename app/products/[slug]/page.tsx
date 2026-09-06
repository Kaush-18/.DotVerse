import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/products";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";
import { absoluteUrl, siteName, siteUrl } from "@/lib/seo";
import { collections } from "@/components/home/collectionData";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | DotVerse",
    };
  }

  const url = absoluteUrl(`/products/${product.slug}`);
  const title = `${product.name} | ${product.category}`;
  const description = `${product.description} Shop ${product.name} from the DotVerse ${product.collection} collection.`;
  const image = product.images.length > 0 ? absoluteUrl(product.images[0]) : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, alt: product.name }] : [],
      url,
      type: "website",
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.collection,
    product.category,
    3,
  );
  const productUrl = absoluteUrl(`/products/${product.slug}`);
  const productCollection = collections.find(
    (collection) =>
      collection.title.toLowerCase() === product.collection.toLowerCase(),
  );

  // Schema.org Product
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => absoluteUrl(img)),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "DotVerse",
    },
    category: product.category,
    url: productUrl,
    color: product.colors.map((color) => color.name),
    size: product.sizes,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "INR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: siteName,
      },
    },
  };

  // Schema.org BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": absoluteUrl("/shop")
      },
      ...(productCollection
        ? [{
            "@type": "ListItem",
            "position": 3,
            "name": `${productCollection.title} Collection`,
            "item": absoluteUrl(`/collections/${productCollection.id}`),
          }]
        : []),
      {
        "@type": "ListItem",
        "position": productCollection ? 4 : 3,
        "name": product.name,
        "item": productUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
