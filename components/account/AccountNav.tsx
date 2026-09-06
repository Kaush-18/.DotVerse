"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, LogOut, Package, User as UserIcon } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/account", icon: CircleUser },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Profile", href: "/account/profile", icon: UserIcon },
];

export default function AccountNav({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Account navigation" className="rounded-3xl border border-white/10 bg-[#07040d] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
      <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 ${active ? "bg-violet-500/15 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={17} className={active ? "text-violet-300" : "text-white/40"} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-3 border-t border-white/10 pt-3 md:mt-4 md:pt-4">
        <form action={onSignOut}>
          <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-300/80 transition hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60">
            <LogOut size={17} />
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
