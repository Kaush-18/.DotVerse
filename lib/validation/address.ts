export type AddressInput = {
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
};

export class AddressValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AddressValidationError";
  }
}

function requiredString(value: unknown, name: string, maxLength: number) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AddressValidationError(`${name} is required.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new AddressValidationError(`${name} is too long.`);
  }
  return trimmed;
}

export function parseAddressInput(value: unknown): AddressInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AddressValidationError("Invalid address data.");
  }

  const input = value as Record<string, unknown>;
  const phone = requiredString(input.phone, "Phone number", 20);
  if (!/^(?:\+?91)?[6-9]\d{9}$/.test(phone.replace(/[\s().-]/g, ""))) {
    throw new AddressValidationError("Enter a valid Indian phone number.");
  }

  const postalCode = requiredString(input.postalCode, "Postal code", 6);
  if (!/^\d{6}$/.test(postalCode)) {
    throw new AddressValidationError("Enter a valid 6-digit postal code.");
  }

  return {
    label: requiredString(input.label, "Address label", 30),
    firstName: requiredString(input.firstName, "First name", 50),
    lastName: requiredString(input.lastName, "Last name", 50),
    phone: phone.replace(/\D/g, ""),
    address: requiredString(input.address, "Address", 200),
    apartment: typeof input.apartment === "string" && input.apartment.trim()
      ? requiredString(input.apartment, "Apartment", 100)
      : undefined,
    city: requiredString(input.city, "City", 100),
    state: requiredString(input.state, "State", 100),
    postalCode,
    isDefault: input.isDefault === true,
  };
}
