import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";


function OrderSuccessFallback() {
  return (
    <main className="min-h-screen bg-[#07040d] px-6 py-24 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="h-20 w-20 animate-pulse rounded-full border border-violet-500/40 bg-violet-500/10" />


        <div className="mt-8 h-12 w-80 animate-pulse rounded-lg bg-white/5" />


        <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-white/5" />
      </div>
    </main>
  );
}


export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
