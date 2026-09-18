export const CART_STORAGE_KEY = "dotverse-cart";
export const CART_STORAGE_VERSION = 1;
export const MAX_CART_QUANTITY = 20;

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    isNonEmptyString(item.id) &&
    isNonEmptyString(item.slug) &&
    isNonEmptyString(item.name) &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    isNonEmptyString(item.image) &&
    isNonEmptyString(item.size) &&
    isNonEmptyString(item.color) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= MAX_CART_QUANTITY
  );
}

export function clampCartQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)));
}

export function parseCartStorage(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const candidate = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && "version" in parsed && parsed.version === CART_STORAGE_VERSION && "items" in parsed && Array.isArray(parsed.items)
        ? parsed.items
        : [];
    return candidate.filter(isValidCartItem).map((item) => ({
      ...item,
      quantity: clampCartQuantity(item.quantity),
    }));
  } catch {
    return [];
  }
}

export function serializeCartStorage(items: CartItem[]) {
  return JSON.stringify({ version: CART_STORAGE_VERSION, items });
}

export function sameCartVariant(
  left: Pick<CartItem, "id" | "size" | "color">,
  right: Pick<CartItem, "id" | "size" | "color">,
) {
  return left.id === right.id && left.size === right.size && left.color === right.color;
}
