"use client";

import { useState } from "react";
import { Check, LoaderCircle, UserRound } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/auth";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as User | undefined;
  if (isPending || !user) return <div className="space-y-4" aria-busy="true"><div className="h-8 w-40 animate-pulse rounded bg-white/10" /><div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" /></div>;
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
    if (!firstName.trim() || !lastName.trim()) { setMessage("Please enter your first and last name."); return; }
    setIsSaving(true); setMessage("");
    try {
      await authClient.updateUser({ name: `${firstName.trim()} ${lastName.trim()}`, firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() } as Parameters<typeof authClient.updateUser>[0], { onSuccess: () => setMessage("Profile updated successfully."), onError: (ctx) => setMessage(ctx.error.message || "Unable to update your profile.") });
    } catch { setMessage("Unable to update your profile right now."); }
    finally { setIsSaving(false); }
  };

  return <div className="space-y-7"><header className="border-b border-white/10 pb-6"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">Your details</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Profile</h1><p className="mt-2 text-sm text-white/50">Keep your delivery and account details up to date.</p></header><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 text-violet-300"><UserRound size={18} /></span><div><p className="text-sm font-semibold text-white">Personal information</p><p className="text-xs text-white/45">Email changes require verification and are not available here.</p></div></div><form onSubmit={handleUpdate} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="profile-first-name" className="mb-2 block text-xs font-medium text-white/70">First name</label><input id="profile-first-name" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" required /></div><div><label htmlFor="profile-last-name" className="mb-2 block text-xs font-medium text-white/70">Last name</label><input id="profile-last-name" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" required /></div></div><div><label htmlFor="profile-phone" className="mb-2 block text-xs font-medium text-white/70">Phone</label><input id="profile-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" /></div><div><label htmlFor="profile-email" className="mb-2 block text-xs font-medium text-white/70">Email</label><input id="profile-email" type="email" value={user.email} readOnly aria-describedby="email-note" className="min-h-12 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white/45 outline-none" /><p id="email-note" className="mt-2 text-xs text-white/35">This email is managed by your authentication provider.</p></div>{message && <p role="status" aria-live="polite" className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${message.includes("successfully") ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-red-400/20 bg-red-400/10 text-red-200"}`}>{message.includes("successfully") && <Check size={14} />}{message}</p>}<button type="submit" disabled={isSaving} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80 disabled:cursor-not-allowed disabled:opacity-60">{isSaving && <LoaderCircle size={16} className="animate-spin" />}{isSaving ? "Saving…" : "Save changes"}</button></form></div></div>;
}
