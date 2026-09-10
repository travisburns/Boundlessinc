import type { CompanyPerformance } from "@/features/intelligence/types/intelligence.types";
import { formatMoney } from "@/lib/formatting/money";

/**
 * Revenue by company — horizontal magnitude bars, sorted descending. Identity is
 * the company name (direct-labeled), so the bars share one hue rather than
 * cycling categorical colors.
 */
export function CompanyPerformanceBars({ companies }: { companies: CompanyPerformance[] }) {
  const max = Math.max(1, ...companies.map((c) => c.revenue));

  return (
    <div className="space-y-3">
      {companies.map((c) => {
        const pct = (c.revenue / max) * 100;
        return (
          <div key={c.companyId}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-[var(--color-text)]">{c.name}</span>
              <span className="tabular-nums text-[var(--color-text-muted)]">
                {formatMoney(c.revenue)}
                <span className="ml-2 text-xs text-[var(--color-text-faint)]">{c.events} events</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: c.accentColor ?? "var(--color-gold)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
