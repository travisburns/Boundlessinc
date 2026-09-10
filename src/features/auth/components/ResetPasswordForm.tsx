"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [token, setToken] = useState(params.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(email, token, password);
      router.push("/login?reset=1");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setError(Object.values(err.errors).flat()[0] ?? "Could not reset password.");
      } else {
        setError("The reset link is invalid or has expired.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">
          Choose a new password
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Enter the token from your email and a new password.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <Input label="Email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Reset token" name="token" required value={token} onChange={(e) => setToken(e.target.value)} />
      <Input
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        label="Confirm password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Updating…" : "Reset password"}
      </Button>

      <Link href="/login" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
        ← Back to login
      </Link>
    </form>
  );
}
