import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const money = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/account/orders");
  const orders = await prisma.order.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, include: { items: true } });

  return <div className="space-y-7"><header className="border-b border-white/10 pb-6"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">Your history</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Orders</h1><p className="mt-2 text-sm text-white/50">A record of everything on its way to you.</p></header>{orders.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center"><PackageOpen size={28} className="mx-auto text-violet-300" /><h2 className="mt-5 text-xl font-semibold text-white">No orders yet.</h2><p className="mt-2 text-sm text-white/50">Your next favorite piece is waiting.</p><Link href="/shop" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500">Explore the collection <ArrowRight size={15} /></Link></div> : <div className="space-y-3">{orders.map((order) => <Link key={order.id} href={`/account/orders/${order.orderNumber}`} className="block rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-violet-400/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-white">{order.orderNumber}</p><p className="mt-1 text-xs text-white/45">{new Date(order.createdAt).toLocaleDateString()} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p></div><div className="text-right"><p className="text-base font-semibold text-white">{money(order.total)}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-violet-300">{order.status}</p></div></div><div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 pt-3 text-xs text-white/45"><span>Payment: {order.paymentStatus}</span><span>Method: {order.paymentMethod}</span><span className="text-violet-300">View details <ArrowRight size={12} className="ml-1 inline" /></span></div></Link>)}</div>}</div>;
}
