import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CART_STORAGE_VERSION,
  clampCartQuantity,
  parseCartStorage,
  sameCartVariant,
  serializeCartStorage,
  type CartItem,
} from "../lib/cart";

const item: CartItem = {
  id: "cosmic-tee",
  slug: "cosmic-tee",
  name: "Cosmic Tee",
  price: 399,
  image: "/images/products/cosmic-tee.png",
  size: "L",
  color: "White",
  quantity: 1,
};

describe("cart storage", () => {
  it("round-trips the versioned format", () => {
    assert.deepEqual(parseCartStorage(serializeCartStorage([item])), [item]);
  });

  it("recovers from malformed or unsupported storage", () => {
    assert.deepEqual(parseCartStorage("not-json"), []);
    assert.deepEqual(parseCartStorage(JSON.stringify({ version: CART_STORAGE_VERSION + 1, items: [item] })), []);
    assert.deepEqual(parseCartStorage(JSON.stringify([{ ...item, quantity: 0 }])), []);
  });

  it("clamps valid quantities and rejects invalid entries", () => {
    assert.equal(clampCartQuantity(999), 20);
    assert.equal(clampCartQuantity(-2), 1);
    assert.equal(parseCartStorage(JSON.stringify([{ ...item, quantity: 4 }]))[0].quantity, 4);
    assert.deepEqual(parseCartStorage(JSON.stringify([{ ...item, price: "399" }])), []);
  });

  it("keeps same variants together and different variants separate", () => {
    assert.equal(sameCartVariant(item, { ...item }), true);
    assert.equal(sameCartVariant(item, { ...item, size: "XL" }), false);
    assert.equal(sameCartVariant(item, { ...item, color: "Black" }), false);
  });
});
