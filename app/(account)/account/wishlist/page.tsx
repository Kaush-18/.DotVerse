"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlistItems, loading } = useWishlist();
  return <div className="space-y-7">
    <header className="border-b border-white/10 pb-6"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">Your saved pieces</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Wishlist</h1><p className="mt-2 text-sm text-white/50">Your saved pieces, ready when you are.</p></header>
    {loading ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3" aria-busy="true"><div className="h-72 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="h-72 animate-pulse rounded-2xl bg-white/[0.04]" /></div> : wishlistItems.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center"><Heart size={28} className="mx-auto text-violet-300" /><h2 className="mt-5 text-xl font-semibold text-white">Your wishlist is empty.</h2><p className="mt-2 text-sm text-white/50">Save pieces you love and come back to them later.</p><Link href="/shop" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500">Explore the Collection <ArrowRight size={15} /></Link></div> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{wishlistItems.map(({ product }, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>}
  </div>;
}
