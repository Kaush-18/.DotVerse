import { notFound } from "next/navigation";


import { getProductBySlug, getRelatedProducts } from "@/services/products";
import ProductDetailClient from "./ProductDetailClient";


interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
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


  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
