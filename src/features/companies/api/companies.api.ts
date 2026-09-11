import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  CompanyDetail,
  CompanyInput,
  CompanySummary,
} from "@/features/companies/types/company.types";

// Portfolio is public and changes rarely; revalidate periodically (ISR).
const publicCache = { next: { revalidate: 300 } } as RequestInit;
const token = () => getToken() ?? undefined;

/** Data access for the enterprise company directory. */
export const companiesApi = {
  /** Publicly visible companies for the portfolio page. */
  list: () => api.get<CompanySummary[]>("/api/companies", publicCache),

  /** A single publicly visible company by slug. */
  getBySlug: (slug: string) =>
    api.get<CompanyDetail>(`/api/companies/${encodeURIComponent(slug)}`, publicCache),

  /** Admin: every company (all statuses) with full detail. */
  listAll: () =>
    api.get<CompanyDetail[]>("/api/companies/all", { token: token(), cache: "no-store" }),

  /** Admin: create a company. */
  create: (body: CompanyInput) =>
    api.post<CompanyDetail>("/api/companies", { token: token(), json: body }),

  /** Admin: update a company. */
  update: (id: string, body: CompanyInput) =>
    api.put<CompanyDetail>(`/api/companies/${id}`, { token: token(), json: body }),
};
