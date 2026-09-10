"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { useActiveCompany } from "@/features/portal/context/ActiveCompanyProvider";
import { portalNav } from "@/lib/constants/navigation";

const liveModules = new Set(["/portal/employees"]);

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

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
