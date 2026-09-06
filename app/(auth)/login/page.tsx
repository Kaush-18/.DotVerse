"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";

import PageReveal from "@/components/animations/PageReveal";
import Logo from "@/components/ui/Logo";
import { authClient } from "@/lib/auth-client";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z" />
      <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z" />
      <path fill="#FBBC05" d="M6.54 13.59a5.86 5.86 0 0 1 0-3.18V7.88H3.3a9.5 9.5 0 0 0 0 8.24l3.24-2.53Z" />
      <path fill="#EA4335" d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isBusy = isSubmitting || isGoogleLoading;

  const handleGoogleSignIn = async () => {
    if (isBusy) return;
    setError("");
    setIsGoogleLoading(true);
    try {
      const { error: authError } = await authClient.signIn.social({ provider: "google", callbackURL: "/account" });
      if (authError) {
        setIsGoogleLoading(false);
        setError(authError.message || "Unable to continue with Google. Please try again.");
      }
    } catch {
      setIsGoogleLoading(false);
      setError("Unable to continue with Google. Please try again.");
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;
    setError("");
    setIsSubmitting(true);
    try {
      await authClient.signIn.email({ email, password }, {
        onSuccess: () => router.push("/account"),
        onError: (ctx) => {
          setError(ctx.error.message || "Invalid email or password.");
          setIsSubmitting(false);
        },
      });
    } catch {
      setError("Unable to sign in right now. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <PageReveal>
      <section className="relative flex min-h-[calc(100svh-var(--navbar-clearance))] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:py-16">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="relative w-full max-w-md">
          <div className="mb-8 text-center"><Logo /><p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-violet-300/80">Member access</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome back.</h1><p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/55">Sign in to keep your next look in motion.</p></div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            <button type="button" onClick={handleGoogleSignIn} disabled={isBusy} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:cursor-not-allowed disabled:opacity-60">{isGoogleLoading ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <GoogleMark />}{isGoogleLoading ? "Connecting to Google…" : "Continue with Google"}</button>
            <div className="my-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35" role="separator" aria-label="Or continue with email"><span className="h-px flex-1 bg-white/10" /><span>Or</span><span className="h-px flex-1 bg-white/10" /></div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div><label htmlFor="login-email" className="mb-2 block text-xs font-medium text-white/70">Email address</label><input id="login-email" name="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" placeholder="you@example.com" required /></div>
              <div><div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="login-password" className="block text-xs font-medium text-white/70">Password</label><Link href="/contact" className="text-xs text-white/45 transition hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70">Forgot password?</Link></div><div className="relative"><input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/45 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
              {error && <p id="login-error" role="alert" aria-live="polite" className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs leading-5 text-red-200">{error}</p>}
              <button type="submit" disabled={isBusy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.25)] transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting && <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />}{isSubmitting ? "Signing in…" : "Sign in"}{!isSubmitting && <ArrowRight size={16} aria-hidden="true" />}</button>
            </form>
          </div>
          <p className="mt-7 text-center text-sm text-white/50">Don’t have an account? <Link href="/register" className="font-semibold text-white transition hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70">Create one</Link></p>
        </div>
      </section>
    </PageReveal>
  );
}
