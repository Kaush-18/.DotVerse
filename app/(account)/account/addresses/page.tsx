"use client";

import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import AddressForm, { type AddressRecord } from "@/components/account/AddressForm";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<AddressRecord | null | undefined>(undefined);

  async function load() {
    try {
      const response = await fetch("/api/account/addresses", { cache: "no-store" });
      const data = await response.json() as { success?: boolean; message?: string; addresses?: AddressRecord[] };
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load addresses.");
      setAddresses(data.addresses || []);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load addresses."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    // Fetch the authenticated user's addresses after the initial client render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function remove(address: AddressRecord) {
    if (!window.confirm(`Delete ${address.label}?`)) return;
    const response = await fetch(`/api/account/addresses/${address.id}`, { method: "DELETE" });
    if (response.ok) await load();
    else setError("Unable to delete this address.");
  }

  async function makeDefault(address: AddressRecord) {
    const response = await fetch(`/api/account/addresses/${address.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...address, isDefault: true }) });
    if (response.ok) await load();
    else setError("Unable to set the default address.");
  }

  if (editing !== undefined) return <div className="space-y-7"><header className="border-b border-white/10 pb-6"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">Your details</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{editing ? "Edit address" : "Add address"}</h1></header><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7"><AddressForm address={editing || undefined} onSaved={() => { setEditing(undefined); void load(); }} onCancel={() => setEditing(undefined)} /></div></div>;

  return <div className="space-y-7"><header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">Delivery details</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Saved addresses</h1><p className="mt-2 text-sm text-white/50">Save up to 5 addresses and reuse them at checkout.</p></div><button type="button" onClick={() => setEditing(null)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500"><Plus size={16} aria-hidden="true" /> Add new address</button></header>{error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-200">{error}</p>}{loading ? <div className="grid gap-4 sm:grid-cols-2" aria-busy="true"><div className="h-52 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="h-52 animate-pulse rounded-2xl bg-white/[0.04]" /></div> : addresses.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center"><MapPin size={28} className="mx-auto text-violet-300" /><h2 className="mt-5 text-xl font-semibold text-white">No saved addresses yet.</h2><p className="mt-2 text-sm text-white/50">Add your first address for a faster checkout.</p><button type="button" onClick={() => setEditing(null)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white">Add your first address <Plus size={15} /></button></div> : <div className="grid gap-4 sm:grid-cols-2">{addresses.map((address) => <article key={address.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-white">{address.label}</p>{address.isDefault && <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-violet-400/25 bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-wider text-violet-200"><Star size={11} /> Default</span>}</div><MapPin size={18} className="text-violet-300" aria-hidden="true" /></div><div className="mt-5 space-y-1 text-sm leading-6 text-white/65"><p className="font-medium text-white">{address.firstName} {address.lastName}</p><p>{address.address}</p>{address.apartment && <p>{address.apartment}</p>}<p>{address.city}, {address.state} {address.postalCode}</p><p>{address.phone}</p></div><div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4"><button type="button" onClick={() => setEditing(address)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-3 text-xs text-white/75 hover:text-white"><Pencil size={14} /> Edit</button>{!address.isDefault && <button type="button" onClick={() => void makeDefault(address)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-violet-400/25 px-3 text-xs text-violet-200 hover:bg-violet-500/10"><Star size={14} /> Set default</button>}<button type="button" onClick={() => void remove(address)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-300/25 px-3 text-xs text-red-200 hover:bg-red-400/10"><Trash2 size={14} /> Delete</button></div></article>)}</div>}</div>;
}
