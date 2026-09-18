import Link from "next/link";
import { ArrowLeft, MapPin, Package, ReceiptText } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import CancelOrderButton from "@/components/account/CancelOrderButton";
import OrderTimeline from "@/components/account/OrderTimeline";
import { isOrderOwnedByUser } from "@/lib/account-authorization";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { headers } from "next/headers";

const money = formatPrice;

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/login?redirect=/account/orders/${encodeURIComponent(orderNumber)}`);

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      createdAt: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      subtotal: true,
      shipping: true,
      total: true,
      firstName: true,
      lastName: true,
      address: true,
      apartment: true,
      city: true,
      state: true,
      postalCode: true,
      phone: true,
      email: true,
      cancelledAt: true,
      userId: true,
      items: { select: { id: true, productName: true, variantSize: true, variantColor: true, price: true, quantity: true } },
    },
  });

  if (!order || !isOrderOwnedByUser(order.userId, session.user.id)) notFound();

  const canCancel = order.paymentStatus !== "PAID" && ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status);

  return (
    <div className="space-y-7 text-white">
      <Link href="/account/orders" className="inline-flex min-h-11 items-center gap-2 text-xs text-white/50 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"><ArrowLeft size={14} aria-hidden="true" /> Back to orders</Link>
      <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">Order details</p><h1 className="mt-3 break-all text-2xl font-semibold tracking-tight sm:text-3xl">{order.orderNumber}</h1><p className="mt-2 text-sm text-white/50">Placed {new Date(order.createdAt).toLocaleDateString("en-IN")}</p></div>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end"><div className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-violet-200">{order.status}</div>{canCancel && <CancelOrderButton orderNumber={order.orderNumber} />}</div>
      </header>
      <OrderTimeline status={order.status} createdAt={order.createdAt} cancelledAt={order.cancelledAt} />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><div className="flex items-center gap-2 text-sm font-semibold"><ReceiptText size={17} className="text-violet-300" aria-hidden="true" /> Summary</div><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4 text-white/55"><dt>Payment</dt><dd className="text-right text-white">{order.paymentStatus} · {order.paymentMethod}</dd></div><div className="flex justify-between gap-4 text-white/55"><dt>Subtotal</dt><dd className="text-white">{money(order.subtotal)}</dd></div><div className="flex justify-between gap-4 text-white/55"><dt>Shipping</dt><dd className="text-white">{order.shipping ? money(order.shipping) : "Free"}</dd></div><div className="flex justify-between gap-4 border-t border-white/10 pt-3 font-semibold"><dt>Total</dt><dd>{money(order.total)}</dd></div></dl></section>
        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><div className="flex items-center gap-2 text-sm font-semibold"><MapPin size={17} className="text-violet-300" aria-hidden="true" /> Shipping to</div><div className="mt-5 space-y-1 text-sm leading-6 text-white/65"><p className="font-medium text-white">{order.firstName} {order.lastName}</p><p>{order.address}</p>{order.apartment && <p>{order.apartment}</p>}<p>{order.city}, {order.state} {order.postalCode}</p><p className="pt-2 text-xs text-white/45">{order.email} · {order.phone}</p></div></section>
      </div>
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><div className="flex items-center gap-2 text-sm font-semibold"><Package size={17} className="text-violet-300" aria-hidden="true" /> Items <span className="text-xs font-normal text-white/40">({order.items.length})</span></div><div className="mt-5 divide-y divide-white/10">{order.items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div className="min-w-0"><p className="text-sm font-medium text-white">{item.productName}</p><p className="mt-1 text-xs text-white/45">{item.variantColor} / {item.variantSize} · Qty {item.quantity}</p></div><p className="text-sm font-medium text-white">{money(item.price * item.quantity)}</p></div>)}</div></section>
    </div>
  );
}
