import { MetadataRoute } from "next";
import { getProducts } from "@/services/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dotverse.store";
  const products = await getProducts();

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
  }));

  return [
    { url: baseUrl },
    { url: `${baseUrl}/shop` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/privacy-policy` },
    { url: `${baseUrl}/shipping-policy` },
    { url: `${baseUrl}/return-refund-policy` },
    { url: `${baseUrl}/terms-of-service` },
    { url: `${baseUrl}/collections/cosmic` },
    { url: `${baseUrl}/collections/essentials` },
    { url: `${baseUrl}/collections/signature` },
    ...productUrls,
  ];
}
