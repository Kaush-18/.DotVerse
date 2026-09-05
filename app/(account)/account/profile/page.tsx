"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/auth";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as User | undefined;

  if (!user) return null;

  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: User }) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.updateUser({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phone,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any, {
      onSuccess: () => {
        setMessage("Profile updated successfully.");
      },

      onError: (ctx) => {
        setMessage(ctx.error.message || "Something went wrong.");
      },
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
            <label className="block text-sm text-gray-400 mb-1">First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" />
        </div>
        <div>
            <label className="block text-sm text-gray-400 mb-1">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" />
        </div>
        <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" />
        </div>
        <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={user.email} disabled className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-gray-400 cursor-not-allowed" />
        </div>
        {message && <p className="text-sm text-green-400">{message}</p>}
        <button type="submit" className="w-full rounded-lg bg-violet-600 p-3 text-white font-semibold">Update Profile</button>
      </form>
    </div>
  );
}
