import Container from "@/components/layout/Container";
import PageReveal from "@/components/animations/PageReveal";
import ProductGrid from "@/components/product/ProductGrid";
import ShopControls from "@/components/shop/ShopControls";
import { getFilteredProducts } from "@/services/products";

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    collection?: string;
    color?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function ShopPage(props: ShopPageProps) {
  const searchParams = await props.searchParams;

  const products = await getFilteredProducts({
    q: searchParams.q,
    category: searchParams.category,
    collection: searchParams.collection,
    color: searchParams.color,
    size: searchParams.size,
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined,
    inStock: searchParams.inStock === 'true',
    sort: searchParams.sort,
  });

  const activeFilters = Object.entries(searchParams).filter(([key, value]) => value && key !== 'sort');

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
              <div className="mb-4 flex items-center gap-3 sm:mb-5">
                <span className="h-px w-8 bg-violet-500 sm:w-10" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-violet-300 sm:text-[10px] sm:tracking-[0.3em]">
                  Shop all
                </span>
              </div>

              <h1 className="max-w-[850px] text-[clamp(3.1rem,7vw,6rem)] font-black leading-[0.88] tracking-[-0.065em] text-white">
                Build your
                <br />
                <span className="text-white/35">
                  universe.
                </span>
              </h1>

              <p className="mt-6 max-w-[420px] text-sm leading-6 text-white/45">
                {products.length} {products.length === 1 ? 'piece' : 'pieces'} found in the
                DotVerse collection.
              </p>
            </div>

            {/* Product grid */}
            <ShopControls />

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {activeFilters.map(([key, value]) => (
                  <span key={key} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                    {key}: {value}
                    <a href={`/shop?${new URLSearchParams(Object.entries(searchParams).filter(([k]) => k !== key)).toString()}`}>×</a>
                  </span>
                ))}
                <a href="/shop" className="text-white/50 text-xs px-3 py-1">Clear all</a>
              </div>
            )}

            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="py-20 text-center">
                <p className="text-white/60">No pieces found matching your filters.</p>
              </div>
            )}

            {/* Bottom label */}
            <div className="mt-10 flex items-center justify-between border-t border-white/[0.07] pt-5">
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/25 sm:text-[10px]">
                .Dot / DotVerse
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/25 sm:text-[10px]">
                Designed beyond the ordinary
              </span>
            </div>
          </Container>
        </section>
      </main>
    </PageReveal>
  );
}