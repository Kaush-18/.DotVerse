/**
 * Account order access is intentionally limited to the authenticated owner.
 * The caller must obtain both IDs from trusted server-side sources.
 */
export function isOrderOwnedByUser(
  orderUserId: string | null,
  sessionUserId: string,
) {
  return orderUserId !== null && orderUserId === sessionUserId;
}
