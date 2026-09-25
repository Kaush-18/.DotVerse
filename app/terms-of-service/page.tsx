import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";
import PageReveal from "@/components/animations/PageReveal";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms governing use of the DotVerse website, product purchases, payments, intellectual property, and liability.",
  alternates: { canonical: absoluteUrl("/terms-of-service") },
  openGraph: {
    title: "Terms of Service | DotVerse",
    description:
      "Read the terms governing use of the DotVerse website, product purchases, payments, intellectual property, and liability.",
    type: "website",
    url: absoluteUrl("/terms-of-service"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | DotVerse",
    description:
      "Read the terms governing use of the DotVerse website, product purchases, payments, intellectual property, and liability.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function TermsOfServicePage() {
  return (
    <PageReveal>
      <main className="min-h-screen bg-[#05020c] text-white">
        <Container>
          <div className="py-24 sm:py-32">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <p className="text-violet-400 font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
                .DOT / LEGAL
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase">
                TERMS OF <br className="hidden sm:block" />
                <em className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white italic font-serif font-light">
                  SERVICE.
                </em>
              </h1>
            </div>

            <div className="max-w-4xl mx-auto border border-white/10 bg-white/[0.045] rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="space-y-10 text-white/70 leading-relaxed text-sm md:text-base">
                <p>These Terms of Service govern your use of the DotVerse website and your purchase of products.</p>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Use of Website</h2>
                  <p>You agree to use this website for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the website.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Products and Orders</h2>
                  <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Pricing and Payment</h2>
                  <p>Prices for our products are subject to change without notice. We accept various payment methods, including Cash on Delivery.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Intellectual Property</h2>
                  <p>The content on this website, including text, graphics, and logos, is the property of DotVerse and is protected by intellectual property laws.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Limitation of Liability</h2>
                  <p>DotVerse is not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our website or products.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Jurisdiction</h2>
                  <p>These terms are governed by the laws of India, with jurisdiction in Farrukhabad, Uttar Pradesh.</p>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}
