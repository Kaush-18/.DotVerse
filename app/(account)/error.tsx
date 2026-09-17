"use client";

export default function AccountError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60svh] w-full max-w-2xl items-center justify-center px-6 py-24 text-center text-white">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">
          Account unavailable
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          We couldn&apos;t load your account.
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Please try again. Your account data has not been changed.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex min-h-11 items-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
