import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Package, UserRound } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const money = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

export default async function AccountDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, orderNumber: true, createdAt: true, status: true, total: true, items: { select: { quantity: true } } },
  });
  const firstName = session.user.name?.split(" ")[0] || "there";
  const totalOrders = await prisma.order.count({ where: { userId: session.user.id } });
  const latest = orders[0];

  return (
    <div className="space-y-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">Your space</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome back, {firstName}.</h1>
        <p className="mt-2 text-sm text-white/50">Your DotVerse essentials, all in one place.</p>
      </header>

      <section aria-label="Account overview" className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><Package size={18} className="text-violet-300" /><p className="mt-5 text-xs text-white/45">Total orders</p><p className="mt-1 text-2xl font-semibold text-white">{totalOrders}</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><Clock3 size={18} className="text-violet-300" /><p className="mt-5 text-xs text-white/45">Latest order</p><p className="mt-1 truncate text-lg font-semibold text-white">{latest?.orderNumber || "No orders yet"}</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><CheckCircle2 size={18} className="text-violet-300" /><p className="mt-5 text-xs text-white/45">Account status</p><p className="mt-1 text-lg font-semibold text-emerald-300">Active</p></div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4"><h2 className="text-lg font-semibold text-white">Recent orders</h2><Link href="/account/orders" className="text-xs font-medium text-violet-300 transition hover:text-violet-200">View all</Link></div>
        {orders.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center"><p className="text-lg font-medium text-white">No orders yet.</p><p className="mt-2 text-sm text-white/50">Your next favorite piece is waiting.</p><Link href="/shop" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500">Explore the collection <ArrowRight size={15} /></Link></div> : <div className="space-y-3">{orders.map((order) => <Link key={order.id} href={`/account/orders/${order.orderNumber}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-violet-400/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{order.orderNumber}</p><p className="mt-1 text-xs text-white/45">{new Date(order.createdAt).toLocaleDateString()} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p></div><div className="text-right"><p className="text-sm font-semibold text-white">{money(order.total)}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-violet-300">{order.status}</p></div></Link>)}</div>}
      </section>

      <section><h2 className="mb-4 text-lg font-semibold text-white">Quick actions</h2><div className="grid gap-3 sm:grid-cols-3"><Link href="/account/orders" className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-violet-400/30 hover:bg-white/[0.06]"><Package size={18} className="text-violet-300" /><p className="mt-4 text-sm font-medium text-white">View orders</p><p className="mt-1 text-xs text-white/45">Track every delivery</p></Link><Link href="/account/profile" className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-violet-400/30 hover:bg-white/[0.06]"><UserRound size={18} className="text-violet-300" /><p className="mt-4 text-sm font-medium text-white">Edit profile</p><p className="mt-1 text-xs text-white/45">Keep your details current</p></Link><Link href="/shop" className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-violet-400/30 hover:bg-white/[0.06]"><ArrowRight size={18} className="text-violet-300" /><p className="mt-4 text-sm font-medium text-white">Continue shopping</p><p className="mt-1 text-xs text-white/45">Find your next essential</p></Link></div></section>
    </div>
  );
}
