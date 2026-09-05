"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    const registrationData = {
      email,
      password,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
    } as Parameters<typeof authClient.signUp.email>[0];

    await authClient.signUp.email(registrationData, {
      onSuccess: () => {
        router.push("/account");
      },
      onError: (ctx) => {
        setError(ctx.error.message || "An error occurred during registration.");
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <form onSubmit={handleRegister} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Register</h1>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        {error && <p className="mb-4 text-xs text-red-400">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-violet-600 p-3 text-white font-semibold">Create Account</button>
      </form>
    </div>
  );
}
