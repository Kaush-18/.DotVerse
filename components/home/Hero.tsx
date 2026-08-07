import Layout from "@/components/layout/Layout";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroScene from "./HeroScene";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">

      <HeroBackground />

      <Layout>
        <div className="grid min-h-screen items-center gap-24 pt-20 lg:grid-cols-2">

          <HeroContent />

          <HeroScene />

        </div>
      </Layout>

      <ScrollIndicator />

    </section>
  );
}