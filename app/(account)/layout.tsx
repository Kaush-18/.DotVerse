import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CircleUser, Package, User as UserIcon, LogOut } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const session = await auth.api.getSession({
    headers: h,
  });

  if (!session) {
    redirect("/login?redirect=/account");
  }

  const navItems = [
    { label: "Dashboard", href: "/account", icon: CircleUser },
    { label: "Orders", href: "/account/orders", icon: Package },
    { label: "Profile", href: "/account/profile", icon: UserIcon },
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="rounded-3xl border border-white/10 bg-[#07040d] p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl p-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-white/5">
                <form action={async () => {
                  "use server";
                  await auth.api.signOut({
                    headers: await headers(),
                  });
                  redirect("/");
                }}>
                    <button type="submit" className="flex w-full items-center gap-3 rounded-xl p-3 text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </form>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="md:col-span-3 rounded-3xl border border-white/10 bg-[#07040d] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
