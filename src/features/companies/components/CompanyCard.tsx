import Link from "next/link";
import type { CompanySummary } from "@/features/companies/types/company.types";

/** Portfolio card for a single company, routing to its company page by slug. */
export function CompanyCard({ company }: { company: CompanySummary }) {
  const accent = company.accentColor ?? "var(--color-cosmic)";

  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)]"
      style={{ ["--accent" as string]: accent }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: accent }}
        aria-hidden
      />

      <div className="flex items-center justify-between">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold text-white"
          style={{ background: accent }}
        >
          {company.name.charAt(0)}
        </span>
        {company.status === "ComingSoon" && (
          <span className="rounded-full border border-[var(--color-line)] px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-[var(--color-text-faint)]">
            Coming soon
          </span>
        )}
      </div>

      <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
        {company.name}
      </h3>
      {company.sector && (
        <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
          {company.sector}
        </p>
      )}
      {company.tagline && (
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {company.tagline}
        </p>
      )}

      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)] transition-colors group-hover:text-[color:var(--accent)]">
        Explore
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
