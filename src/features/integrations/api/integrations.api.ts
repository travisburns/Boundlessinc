import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  Integration,
  IntegrationCreated,
} from "@/features/integrations/types/integration.types";

const token = () => getToken() ?? undefined;
const base = (companyId: string) => `/api/companies/${companyId}/integrations`;

export const integrationsApi = {
  list: (companyId: string) =>
    api.get<Integration[]>(base(companyId), { token: token(), cache: "no-store" }),

  create: (companyId: string, name: string) =>
    api.post<IntegrationCreated>(base(companyId), { token: token(), json: { name } }),
};
