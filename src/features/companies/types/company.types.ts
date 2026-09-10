export type CompanyType = "Holding" | "Subsidiary" | "Venture";
export type CompanyStatus = "ComingSoon" | "Active" | "Inactive" | "Archived";

/** Mirrors the backend CompanySummaryDto (core.Companies projection). */
export interface CompanySummary {
  id: string;
  name: string;
  slug: string;
  code: string;
  type: CompanyType;
  status: CompanyStatus;
  tagline?: string | null;
  sector?: string | null;
  logoUrl?: string | null;
  accentColor?: string | null;
  sortOrder: number;
}

/** Mirrors the backend CompanyDetailDto for the company page. */
export interface CompanyDetail extends CompanySummary {
  description?: string | null;
  websiteUrl?: string | null;
  domain?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  supportsEmployeeLogin: boolean;
  supportsPayments: boolean;
}
