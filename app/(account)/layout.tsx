import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountNav from "@/components/account/AccountNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const session = await auth.api.getSession({
    headers: h,
  });

  if (!session) {
    redirect("/login?redirect=/account");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-[var(--navbar-clearance)] sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <aside className="md:sticky md:top-32 md:self-start">
          <AccountNav onSignOut={async () => {
            "use server";
            await auth.api.signOut({ headers: await headers() });
            redirect("/");
          }} />
        </aside>
        <main className="min-w-0 rounded-3xl border border-white/10 bg-[#07040d] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
