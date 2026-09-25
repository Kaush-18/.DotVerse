import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";
import PageReveal from "@/components/animations/PageReveal";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "Review DotVerse return, exchange, refund, and damaged-item procedures, including the 7-day return window.",
  alternates: { canonical: absoluteUrl("/return-refund-policy") },
  openGraph: {
    title: "Return & Refund Policy | DotVerse",
    description:
      "Review DotVerse return, exchange, refund, and damaged-item procedures, including the 7-day return window.",
    type: "website",
    url: absoluteUrl("/return-refund-policy"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Return & Refund Policy | DotVerse",
    description:
      "Review DotVerse return, exchange, refund, and damaged-item procedures, including the 7-day return window.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function ReturnRefundPolicyPage() {
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
                RETURNS & <br className="hidden sm:block" />
                <em className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white italic font-serif font-light">
                  REFUNDS.
                </em>
              </h1>
            </div>

            <div className="max-w-4xl mx-auto border border-white/10 bg-white/[0.045] rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="space-y-8 text-white/70 leading-relaxed text-sm md:text-base">
                <ul className="list-disc list-inside space-y-4">
                  <li>Returns are accepted within 7 days, subject to the stated conditions.</li>
                  <li>Exchanges are allowed.</li>
                  <li>Opened, damaged, or worn products are not eligible for normal return/exchange.</li>
                  <li>DotVerse covers return shipping costs.</li>
                  <li>Refunds are processed within 1-7 business days after the applicable return/refund process is completed.</li>
                </ul>

                <div className="pt-6 border-t border-white/10 mt-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Damaged or Incorrect Items</h2>
                  <p>
                    For damaged or incorrect items, please contact support at <a href="mailto:dotversetshirts@gmail.com" className="text-violet-300 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 rounded px-1 -ml-1 transition-colors">dotversetshirts@gmail.com</a> as soon as possible with your order details and photographs so that DotVerse can review the issue and provide the applicable resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}
