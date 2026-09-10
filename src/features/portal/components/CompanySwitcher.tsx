"use client";

import { useActiveCompany } from "@/features/portal/context/ActiveCompanyProvider";

/** Dropdown to switch the active company context within the portal. */
export function CompanySwitcher() {
  const { companies, activeCompanyId, setActiveCompany } = useActiveCompany();

  if (companies.length === 0) return null;

  if (companies.length === 1) {
    return (
      <span className="text-sm text-[var(--color-text-muted)]">
        {companies[0].companyName}
      </span>
    );
  }

  return (
    <select
      value={activeCompanyId ?? ""}
      onChange={(e) => setActiveCompany(e.target.value)}
      className="h-9 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
      aria-label="Active company"
    >
      {companies.map((c) => (
        <option key={c.companyId} value={c.companyId}>
          {c.companyName}
        </option>
      ))}
    </select>
  );
}
