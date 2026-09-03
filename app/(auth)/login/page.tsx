"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        router.push("/account");
      },
      onError: (ctx) => {
        setError(ctx.error.message || "Invalid email or password.");
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        {error && <p className="mb-4 text-xs text-red-400">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-violet-600 p-3 text-white font-semibold">Sign In</button>
      </form>
    </div>
  );
}
