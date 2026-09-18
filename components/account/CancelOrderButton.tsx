"use client";

import { LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelOrderButton({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setIsCancelling(true);
    setError("");
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}/cancel`, { method: "POST" });
      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !data.success) {
        setError(data.message || "This order could not be cancelled.");
        return;
      }
      router.refresh();
    } catch {
      setError("We could not cancel this order right now. Please try again.");
    } finally {
      setIsCancelling(false);
      setIsConfirming(false);
    }
  }

  if (isConfirming) {
    return (
      <div className="rounded-2xl border border-red-400/25 bg-red-400/[0.06] p-4" role="alertdialog" aria-label="Confirm order cancellation">
        <div className="flex items-start gap-3"><X size={18} className="mt-0.5 shrink-0 text-red-200" aria-hidden="true" /><div className="min-w-0"><p className="text-sm font-semibold text-red-100">Cancel this order?</p><p className="mt-1 text-xs leading-5 text-red-100/65">Cancellation cannot be undone. Any eligible inventory hold will be released by the server.</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={handleCancel} disabled={isCancelling} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-500/85 px-4 text-xs font-semibold text-white transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-60">{isCancelling && <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />}{isCancelling ? "Cancelling..." : "Yes, cancel order"}</button><button type="button" onClick={() => setIsConfirming(false)} disabled={isCancelling} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-4 text-xs font-semibold text-white/75 transition hover:text-white disabled:opacity-60">Keep order</button></div></div></div>
      </div>
    );
  }

  return <div className="flex flex-col items-stretch gap-3 sm:items-end"><button type="button" onClick={() => { setError(""); setIsConfirming(true); }} className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-300/30 px-4 text-xs font-semibold text-red-200 transition hover:border-red-300/60 hover:bg-red-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/70">Cancel order</button>{error && <p role="alert" className="max-w-xs text-right text-xs leading-5 text-red-200">{error}</p>}</div>;
}
