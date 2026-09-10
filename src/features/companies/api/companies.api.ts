import { api } from "@/lib/api/client";
import type {
  CompanyDetail,
  CompanySummary,
} from "@/features/companies/types/company.types";

// Portfolio is public and changes rarely; revalidate periodically (ISR).
const publicCache = { next: { revalidate: 300 } } as RequestInit;

/** Data access for the enterprise company directory. */
export const companiesApi = {
  /** Publicly visible companies for the portfolio page. */
  list: () => api.get<CompanySummary[]>("/api/companies", publicCache),

  /** A single publicly visible company by slug. */
  getBySlug: (slug: string) =>
    api.get<CompanyDetail>(`/api/companies/${encodeURIComponent(slug)}`, publicCache),
};
