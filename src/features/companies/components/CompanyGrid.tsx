import type { CompanySummary } from "@/features/companies/types/company.types";
import { CompanyCard } from "@/features/companies/components/CompanyCard";

/** Responsive grid of company cards for the portfolio. */
export function CompanyGrid({ companies }: { companies: CompanySummary[] }) {
  if (companies.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        The portfolio is being prepared. Check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
