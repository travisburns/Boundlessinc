import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[var(--color-text-muted)]">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
