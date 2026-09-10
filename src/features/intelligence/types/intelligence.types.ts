export interface CompanyPerformance {
  companyId: string;
  name: string;
  code: string;
  accentColor?: string | null;
  revenue: number;
  events: number;
  mrr: number;
}

export interface RevenuePoint {
  date: string; // yyyy-MM-dd
  revenue: number;
}

export interface PortfolioOverview {
  totalRevenue: number;
  totalEvents: number;
  totalMrr: number;
  companyCount: number;
  companies: CompanyPerformance[];
  revenueByDay: RevenuePoint[];
}
