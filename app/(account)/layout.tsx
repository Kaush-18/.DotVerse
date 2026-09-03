import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?redirect=/account");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="md:col-span-1">
          <ul className="space-y-2">
            <li><Link href="/account" className="block p-2 text-white hover:text-gray-300">Dashboard</Link></li>
            <li><Link href="/account/orders" className="block p-2 text-white hover:text-gray-300">Orders</Link></li>
            <li><Link href="/account/profile" className="block p-2 text-white hover:text-gray-300">Profile</Link></li>
          </ul>
        </nav>
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
