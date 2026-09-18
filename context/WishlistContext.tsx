"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { authClient } from "@/lib/auth-client";

export type WishlistItem = { id: string; product: Product };
type WishlistContextValue = {
  wishlistItems: WishlistItem[];
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string, product?: Product) => Promise<boolean>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState<Set<string>>(new Set());
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (sessionPending) return;
    let cancelled = false;
    // Reset in-memory state whenever the authenticated identity changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWishlistItems([]);
    setLoading(Boolean(userId));
    if (!userId) return;
    void fetch("/api/account/wishlist", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as { items?: WishlistItem[] };
        if (!response.ok) throw new Error("Unable to load wishlist.");
        if (!cancelled) setWishlistItems(data.items ?? []);
      })
      .catch(() => { if (!cancelled) setWishlistItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [sessionPending, userId]);

  async function toggleWishlist(productId: string, product?: Product) {
    if (!userId) { window.alert("Sign in to save items to your wishlist."); return false; }
    if (mutating.has(productId)) return false;
    const existing = wishlistItems.find((item) => item.product.id === productId);
    setMutating((current) => new Set(current).add(productId));
    if (existing) setWishlistItems((items) => items.filter((item) => item.product.id !== productId));
    else if (product) setWishlistItems((items) => [{ id: `pending-${productId}`, product }, ...items]);
    try {
      const response = await fetch(existing ? `/api/account/wishlist/${encodeURIComponent(productId)}` : "/api/account/wishlist", {
        method: existing ? "DELETE" : "POST",
        ...(existing ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) }),
      });
      if (!response.ok) throw new Error("Wishlist update failed.");
      if (!existing) {
        const data = await response.json() as { item?: { id: string } };
        if (data.item) setWishlistItems((items) => items.map((item) => item.id === `pending-${productId}` ? { id: data.item!.id, product: item.product } : item));
      }
      return true;
    } catch {
      if (existing) setWishlistItems((items) => [{ id: existing.id, product: existing.product }, ...items]);
      else setWishlistItems((items) => items.filter((item) => item.id !== `pending-${productId}`));
      window.alert("Unable to update your wishlist. Please try again.");
      return false;
    } finally { setMutating((current) => { const next = new Set(current); next.delete(productId); return next; }); }
  }

  return <WishlistContext.Provider value={{ wishlistItems, loading, isWishlisted: (id) => wishlistItems.some((item) => item.product.id === id), toggleWishlist }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
