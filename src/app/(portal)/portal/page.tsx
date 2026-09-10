"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/shared/Wordmark";
import { useAuth } from "@/features/auth/components/AuthProvider";

export default function PortalHome() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      <header className="border-b border-[var(--color-line)]">
        <Container className="flex h-16 items-center justify-between">
          <Wordmark compact />
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[var(--color-text-muted)]">{user.email}</span>
            <button onClick={logout} className="text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
              Sign out
            </button>
          </div>
        </Container>
      </header>

      <Container className="py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
          Enterprise Portal
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-text)]">
          Welcome, {user.fullName.split(" ")[0]}.
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-text-muted)]">
          {user.isPlatformAdmin
            ? "You have platform administrator access across the holding company."
            : "Your shared enterprise services and company access."}
        </p>

        <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
          Your companies
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user.companies.map((c) => (
            <div
              key={c.companyId}
              className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
                  {c.companyName}
                </h3>
                {c.isPrimary && (
                  <span className="rounded-full border border-[var(--color-line)] px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-[var(--color-text-faint)]">
                    Primary
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-[var(--color-cosmic)]/20 px-2.5 py-0.5 text-xs text-[var(--color-cosmic-soft)]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 text-sm text-[var(--color-text-faint)]">
          Shared services — companies, employees, onboarding, payments, documents,
          intelligence, and integrations — arrive in the next phases.{" "}
          <Link href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            Return to public site →
          </Link>
        </p>
      </Container>
    </div>
  );
}
