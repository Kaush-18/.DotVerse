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
      <path fill="#4285F4" d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z" /><path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z" /><path fill="#FBBC05" d="M6.54 13.59a5.86 5.86 0 0 1 0-3.18V7.88H3.3a9.5 9.5 0 0 0 0 8.24l3.24-2.53Z" /><path fill="#EA4335" d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    const registrationData = { email, password, name: `${firstName} ${lastName}`.trim(), firstName, lastName } as Parameters<typeof authClient.signUp.email>[0];
    try {
      await authClient.signUp.email(registrationData, {
        onSuccess: () => router.push("/account"),
        onError: (ctx) => {
          setError(ctx.error.message || "Unable to create your account. Please try again.");
          setIsSubmitting(false);
        },
      });
    } catch {
      setError("Unable to create your account right now. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <PageReveal>
      <section className="relative flex min-h-[calc(100svh-var(--navbar-clearance))] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:py-16">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="relative w-full max-w-lg">
          <div className="mb-8 text-center"><Logo /><p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-violet-300/80">Join the movement</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Create your account.</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/55">Your next essential starts here. Build a profile that moves with you.</p></div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            <button type="button" onClick={handleGoogleSignIn} disabled={isBusy} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:cursor-not-allowed disabled:opacity-60">{isGoogleLoading ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <GoogleMark />}{isGoogleLoading ? "Connecting to Google…" : "Continue with Google"}</button>
            <div className="my-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35" role="separator" aria-label="Or continue with email"><span className="h-px flex-1 bg-white/10" /><span>Or</span><span className="h-px flex-1 bg-white/10" /></div>
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="register-first-name" className="mb-2 block text-xs font-medium text-white/70">First name</label><input id="register-first-name" name="firstName" type="text" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" placeholder="Alex" required /></div><div><label htmlFor="register-last-name" className="mb-2 block text-xs font-medium text-white/70">Last name</label><input id="register-last-name" name="lastName" type="text" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" placeholder="Morgan" required /></div></div>
              <div><label htmlFor="register-email" className="mb-2 block text-xs font-medium text-white/70">Email address</label><input id="register-email" name="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" placeholder="you@example.com" required /></div>
              <div><label htmlFor="register-password" className="mb-2 block text-xs font-medium text-white/70">Password</label><div className="relative"><input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" placeholder="At least 8 characters" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/45 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
              <div><label htmlFor="register-confirm-password" className="mb-2 block text-xs font-medium text-white/70">Confirm password</label><div className="relative"><input id="register-confirm-password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20" placeholder="Repeat your password" required /><button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/45 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
              {error && <p id="register-error" role="alert" aria-live="polite" className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs leading-5 text-red-200">{error}</p>}
              <button type="submit" disabled={isBusy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.25)] transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting && <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />}{isSubmitting ? "Creating account…" : "Create account"}{!isSubmitting && <ArrowRight size={16} aria-hidden="true" />}</button>
            </form>
          </div>
          <p className="mt-7 text-center text-sm text-white/50">Already have an account? <Link href="/login" className="font-semibold text-white transition hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70">Sign in</Link></p>
        </div>
      </section>
    </PageReveal>
  );
}
