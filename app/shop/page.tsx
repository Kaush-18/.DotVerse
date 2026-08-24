import Container from "@/components/layout/Container";
import PageReveal from "@/components/animations/PageReveal";
import ProductGrid from "@/components/product/ProductGrid";
import { getProducts } from "@/services/products";

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <PageReveal>
      <main>
        <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32">
          {/* Background atmosphere */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              z-0
              h-[420px]
              w-[600px]
              -translate-x-1/2
              rounded-full
              bg-violet-700/[0.08]
              blur-[130px]
            "
          />

          <Container className="relative z-10">
            {/* Header */}
            <div className="mb-12 sm:mb-14 md:mb-16">
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-3
                  sm:mb-5
                "
              >
                <span className="h-px w-8 bg-violet-500 sm:w-10" />
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-violet-300
                    sm:text-[10px]
                    sm:tracking-[0.3em]
                  "
                >
                  Shop all
                </span>
              </div>

              <h1
                className="
                  max-w-[850px]
                  text-[clamp(3.1rem,7vw,6rem)]
                  font-black
                  leading-[0.88]
                  tracking-[-0.065em]
                  text-white
                "
              >
                Build your
                <br />
                <span className="text-white/35">
                  universe.
                </span>
              </h1>

              <p
                className="
                  mt-6
                  max-w-[420px]
                  text-sm
                  leading-6
                  text-white/45
                "
              >
                {products.length} pieces across the
                DotVerse collection. One frequency. Yours
                to wear.
              </p>
            </div>

            {/* Product grid */}
            <ProductGrid products={products} />

            {/* Bottom label */}
            <div
              className="
                mt-10
                flex
                items-center
                justify-between
                border-t
                border-white/[0.07]
                pt-5
              "
            >
              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-white/25
                  sm:text-[10px]
                "
              >
                .Dot / DotVerse
              </span>

              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-white/25
                  sm:text-[10px]
                "
              >
                Designed beyond the ordinary
              </span>
            </div>
          </Container>
        </section>
      </main>
    </PageReveal>
  );
}