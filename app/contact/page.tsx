import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";
import PageReveal from "@/components/animations/PageReveal";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Contact DotVerse",
  description:
    "Contact DotVerse Clothing Brand by email or phone for support from Farrukhabad, Uttar Pradesh, India.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    title: "Contact DotVerse | DotVerse",
    description:
      "Contact DotVerse Clothing Brand by email or phone for support from Farrukhabad, Uttar Pradesh, India.",
    type: "website",
    url: absoluteUrl("/contact"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact DotVerse | DotVerse",
    description:
      "Contact DotVerse Clothing Brand by email or phone for support from Farrukhabad, Uttar Pradesh, India.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function ContactPage() {
  return (
    <PageReveal>
      <main className="min-h-screen bg-[#05020c] text-white">
        <Container>
          <div className="py-24 sm:py-32">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <p className="text-violet-400 font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
                .DOT / SUPPORT
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase">
                CONTACT <br className="hidden sm:block" />
                <em className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white italic font-serif font-light">
                  THE TEAM.
                </em>
              </h1>
              <p className="mt-8 text-white/50 text-base md:text-lg max-w-xl mx-auto">
                Reach out to us for any inquiries, support, or questions. We&apos;re here to help.
              </p>
            </div>

            <div className="max-w-3xl mx-auto border border-white/10 bg-white/[0.045] rounded-3xl p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="space-y-12">
                <div>
                   <h2 className="text-2xl font-semibold mb-2">DotVerse Clothing Brand</h2>
                   <p className="text-white/50">Farrukhabad, Uttar Pradesh, India</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-2">Email</p>
                    <a href="mailto:dotversetshirts@gmail.com" className="text-lg hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 rounded px-1 -ml-1">dotversetshirts@gmail.com</a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-2">Phone</p>
                    <a href="tel:9599217665" className="text-lg hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 rounded px-1 -ml-1">9599217665</a>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-2">Support Hours</p>
                    <p className="text-lg text-white/80">10:00 AM &ndash; 9:00 PM (IST)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}
