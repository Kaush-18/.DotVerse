export default function AccountLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading your account"
      className="mx-auto w-full max-w-7xl px-4 pb-16 pt-[var(--navbar-clearance)] sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <div className="h-48 animate-pulse rounded-3xl bg-white/[0.04]" />
        <div className="min-h-[32rem] animate-pulse rounded-3xl bg-white/[0.04]" />
      </div>
    </div>
  );
}
