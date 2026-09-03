"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?redirect=/account");
    }
  }, [session, isPending, router]);

  if (isPending) return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white">Welcome, {session.user.name}</h1>
      <div className="mt-8 flex gap-4">
        <Link href="/account/profile" className="rounded-lg bg-white/5 p-4 text-white">Profile</Link>
        <Link href="/account/orders" className="rounded-lg bg-white/5 p-4 text-white">Orders</Link>
        <button onClick={async () => { await authClient.signOut(); router.push("/"); }} className="rounded-lg bg-red-900/50 p-4 text-white">Sign Out</button>
      </div>
    </div>
  );
}
