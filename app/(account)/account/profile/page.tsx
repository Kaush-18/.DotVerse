"use client";

import { Check, LoaderCircle, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";

import type { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as User | undefined;

  if (isPending) {
    return (
      <div className="dot-profile-page dot-profile-loading" aria-busy="true" aria-label="Loading profile">
        <div className="dot-profile-skeleton dot-profile-skeleton-kicker" />
        <div className="dot-profile-skeleton dot-profile-skeleton-heading" />
        <div className="dot-profile-skeleton dot-profile-skeleton-panel" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dot-profile-page dot-profile-unavailable" role="alert">
        <p className="dot-profile-kicker">.DOT / IDENTITY</p>
        <h1>PROFILE<br /><em>UNAVAILABLE.</em></h1>
        <p>Unable to load your profile right now.</p>
        <button type="button" className="dot-profile-primary" onClick={() => window.location.reload()}>
          <RefreshCw size={15} aria-hidden="true" /> Retry
        </button>
      </div>
    );
  }

  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: User }) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedFirstName || !trimmedLastName) {
      setMessage("Please enter your first and last name.");
      return;
    }
    if (trimmedFirstName.length > 50 || trimmedLastName.length > 50) {
      setMessage("Names must be 50 characters or fewer.");
      return;
    }
    if (trimmedPhone && !phonePattern.test(trimmedPhone)) {
      setMessage("Please enter a valid phone number.");
      return;
    }
    setIsSaving(true);
    setMessage("");
    try {
      await authClient.updateUser(
        {
          name: `${trimmedFirstName} ${trimmedLastName}`,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          phone: trimmedPhone,
        } as Parameters<typeof authClient.updateUser>[0],
        {
          onSuccess: () => setMessage("Profile updated successfully."),
          onError: (context) => setMessage(context.error.message || "Unable to update your profile."),
        },
      );
    } catch {
      setMessage("Unable to update your profile right now.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dot-profile-page">
      <header className="dot-profile-header">
        <div>
          <p className="dot-profile-kicker">.DOT / IDENTITY</p>
          <h1>YOUR<br /><em>PROFILE.</em></h1>
          <p className="dot-profile-intro">The details that define your .DOT space.</p>
        </div>
        <div className="dot-profile-record" aria-hidden="true">
          <span>PRIVATE IDENTITY</span>
          <strong>01</strong>
          <span>PROFILE</span>
        </div>
      </header>

      <div className="dot-profile-layout">
        <section className="dot-profile-identity" aria-labelledby="profile-identity-heading">
          <div className="dot-profile-section-label"><span>01</span><span>Identity</span></div>
          <div className="dot-profile-identity-panel">
            <span className="dot-profile-avatar" aria-hidden="true">
              {(user.name || user.email).slice(0, 1).toUpperCase()}
            </span>
            <div>
              <h2 id="profile-identity-heading">{user.name || "Your identity"}</h2>
              <p><Mail size={14} aria-hidden="true" />{user.email}</p>
              <span className="dot-profile-identity-note">Email is managed by your authentication provider.</span>
            </div>
          </div>
        </section>

        <section className="dot-profile-details" aria-labelledby="profile-details-heading">
          <div className="dot-profile-section-label"><span>02</span><span id="profile-details-heading">Profile details</span></div>
          <form onSubmit={handleUpdate} className="dot-profile-form" noValidate>
            <div className="dot-profile-fields">
              <div className="dot-profile-field">
                <label htmlFor="profile-first-name">First name</label>
                <input id="profile-first-name" name="firstName" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} maxLength={50} required disabled={isSaving} />
              </div>
              <div className="dot-profile-field">
                <label htmlFor="profile-last-name">Last name</label>
                <input id="profile-last-name" name="lastName" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} maxLength={50} required disabled={isSaving} />
              </div>
              <div className="dot-profile-field dot-profile-field-wide">
                <label htmlFor="profile-email">Email address</label>
                <input id="profile-email" name="email" type="email" value={user.email} readOnly disabled={isSaving} aria-describedby="profile-email-note" />
                <span id="profile-email-note">Read-only account identifier.</span>
              </div>
              <div className="dot-profile-field dot-profile-field-wide">
                <label htmlFor="profile-phone">Phone number <span>(optional)</span></label>
                <input id="profile-phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={20} disabled={isSaving} />
              </div>
            </div>

            {message && (
              <p className={`dot-profile-message ${message === "Profile updated successfully." ? "is-success" : "is-error"}`} role={message === "Profile updated successfully." ? "status" : "alert"} aria-live="polite">
                {message === "Profile updated successfully." && <Check size={15} aria-hidden="true" />}
                {message}
              </p>
            )}

            <div className="dot-profile-form-actions">
              <button type="submit" className="dot-profile-primary" disabled={isSaving}>
                {isSaving && <LoaderCircle size={15} className="dot-profile-spinner" aria-hidden="true" />}
                {isSaving ? "Saving..." : "Save changes"}
              </button>
              <span className="dot-profile-form-note">Only your name and phone can be edited here.</span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
