import { api } from "@/lib/api/client";
import type { CompanySummary } from "@/features/companies/types/company.types";

/** Data access for the enterprise company directory. */
export const companiesApi = {
  /** Publicly visible companies for the portfolio page. */
  list: (init?: RequestInit) =>
    api.get<CompanySummary[]>("/api/companies", {
      ...init,
      // Portfolio is public and changes rarely; revalidate periodically.
      next: { revalidate: 300 },
    } as RequestInit & { next?: { revalidate: number } }),
};
