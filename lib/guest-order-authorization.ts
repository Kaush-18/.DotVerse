import { createHmac, timingSafeEqual } from "node:crypto";

function getSigningSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not configured.");
  }

  return secret;
}

function tokenPayload(orderId: string, idempotencyKey: string): string {
  return `v1.${orderId}.${idempotencyKey}`;
}

export function createGuestPaymentToken(
  orderId: string,
  idempotencyKey: string,
): string {
  return createHmac("sha256", getSigningSecret())
    .update(tokenPayload(orderId, idempotencyKey))
    .digest("base64url");
}

export function isValidGuestPaymentToken(
  token: unknown,
  orderId: string,
  idempotencyKey: string,
): boolean {
  if (typeof token !== "string" || token.length === 0) {
    return false;
  }

  const actual = Buffer.from(token);
  const expected = Buffer.from(createGuestPaymentToken(orderId, idempotencyKey));

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function isAuthorizedForPayment(
  orderUserId: string | null,
  sessionUserId: string | undefined,
  guestPaymentToken: unknown,
  orderId: string,
  idempotencyKey: string,
): boolean {
  if (sessionUserId !== undefined && orderUserId === sessionUserId) {
    return true;
  }

  return (
    orderUserId === null &&
    isValidGuestPaymentToken(guestPaymentToken, orderId, idempotencyKey)
  );
}
