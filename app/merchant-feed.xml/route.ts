import { NextResponse } from "next/server";
import { getProducts } from "@/services/products";
import { absoluteUrl, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 300;

const XML_CONTENT_TYPE = "application/xml; charset=utf-8";
const GOOGLE_NAMESPACE = "http://base.google.com/ns/1.0";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatPrice(price: number): string {
  return `${price.toFixed(2)} INR`;
}

function getAvailability(stock: number): "in_stock" | "out_of_stock" {
  return stock > 0 ? "in_stock" : "out_of_stock";
}

function isPublicHttpsUrl(url: string): boolean {
  return (
    url.startsWith("https://") &&
    !url.includes("localhost") &&
    !url.includes("127.0.0.1")
  );
}

function productItem(
  product: Awaited<ReturnType<typeof getProducts>>[number],
  variant?: Awaited<ReturnType<typeof getProducts>>[number]["variants"][number],
) {
  const productUrl = absoluteUrl(`/products/${product.slug}`);
  const imageUrls = product.images
    .map((image) => absoluteUrl(image))
    .filter(isPublicHttpsUrl);

  if (imageUrls.length === 0) {
    return "";
  }

  const additionalImages = imageUrls
    .slice(1)
    .map((image) => `      <g:additional_image_link>${escapeXml(image)}</g:additional_image_link>`)
    .join("\n");

  return `    <item>
      <g:id>${escapeXml(variant ? `${product.id}-${variant.size}-${variant.colorName}` : product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrls[0])}</g:image_link>
      <g:availability>${getAvailability(variant?.stock ?? product.stock)}</g:availability>
      <g:price>${formatPrice(product.price)}</g:price>
      <g:condition>new</g:condition>
      <g:brand>.DotVerse</g:brand>
      <g:product_type>${escapeXml(`${product.collection} > ${product.category}`)}</g:product_type>
      <g:google_product_category>212</g:google_product_category>
${variant ? `      <g:item_group_id>${escapeXml(product.id)}</g:item_group_id>
      <g:size>${escapeXml(variant.size)}</g:size>
      <g:color>${escapeXml(variant.colorName)}</g:color>
` : ""}${additionalImages}
    </item>`;
}

export async function GET() {
  try {
    const products = await getProducts();
    const items = products
      .flatMap((product) =>
        product.variants.length > 0
          ? product.variants.map((variant) => productItem(product, variant))
          : [productItem(product)],
      )
      .filter(Boolean)
      .join("\n");
    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="${GOOGLE_NAMESPACE}">
  <channel>
    <title>${escapeXml(`${siteName} Product Feed`)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml("Current product feed for DotVerse")}</description>
${items}
  </channel>
</rss>`;

    return new NextResponse(feed, {
      headers: {
        "Content-Type": XML_CONTENT_TYPE,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error(
      "Failed to generate Merchant Center feed:",
      error instanceof Error ? error.message : "Unknown database error",
    );

    return new NextResponse("Unable to generate product feed.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}
