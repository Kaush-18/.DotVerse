import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/login?redirect=/account/orders/${orderNumber}`);
  }

  const order = await prisma.order.findUnique({
    where: { 
        orderNumber,
        userId: session.user.id 
    },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold mb-4">Order Details</h2>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Status: {order.status}</p>
            <p>Payment: {order.paymentStatus} ({order.paymentMethod})</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold mb-4">Shipping Information</h2>
            <p>{order.firstName} {order.lastName}</p>
            <p>{order.address}</p>
            {order.apartment && <p>{order.apartment}</p>}
            <p>{order.city}, {order.state} {order.postalCode}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-semibold mb-4">Items</h2>
        {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-400">{item.variantSize} / {item.variantColor}</p>
                </div>
                <p>{item.quantity} x ₹{item.price / 100}</p>
            </div>
        ))}
        <div className="mt-4 text-right font-bold text-lg">
            Total: ₹{order.total / 100}
        </div>
      </div>
    </div>
  );
}
