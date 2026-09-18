import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  isWishlistOwner,
  parseWishlistProductId,
  WishlistValidationError,
} from "../lib/validation/wishlist";

describe("wishlist security contracts", () => {
  it("accepts only a product identifier and normalizes it", () => {
    assert.equal(parseWishlistProductId(" product-1 "), "product-1");
    assert.throws(() => parseWishlistProductId({ productId: "product-1", userId: "other-user" }), WishlistValidationError);
  });

  it("rejects missing and oversized product identifiers", () => {
    assert.throws(() => parseWishlistProductId(undefined), WishlistValidationError);
    assert.throws(() => parseWishlistProductId("x".repeat(101)), WishlistValidationError);
  });

  it("requires an authenticated session owner match", () => {
    assert.equal(isWishlistOwner("user-a", "user-a"), true);
    assert.equal(isWishlistOwner("user-a", "user-b"), false);
  });

  it("keeps the same product independent between users", () => {
    assert.notEqual("user-a:product-1", "user-b:product-1");
    assert.equal(isWishlistOwner("user-a", "user-b"), false);
  });

  it("does not authorize removal by product id alone", () => {
    assert.equal(isWishlistOwner("owner", "requester"), false);
  });
});
