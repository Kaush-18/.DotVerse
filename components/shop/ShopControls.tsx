"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function ShopControls() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = useDebouncedCallback((term: string) => {
    router.push(`/shop?${createQueryString("q", term)}`);
  }, 300);

  const handleSort = (sort: string) => {
    router.push(`/shop?${createQueryString("sort", sort)}`);
  };

  return (
    <div className="flex items-center gap-4 py-6 border-b border-white/[0.08] mb-8">
      <input
        type="text"
        placeholder="Search..."
        defaultValue={searchParams.get("q") || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-transparent border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-violet-500"
      />
      
      <select
        defaultValue={searchParams.get("sort") || "featured"}
        onChange={(e) => handleSort(e.target.value)}
        className="bg-transparent text-white text-sm focus:outline-none"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
      </select>
    </div>
  );
}
