"use client";

import { MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";

type Address = {
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

type Props = { onSelect: (address: Address) => void };

export default function SavedAddresses({ onSelect }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/account/addresses", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ success?: boolean; addresses?: Address[] }> : null)
      .then((data) => { if (active && data?.success) setAddresses(data.addresses || []); })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading || addresses.length === 0) return null;

  return <section className="mb-8 rounded-2xl border border-violet-400/20 bg-violet-500/[0.06] p-5" aria-label="Saved addresses"><div className="flex items-center gap-2"><MapPin size={17} className="text-violet-300" aria-hidden="true" /><h2 className="text-sm font-bold uppercase tracking-widest text-violet-300">Saved Addresses</h2></div><p className="mt-2 text-xs text-white/45">Select an address to fill your delivery details. You can still edit the fields below.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{addresses.map((address) => <button key={address.id} type="button" onClick={() => onSelect(address)} className="min-h-11 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-violet-400/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"><span className="flex items-center justify-between gap-3 text-sm font-semibold text-white"><span>{address.label}</span>{address.isDefault && <Star size={14} className="text-violet-300" aria-label="Default address" />}</span><span className="mt-2 block text-xs leading-5 text-white/55">{address.address}{address.apartment ? `, ${address.apartment}` : ""}<br />{address.city}, {address.state} {address.postalCode}</span></button>)}</div></section>;
}
