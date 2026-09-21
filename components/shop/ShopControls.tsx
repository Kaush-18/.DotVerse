"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const categories = [
  { value: "", label: "All categories" },
  { value: "graphic-t-shirt", label: "Graphic T-Shirt" },
  { value: "oversized-t-shirt", label: "Oversized T-Shirt" },
  { value: "premium-t-shirt", label: "Premium T-Shirt" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function getFilterLabel(key: string, value: string) {
  if (key === "inStock") return "In stock";
  if (key === "minPrice" && value === "500") return "₹500+";
  if (key === "maxPrice" && value === "500") return "Under ₹500";
  if (key === "maxPrice" && value === "1000") return "Under ₹1,000";
  if (key === "category") return value.replaceAll("-", " ");
  return value;
}

export default function ShopControls({ productCount }: { productCount: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    updateQuery({ q: value || null });
  }, 300);

  const activeFilters = Array.from(searchParams.entries()).filter(
    ([key, value]) => value && key !== "sort" && key !== "q",
  );
  const activeFilterCount = activeFilters.length + (searchParams.get("q") ? 1 : 0);

  const resetFilters = () => {
    router.push(pathname, { scroll: false });
    setMobileOpen(false);
  };

  const filterFields = (
    <>
      <label className="shop-filter-field">
        <span>Category</span>
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(event) => updateQuery({ category: event.target.value || null })}
        >
          {categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label className="shop-filter-field">
        <span>Availability</span>
        <select
          value={searchParams.get("inStock") === "true" ? "true" : ""}
          onChange={(event) => updateQuery({ inStock: event.target.value || null })}
        >
          <option value="">All pieces</option>
          <option value="true">In stock</option>
        </select>
      </label>
      <label className="shop-filter-field">
        <span>Price</span>
        <select
          value={searchParams.get("minPrice") === "500" ? "500-plus" : searchParams.get("maxPrice") ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            updateQuery({
              minPrice: value === "500-plus" ? "500" : null,
              maxPrice: value === "500" || value === "1000" ? value : null,
            });
          }}
        >
          <option value="">Any price</option>
          <option value="500">Under ₹500</option>
          <option value="1000">Under ₹1,000</option>
          <option value="500-plus">₹500 and above</option>
        </select>
      </label>
    </>
  );

  return (
    <section className="shop-controls" aria-label="Shop controls">
      <div className="shop-controls-topline">
        <p>{productCount} {productCount === 1 ? "piece" : "pieces"}</p>
        <button type="button" className="shop-mobile-filter-trigger" onClick={() => setMobileOpen(true)} aria-expanded={mobileOpen}>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
        <label className="shop-search">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            placeholder="Search the collection"
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(event) => handleSearch(event.target.value)}
          />
          <span aria-hidden="true">⌕</span>
        </label>
        <label className="shop-sort">
          <span>Sort</span>
          <select value={searchParams.get("sort") ?? "featured"} onChange={(event) => updateQuery({ sort: event.target.value === "featured" ? null : event.target.value })}>
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>

      <div className="shop-desktop-filters">
        {filterFields}
      </div>

      {activeFilterCount > 0 && (
        <div className="shop-active-filters" aria-label="Active filters">
          {searchParams.get("q") && <button type="button" onClick={() => updateQuery({ q: null })}>Search: {searchParams.get("q")} ×</button>}
          {activeFilters.map(([key, value]) => (
            <button key={`${key}-${value}`} type="button" onClick={() => updateQuery({ [key]: null })}>
              {getFilterLabel(key, value)} ×
            </button>
          ))}
          <button type="button" className="shop-clear-filters" onClick={resetFilters}>Reset</button>
        </div>
      )}

      {mobileOpen && (
        <div className="shop-filter-drawer-backdrop" role="presentation" onClick={() => setMobileOpen(false)}>
          <div className="shop-filter-drawer" role="dialog" aria-modal="true" aria-labelledby="shop-filter-heading" onClick={(event) => event.stopPropagation()}>
            <div className="shop-filter-drawer-heading">
              <div><span className="premium-eyebrow">Refine the edit</span><h2 id="shop-filter-heading">Filters</h2></div>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close filters">×</button>
            </div>
            <div className="shop-filter-drawer-fields">{filterFields}</div>
            <div className="shop-filter-drawer-actions">
              <button type="button" className="shop-clear-filters" onClick={resetFilters}>Reset all</button>
              <button type="button" className="premium-button premium-button-solid" onClick={() => setMobileOpen(false)}>Show pieces</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
