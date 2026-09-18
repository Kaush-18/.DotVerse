export class WishlistValidationError extends Error {}

export function parseWishlistProductId(input: unknown): string {
  if (typeof input !== "string") throw new WishlistValidationError("A product is required.");
  const productId = input.trim();
  if (!productId || productId.length > 100) throw new WishlistValidationError("A valid product is required.");
  return productId;
}

export function isWishlistOwner(itemUserId: string, sessionUserId: string): boolean {
  return itemUserId === sessionUserId;
}
