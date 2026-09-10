/** Mirrors the backend CompanySummaryDto (core.Companies projection). */
export interface CompanySummary {
  id: string;
  name: string;
  slug: string;
  code: string;
  type: "Holding" | "Subsidiary" | "Venture";
  status: "ComingSoon" | "Active" | "Inactive" | "Archived";
  tagline?: string | null;
  sector?: string | null;
  logoUrl?: string | null;
  accentColor?: string | null;
  sortOrder: number;
}
