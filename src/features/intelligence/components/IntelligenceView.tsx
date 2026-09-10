"use client";

import { useEffect, useState } from "react";
import { StatTile } from "@/components/ui/StatTile";
import { intelligenceApi } from "@/features/intelligence/api/intelligence.api";
import { RevenueTrendChart } from "@/features/intelligence/components/RevenueTrendChart";
import { CompanyPerformanceBars } from "@/features/intelligence/components/CompanyPerformanceBars";
import type { PortfolioOverview } from "@/features/intelligence/types/intelligence.types";
import { formatMoney } from "@/lib/formatting/money";
import { ApiError } from "@/lib/api/client";

export function IntelligenceView() {
  const [data, setData] = useState<PortfolioOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    intelligenceApi
      .portfolio(14)
      .then(setData)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 403) setForbidden(true);
        else setError("Could not load intelligence.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading intelligence…</p>;
  }

  if (forbidden) {
    return (
      <div className="mx-auto max-w-2xl rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">
          Enterprise Intelligence
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          The cross-company executive view is restricted to platform administrators.
        </p>
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-sm text-[var(--color-danger)]">{error ?? "No data."}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
        Enterprise Intelligence · Executive View
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
        Portfolio Command Center
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Normalized cross-company events from the operating applications.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Portfolio revenue" value={formatMoney(data.totalRevenue)} hint="Last 14 days" />
        <StatTile label="Recurring (MRR)" value={formatMoney(data.totalMrr)} hint="Active subscriptions" />
        <StatTile label="Events ingested" value={data.totalEvents.toLocaleString()} hint="Normalized" />
        <StatTile label="Operating companies" value={String(data.companyCount)} hint="Reporting in" />
      </div>

      <div className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
          Revenue — last 14 days
        </h2>
        <div className="mt-4">
          <RevenueTrendChart points={data.revenueByDay} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Company performance
          </h2>
          <div className="mt-5">
            <CompanyPerformanceBars companies={data.companies} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-line)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
              <tr>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
                <th className="px-4 py-3 font-medium">Events</th>
                <th className="px-4 py-3 font-medium">MRR</th>
              </tr>
            </thead>
            <tbody>
              {data.companies.map((c) => (
                <tr key={c.companyId} className="border-b border-[var(--color-line)] last:border-0">
                  <td className="px-4 py-3 text-[var(--color-text)]">{c.name}</td>
                  <td className="px-4 py-3 tabular-nums text-[var(--color-text-muted)]">{formatMoney(c.revenue)}</td>
                  <td className="px-4 py-3 tabular-nums text-[var(--color-text-muted)]">{c.events}</td>
                  <td className="px-4 py-3 tabular-nums text-[var(--color-text-muted)]">{formatMoney(c.mrr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
