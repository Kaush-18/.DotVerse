import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";
import PageReveal from "@/components/animations/PageReveal";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Review DotVerse shipping details, including delivery within India, free shipping, and 1-7 day order processing.",
  alternates: { canonical: absoluteUrl("/shipping-policy") },
  openGraph: {
    title: "Shipping Policy | DotVerse",
    description:
      "Review DotVerse shipping details, including delivery within India, free shipping, and 1-7 day order processing.",
    type: "website",
    url: absoluteUrl("/shipping-policy"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Policy | DotVerse",
    description:
      "Review DotVerse shipping details, including delivery within India, free shipping, and 1-7 day order processing.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function ShippingPolicyPage() {
  return (
    <PageReveal>
      <main className="min-h-screen bg-[#05020c] text-white">
        <Container>
          <div className="py-24 sm:py-32">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <p className="text-violet-400 font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
                .DOT / POLICY
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase">
                SHIPPING <br className="hidden sm:block" />
                <em className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white italic font-serif font-light">
                  DETAILS.
                </em>
              </h1>
            </div>

            <div className="max-w-4xl mx-auto border border-white/10 bg-white/[0.045] rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="space-y-6 text-white/70 leading-relaxed text-sm md:text-base">
                <ul className="list-disc list-inside space-y-4">
                  <li>DotVerse currently ships within India.</li>
                  <li>Shipping is free.</li>
                  <li>Orders are processed within 1-7 days.</li>
                  <li>Shipping carrier is currently not specified.</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}
