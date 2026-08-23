import { Suspense } from "react";
import TrackOrderContent from "./TrackOrderContent";

function TrackOrderFallback() {
  return (
    <main className="min-h-screen bg-[#05020c] px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto h-10 w-64 animate-pulse rounded-full bg-white/5" />
        <div className="mx-auto mt-5 h-6 w-96 max-w-full animate-pulse rounded bg-white/5" />
        <div className="mx-auto mt-10 h-16 max-w-xl animate-pulse rounded-2xl bg-white/5" />
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<TrackOrderFallback />}>
      <TrackOrderContent />
    </Suspense>
  );
}
