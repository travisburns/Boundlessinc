"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/api/auth.api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
    } finally {
      // Always report success — the API never reveals whether the account exists.
      setSent(true);
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">
          Check your inbox
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent
          instructions to reset your password.
        </p>
        <Link href="/reset-password" className="text-sm text-[var(--color-gold)] hover:underline">
          I have a reset token →
        </Link>
        <Link href="/login" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
          ← Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Enter your email and we&apos;ll send you a reset token.
        </p>
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send reset instructions"}
      </Button>

      <Link href="/login" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
        ← Back to login
      </Link>
    </form>
  );
}
