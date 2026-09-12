import { RequireAuth } from "@/features/auth/components/RequireAuth";

/** Core onboarding: authenticated, full-screen ceremony chrome (no portal shell). */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-text)]">{children}</div>
    </RequireAuth>
  );
}
