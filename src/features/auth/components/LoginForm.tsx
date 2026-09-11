"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconUser, IconLock, IconEye } from "@/components/shared/Icons";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { ApiError } from "@/lib/api/client";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/portal");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Invalid email or password."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="font-display text-lg tracking-[0.3em] text-[var(--color-text)]">EMPLOYEE LOGIN</h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          Access your companies, tools, and resources.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="flex items-center gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 focus-within:border-[var(--color-gold)]">
        <IconUser size={18} className="text-[var(--color-text-faint)]" />
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]"
        />
      </div>

      {/* Password */}
      <div className="flex items-center gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 focus-within:border-[var(--color-gold)]">
        <IconLock size={18} className="text-[var(--color-text-faint)]" />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text-muted)]"
        >
          <IconEye size={18} />
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-[var(--color-text-muted)]">
          <input type="checkbox" className="h-4 w-4 accent-[var(--color-gold)]" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in →"}
      </Button>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        New employee?{" "}
        <Link href="/onboarding" className="text-[var(--color-gold)] hover:underline">
          Start your onboarding →
        </Link>
      </p>
    </form>
  );
}
