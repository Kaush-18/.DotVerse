import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";
import PageReveal from "@/components/animations/PageReveal";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how DotVerse Clothing Brand collects, uses, and discloses information from website users.",
  alternates: { canonical: absoluteUrl("/privacy-policy") },
  openGraph: {
    title: "Privacy Policy | DotVerse",
    description:
      "Read how DotVerse Clothing Brand collects, uses, and discloses information from website users.",
    type: "website",
    url: absoluteUrl("/privacy-policy"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | DotVerse",
    description:
      "Read how DotVerse Clothing Brand collects, uses, and discloses information from website users.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function PrivacyPolicyPage() {
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
                PRIVACY <br className="hidden sm:block" />
                <em className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white italic font-serif font-light">
                  MATTERS.
                </em>
              </h1>
            </div>

            <div className="max-w-4xl mx-auto border border-white/10 bg-white/[0.045] rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="space-y-10 text-white/70 leading-relaxed text-sm md:text-base">
                <p>This Privacy Policy explains how DotVerse Clothing Brand collects, uses, and discloses information from users of our website.</p>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
                  <p>We collect information necessary for order processing, account management, and service functionality. This includes contact details and order information provided during the checkout process.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">How We Use Information</h2>
                  <p>We use the collected information to fulfill orders, communicate with you regarding your purchases, and improve our services.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Third-Party Services</h2>
                  <p>We use Vercel Analytics to understand how visitors interact with our website. Please refer to Vercel&apos;s privacy policy for more information on how they handle data.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Cookies</h2>
                  <p>We use cookies to improve your browsing experience. By using our website, you agree to the use of cookies.</p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Contact Us</h2>
                  <p>If you have any questions about our privacy policy, please contact us at <a href="mailto:dotversetshirts@gmail.com" className="text-violet-300 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 rounded px-1 -ml-1 transition-colors">dotversetshirts@gmail.com</a>.</p>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}
