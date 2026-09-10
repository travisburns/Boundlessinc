import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type { PortfolioOverview } from "@/features/intelligence/types/intelligence.types";

export const intelligenceApi = {
  portfolio: (trendDays = 14) =>
    api.get<PortfolioOverview>(`/api/intelligence/portfolio?trendDays=${trendDays}`, {
      token: getToken() ?? undefined,
      cache: "no-store",
    }),
};
