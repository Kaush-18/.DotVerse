import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?redirect=/account");
  }

  const { user } = session;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-medium text-white">Welcome back, {user.name}</h2>
        <p className="text-white/60">Manage your account settings and view your order history here.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="text-sm text-white/50 mb-1">Email</h3>
            <p className="text-white">{user.email}</p>
         </div>
      </div>
    </div>
  );
}
