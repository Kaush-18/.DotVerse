export const PAYMENT_METHODS = ["COD", "UPI", "CARD"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface OrderItemInput {
  id: string;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderInput {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
  items: OrderItemInput[];
}

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  value: unknown,
  name: string,
  maxLength: number,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new OrderValidationError(`${name} is required.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new OrderValidationError(`${name} is too long.`);
  }
  return trimmed;
}

export function parseCreateOrderRequest(value: unknown): OrderInput {
  if (!isRecord(value)) {
    throw new OrderValidationError("Invalid order data.");
  }

  const email = requiredString(value.email, "Email", 255);
  // Simple regex for email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new OrderValidationError("Invalid email format.");
  }

  const phone = requiredString(value.phone, "Phone number", 20);
  const normalizedPhone = phone.replace(/\D/g, "");
  if (normalizedPhone.length < 10) {
    throw new OrderValidationError("Invalid phone number.");
  }

  const firstName = requiredString(value.firstName, "First name", 100);
  const lastName = requiredString(value.lastName, "Last name", 100);
  const address = requiredString(value.address, "Address", 255);
  const city = requiredString(value.city, "City", 100);
  const state = requiredString(value.state, "State", 100);
  const postalCode = requiredString(value.postalCode, "Postal code", 20);

  if (
    typeof value.paymentMethod !== "string" ||
    !PAYMENT_METHODS.includes(value.paymentMethod as PaymentMethod)
  ) {
    throw new OrderValidationError("Invalid payment method.");
  }

  if (!Array.isArray(value.items) || value.items.length === 0) {
    throw new OrderValidationError("Your cart is empty.");
  }

  if (value.items.length > 50) {
    throw new OrderValidationError("Too many items in one order.");
  }

  const items: OrderItemInput[] = value.items.map((item, index) => {
    if (!isRecord(item)) {
      throw new OrderValidationError(`Invalid item at position ${index + 1}.`);
    }

    if (
      typeof item.quantity !== "number" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0 ||
      item.quantity > 20
    ) {
      throw new OrderValidationError(`Invalid quantity for item ${index + 1}.`);
    }

    return {
      id: requiredString(item.id, `Product ID for item ${index + 1}`, 100),
      size: requiredString(item.size, `Size for item ${index + 1}`, 30),
      color: requiredString(item.color, `Color for item ${index + 1}`, 80),
      quantity: item.quantity,
    };
  });

  const apartment =
    typeof value.apartment === "string" && value.apartment.trim().length > 0
      ? requiredString(value.apartment, "Apartment", 100)
      : undefined;

  return {
    email,
    phone: normalizedPhone,
    firstName,
    lastName,
    address,
    apartment,
    city,
    state,
    postalCode,
    paymentMethod: value.paymentMethod as PaymentMethod,
    items,
  };
}
