"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const { error: authError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/account",
      });

      if (authError) {
        setIsGoogleLoading(false);
        setError(authError.message || "Unable to continue with Google. Please try again.");
      }
    } catch {
      setIsGoogleLoading(false);
      setError("Unable to continue with Google. Please try again.");
    }
  };

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
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="mb-5 flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 p-3 text-white font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z" />
            <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z" />
            <path fill="#FBBC05" d="M6.54 13.59a5.86 5.86 0 0 1 0-3.18V7.88H3.3a9.5 9.5 0 0 0 0 8.24l3.24-2.53Z" />
            <path fill="#EA4335" d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z" />
          </svg>
          {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>
        <div className="mb-5 flex items-center gap-3 text-xs text-white/40" aria-hidden="true">
          <span className="h-px flex-1 bg-white/10" />
          <span>OR</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-transparent p-3 text-white" required />
        {error && <p className="mb-4 text-xs text-red-400">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-violet-600 p-3 text-white font-semibold">Sign In</button>
      </form>
    </div>
  );
}
