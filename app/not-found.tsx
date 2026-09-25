import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60svh] items-center justify-center px-6 py-24 text-center text-white">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
          404 / Beyond the ordinary
        </p>
        <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-7xl">
          Page not found.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-white/60">
          The page you&apos;re looking for has moved beyond this universe.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
