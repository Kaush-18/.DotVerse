"use client";

import { ArrowUpRight, Check, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import AddressForm, { type AddressRecord } from "@/components/account/AddressForm";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<AddressRecord | null | undefined>(undefined);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/account/addresses", { cache: "no-store" });
      const data = await response.json() as {
        success?: boolean;
        message?: string;
        addresses?: AddressRecord[];
      };
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load addresses.");
      }
      setAddresses(data.addresses || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load addresses.");
    } finally {
      setLoading(false);
    }
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
    const response = await fetch(`/api/account/addresses/${address.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...address, isDefault: true }),
    });
    if (response.ok) await load();
    else setError("Unable to set the default address.");
  }

  if (editing !== undefined) {
    return (
      <div className="dot-address-book dot-address-edit-view">
        <button type="button" className="dot-address-back" onClick={() => setEditing(undefined)}>
          <ArrowUpRight size={14} aria-hidden="true" />
          Back to address book
        </button>
        <header className="dot-address-header">
          <div>
            <p className="dot-address-kicker">.DOT / ADDRESS BOOK</p>
            <h1>{editing ? "EDIT" : "ADD"}<br /><em>ADDRESS.</em></h1>
            <p className="dot-address-intro">Keep a delivery destination ready for the next piece.</p>
          </div>
          <div className="dot-address-record" aria-hidden="true"><span>PRIVATE UTILITY</span><strong>{editing ? "02" : "01"}</strong><span>ADDRESS</span></div>
        </header>
        <section className="dot-address-form-shell" aria-labelledby="address-form-heading">
          <div className="dot-address-section-label"><span>01</span><span id="address-form-heading">Delivery details</span></div>
          <AddressForm
            address={editing || undefined}
            onSaved={() => { setEditing(undefined); void load(); }}
            onCancel={() => setEditing(undefined)}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="dot-address-book">
      <header className="dot-address-header">
        <div>
          <p className="dot-address-kicker">.DOT / ADDRESS BOOK</p>
          <h1>ADDRESS<br /><em>BOOK.</em></h1>
          <p className="dot-address-intro">Your delivery destinations, kept close.</p>
        </div>
        <div className="dot-address-record" aria-hidden="true">
          <span>PRIVATE UTILITY</span>
          <strong>{String(addresses.length).padStart(2, "0")}</strong>
          <span>{addresses.length === 1 ? "ADDRESS" : "ADDRESSES"}</span>
        </div>
      </header>

      <section className="dot-address-list-section" aria-labelledby="saved-addresses-heading">
        <div className="dot-address-list-heading">
          <div className="dot-address-section-label">
            <span>01</span>
            <span id="saved-addresses-heading">Saved destinations</span>
          </div>
          <button type="button" className="dot-address-add-link" onClick={() => setEditing(null)}>
            <Plus size={15} aria-hidden="true" /> Add new address
          </button>
        </div>

        {error && (
          <div className="dot-address-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => void load()}>Try again</button>
          </div>
        )}

        {loading ? (
          <div className="dot-address-grid" aria-busy="true" aria-label="Loading saved addresses">
            <div className="dot-address-skeleton" />
            <div className="dot-address-skeleton" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="dot-address-empty">
            <MapPin size={20} aria-hidden="true" />
            <p className="dot-address-kicker">Address book</p>
            <h2>NO SAVED ADDRESSES</h2>
            <p>Add your delivery address to make checkout faster.</p>
            <button type="button" className="dot-address-primary" onClick={() => setEditing(null)}>
              <Plus size={15} aria-hidden="true" /> Add address
            </button>
          </div>
        ) : (
          <div className="dot-address-grid">
            {addresses.map((address, index) => (
              <article key={address.id} className="dot-address-card" style={{ "--address-index": index } as React.CSSProperties}>
                <div className="dot-address-card-top">
                  <div>
                    <p className="dot-address-card-index">0{index + 1}</p>
                    <h2>{address.label}</h2>
                  </div>
                  {address.isDefault && (
                    <span className="dot-address-default"><Star size={12} aria-hidden="true" /> Default</span>
                  )}
                </div>
                <div className="dot-address-card-body">
                  <p className="dot-address-recipient">{address.firstName} {address.lastName}</p>
                  <p className="dot-address-phone">{address.phone}</p>
                  <address>
                    {address.address}
                    {address.apartment && <><br />{address.apartment}</>}
                    <br />{address.city}, {address.state} {address.postalCode}
                  </address>
                </div>
                <div className="dot-address-card-actions">
                  <button type="button" onClick={() => setEditing(address)}><Pencil size={14} aria-hidden="true" /> Edit</button>
                  {!address.isDefault && <button type="button" onClick={() => void makeDefault(address)}><Check size={14} aria-hidden="true" /> Set default</button>}
                  <button type="button" className="dot-address-delete" onClick={() => void remove(address)}><Trash2 size={14} aria-hidden="true" /> Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
