import { Check, Circle, Package, Truck, X } from "lucide-react";

type OrderTimelineProps = {
  status: string;
  createdAt: Date | string;
  cancelledAt?: Date | string | null;
};

const steps = [
  { key: "PENDING", label: "Order received", description: "Your order is being confirmed.", icon: Circle },
  { key: "CONFIRMED", label: "Confirmed", description: "Your order has been confirmed.", icon: Check },
  { key: "PROCESSING", label: "Processing", description: "Your order is being prepared.", icon: Package },
  { key: "SHIPPED", label: "Shipped", description: "Your order is on its way.", icon: Truck },
  { key: "DELIVERED", label: "Delivered", description: "Your order has been delivered.", icon: Check },
];

const statusIndex: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
};

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrderTimeline({ status, createdAt, cancelledAt }: OrderTimelineProps) {
  if (status === "CANCELLED") {
    return (
      <section aria-label="Order timeline" className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-300/40 bg-red-400/10 text-red-200"><X size={18} aria-hidden="true" /></span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-100">Cancelled</p>
            <p className="mt-2 text-sm leading-6 text-red-100/65">This order was cancelled and will not be fulfilled.</p>
            <p className="mt-2 text-xs text-red-100/45">{cancelledAt ? `Cancelled ${formatDate(cancelledAt)}` : "Cancellation date unavailable"}</p>
          </div>
        </div>
      </section>
    );
  }

  const currentIndex = statusIndex[status] ?? 0;
  return (
    <section aria-label="Order timeline" className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-violet-300/80">Journey</p><h2 className="mt-2 text-lg font-semibold text-white">Order progress</h2></div><p className="text-right text-xs text-white/45">Placed {formatDate(createdAt)}</p></div>
      <ol className="grid gap-5 md:grid-cols-5 md:gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const completed = index <= currentIndex;
          const current = index === currentIndex;
          return (
            <li key={step.key} className="relative flex gap-3 md:block md:text-center">
              {index < steps.length - 1 && <span aria-hidden="true" className={`absolute left-[21px] top-11 h-[calc(100%+1.25rem)] w-px md:left-1/2 md:top-[22px] md:h-px md:w-full ${index < currentIndex ? "bg-violet-400/70" : "bg-white/10"}`} />}
              <span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border md:mx-auto ${completed ? "border-violet-400/50 bg-violet-500/15 text-violet-200" : "border-white/10 bg-white/[0.04] text-white/25"} ${current ? "shadow-[0_0_28px_rgba(139,92,246,0.28)]" : ""}`}><Icon size={17} aria-hidden="true" /></span>
              <div className="relative z-10 pt-1 md:pt-4"><p className={`text-sm font-semibold ${completed ? "text-white" : "text-white/30"}`}>{step.label}</p><p className="mt-1 max-w-[180px] text-xs leading-5 text-white/40 md:mx-auto">{step.description}</p></div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
