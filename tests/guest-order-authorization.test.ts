import { describe, it } from "node:test";
import assert from "node:assert/strict";

process.env.BETTER_AUTH_SECRET = "test-secret";

import {
  createGuestPaymentToken,
  isAuthorizedForPayment,
  isValidGuestPaymentToken,
} from "../lib/guest-order-authorization";

describe("guest payment authorization", () => {
  it("accepts a token for the exact order and idempotency key", () => {
    const token = createGuestPaymentToken("order-1", "request-1");

    assert.equal(isValidGuestPaymentToken(token, "order-1", "request-1"), true);
  });

  it("rejects a token for another order or idempotency key", () => {
    const token = createGuestPaymentToken("order-1", "request-1");

    assert.equal(isValidGuestPaymentToken(token, "order-2", "request-1"), false);
    assert.equal(isValidGuestPaymentToken(token, "order-1", "request-2"), false);
  });

  it("rejects missing or malformed tokens", () => {
    assert.equal(isValidGuestPaymentToken(undefined, "order-1", "request-1"), false);
    assert.equal(isValidGuestPaymentToken("invalid", "order-1", "request-1"), false);
  });

  it("authorizes the authenticated owner but rejects another user", () => {
    assert.equal(
      isAuthorizedForPayment("user-1", "user-1", undefined, "order-1", "request-1"),
      true,
    );
    assert.equal(
      isAuthorizedForPayment("user-1", "user-2", undefined, "order-1", "request-1"),
      false,
    );
  });

  it("authorizes a guest only with the server-signed token", () => {
    const token = createGuestPaymentToken("order-1", "request-1");

    assert.equal(
      isAuthorizedForPayment(null, undefined, token, "order-1", "request-1"),
      true,
    );
    assert.equal(
      isAuthorizedForPayment(null, undefined, undefined, "order-1", "request-1"),
      false,
    );
  });
});
