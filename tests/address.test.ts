import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { AddressValidationError, parseAddressInput } from "../lib/validation/address";

const valid = {
  label: "Home",
  firstName: "Asha",
  lastName: "Sharma",
  phone: "+91 9876543210",
  address: "12 Example Street",
  apartment: "Flat 4B",
  city: "New Delhi",
  state: "Delhi",
  postalCode: "110001",
};

describe("address validation", () => {
  it("trims and normalizes valid Indian address input", () => {
    const parsed = parseAddressInput({ ...valid, label: " Home ", isDefault: true });
    assert.equal(parsed.label, "Home");
    assert.equal(parsed.phone, "919876543210");
    assert.equal(parsed.isDefault, true);
  });

  it("rejects invalid phone and postal code", () => {
    assert.throws(() => parseAddressInput({ ...valid, phone: "12345" }), AddressValidationError);
    assert.throws(() => parseAddressInput({ ...valid, postalCode: "11000" }), AddressValidationError);
  });

  it("rejects missing and overlong required fields", () => {
    assert.throws(() => parseAddressInput({ ...valid, city: "" }), AddressValidationError);
    assert.throws(() => parseAddressInput({ ...valid, label: "x".repeat(31) }), AddressValidationError);
  });

  it("rejects malformed request bodies safely", () => {
    assert.throws(() => parseAddressInput(null), AddressValidationError);
    assert.throws(() => parseAddressInput([]), AddressValidationError);
  });

  it("does not accept a client ownership field", () => {
    const parsed = parseAddressInput({ ...valid, userId: "another-user" });
    assert.equal("userId" in parsed, false);
  });
});
