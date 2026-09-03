import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?redirect=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white">
        <h2 className="text-xl font-bold">No orders yet</h2>
        <p className="mt-2 text-gray-400">Explore our collection to find your next favorite piece.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white">Explore Shop</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Your Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">{order.orderNumber}</p>
            <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="font-semibold mt-1">{order.status} • {order.paymentStatus}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">₹{order.total / 100}</p>
            <Link href={`/account/orders/${order.orderNumber}`} className="mt-2 inline-block text-violet-400 hover:text-violet-300">View Order →</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
