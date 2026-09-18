"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export type AddressRecord = {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
};

type Props = {
  address?: AddressRecord;
  onSaved: (address: AddressRecord) => void;
  onCancel: () => void;
};

type AddressDraft = Record<string, string>;

const fields = [
  ["label", "Address label", "Home"],
  ["firstName", "First name", "Alex"],
  ["lastName", "Last name", "Morgan"],
  ["phone", "Phone", "+91 9876543210"],
  ["address", "Address", "Street and house number"],
  ["apartment", "Apartment / Suite", "Optional"],
  ["city", "City", "New Delhi"],
  ["state", "State", "Delhi"],
  ["postalCode", "Postal code", "110001"],
] as const;

export default function AddressForm({ address, onSaved, onCancel }: Props) {
  const [values, setValues] = useState<AddressDraft>({
    label: address?.label || "",
    firstName: address?.firstName || "",
    lastName: address?.lastName || "",
    phone: address?.phone || "",
    address: address?.address || "",
    apartment: address?.apartment || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
  });
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const response = await fetch(address ? `/api/account/addresses/${address.id}` : "/api/account/addresses", {
        method: address ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, isDefault }),
      });
      const data = await response.json() as { success?: boolean; message?: string; address?: AddressRecord };
      if (!response.ok || !data.success || !data.address) throw new Error(data.message || "Unable to save address.");
      onSaved(data.address);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save address.");
    } finally { setSaving(false); }
  }

  return <form onSubmit={submit} className="space-y-5" noValidate>
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([name, label, placeholder]) => <div key={name} className={name === "address" || name === "apartment" ? "sm:col-span-2" : ""}><label htmlFor={`address-${name}`} className="mb-2 block text-xs font-medium text-white/70">{label}{name === "apartment" ? " (optional)" : ""}</label><input id={`address-${name}`} name={name} value={values[name] || ""} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))} placeholder={placeholder} required={name !== "apartment"} inputMode={name === "phone" || name === "postalCode" ? "tel" : undefined} maxLength={name === "label" ? 30 : name === "postalCode" ? 6 : undefined} disabled={saving} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60" /></div>)}
    </div>
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-white/70"><input type="checkbox" checked={isDefault} onChange={(event) => setIsDefault(event.target.checked)} disabled={saving} className="h-4 w-4 accent-violet-500" /> Set as default address</label>
    {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-200">{error}</p>}
    <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60">{saving && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}{saving ? "Saving..." : address ? "Save changes" : "Add address"}</button><button type="button" onClick={onCancel} disabled={saving} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm text-white/70 transition hover:text-white disabled:opacity-60">Cancel</button></div>
  </form>;
}
