"use client";

import { Check, LoaderCircle, UserRound } from "lucide-react";
import { useState } from "react";

import type { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as User | undefined;
  if (isPending || !user) return <div className="space-y-4" aria-busy="true" aria-label="Loading profile"><div className="h-8 w-40 animate-pulse rounded bg-white/10" /><div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" /></div>;
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
    if (!trimmedFirstName || !trimmedLastName) { setMessage("Please enter your first and last name."); return; }
    if (trimmedFirstName.length > 50 || trimmedLastName.length > 50) { setMessage("Names must be 50 characters or fewer."); return; }
    if (trimmedPhone && !phonePattern.test(trimmedPhone)) { setMessage("Please enter a valid phone number."); return; }
    setIsSaving(true);
    setMessage("");
    try {
      await authClient.updateUser({ name: `${trimmedFirstName} ${trimmedLastName}`, firstName: trimmedFirstName, lastName: trimmedLastName, phone: trimmedPhone } as Parameters<typeof authClient.updateUser>[0], {
        onSuccess: () => setMessage("Profile updated successfully."),
        onError: (context) => setMessage(context.error.message || "Unable to update your profile."),
      });
    } catch { setMessage("Unable to update your profile right now."); }
    finally { setIsSaving(false); }
  };

  return <div className="space-y-7"><header className="border-b border-white/10 pb-6"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">Your details</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Profile</h1><p className="mt-2 text-sm text-white/50">Keep your delivery and account details up to date.</p></header><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-300"><UserRound size={18} aria-hidden="true" /></span><div><p className="text-sm font-semibold text-white">Personal information</p><p className="text-xs text-white/45">Email is read-only. Password and provider settings stay with authentication.</p></div></div><form onSubmit={handleUpdate} className="space-y-5" noValidate><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="profile-first-name" className="mb-2 block text-xs font-medium text-white/70">First name</label><input id="profile-first-name" name="firstName" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} maxLength={50} required disabled={isSaving} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60" /></div><div><label htmlFor="profile-last-name" className="mb-2 block text-xs font-medium text-white/70">Last name</label><input id="profile-last-name" name="lastName" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} maxLength={50} required disabled={isSaving} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60" /></div></div><div><label htmlFor="profile-email" className="mb-2 block text-xs font-medium text-white/70">Email address</label><input id="profile-email" type="email" value={user.email} readOnly aria-readonly="true" className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white/55 outline-none" /></div><div><label htmlFor="profile-phone" className="mb-2 block text-xs font-medium text-white/70">Phone</label><input id="profile-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={20} disabled={isSaving} aria-describedby="profile-phone-help" className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60" /><p id="profile-phone-help" className="mt-2 text-xs text-white/35">Use 7–15 digits with an optional country code.</p></div>{message && <p role="status" aria-live="polite" className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs leading-5 ${message.includes("successfully") ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-red-400/20 bg-red-400/10 text-red-200"}`}>{message.includes("successfully") && <Check size={15} aria-hidden="true" />}{message}</p>}<button type="submit" disabled={isSaving} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{isSaving && <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />}{isSaving ? "Saving..." : "Save changes"}</button></form></div></div>;
}
