"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { useActiveCompany } from "@/features/portal/context/ActiveCompanyProvider";
import { portalNav } from "@/lib/constants/navigation";

const liveModules = new Set([
  "/portal/employees",
  "/portal/onboarding",
  "/portal/payments",
  "/portal/documents",
  "/portal/intelligence",
  "/portal/integrations",
]);

export default function PortalDashboard() {
  const { user } = useAuth();
  const { activeCompany } = useActiveCompany();
  if (!user) return null;

  const sections = portalNav.filter((n) => n.href !== "/portal");

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
        Enterprise Portal
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
        Welcome, {user.fullName.split(" ")[0]}.
      </h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        {activeCompany
          ? `Operating in ${activeCompany.companyName}${
              activeCompany.roles.length ? ` · ${activeCompany.roles.join(", ")}` : ""
            }`
          : "Shared enterprise services across the holding company."}
      </p>

      <Link
        href="/first-horizon"
        className="mt-8 flex items-center gap-4 rounded-[var(--radius)] border border-[var(--color-gold)]/30 bg-gradient-to-r from-[var(--color-gold)]/10 to-transparent p-5 transition-colors hover:border-[var(--color-gold)]/60"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block font-[family-name:var(--font-cinzel)] text-sm uppercase tracking-[0.18em] text-[var(--color-text)]">
            The First Horizon · Core Onboarding
          </span>
          <span className="mt-0.5 block text-xs text-[var(--color-text-muted)]">
            Read and sign the Boundless onboarding document.
          </span>
        </span>
        <span className="ml-auto shrink-0 text-xs uppercase tracking-wider text-[var(--color-gold)]">Open →</span>
      </Link>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => {
          const live = liveModules.has(s.href);
          return (
            <Link
              key={s.href}
              href={live ? s.href : "#"}
              aria-disabled={!live}
              className={cardClass(live)}
            >
              <span className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
                {s.label}
              </span>
              <span className="mt-2 text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
                {live ? "Open →" : "Coming soon"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function cardClass(live: boolean) {
  const base =
    "flex flex-col rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition-colors";
  return live
    ? `${base} hover:border-[var(--color-gold)]`
    : `${base} pointer-events-none opacity-50`;
}
