import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  OnboardingProcess,
  OnboardingTemplate,
} from "@/features/onboarding/types/onboarding.types";

const token = () => getToken() ?? undefined;
const base = (companyId: string) => `/api/companies/${companyId}/onboarding`;

export const onboardingApi = {
  templates: (companyId: string) =>
    api.get<OnboardingTemplate[]>(`${base(companyId)}/templates`, {
      token: token(),
      cache: "no-store",
    }),

  processes: (companyId: string) =>
    api.get<OnboardingProcess[]>(`${base(companyId)}/processes`, {
      token: token(),
      cache: "no-store",
    }),

  start: (companyId: string, employeeId: string, templateId: string) =>
    api.post<OnboardingProcess>(`${base(companyId)}/processes`, {
      token: token(),
      json: { employeeId, templateId },
    }),

  setStep: (companyId: string, processId: string, stepId: string, completed: boolean) =>
    api.patch<OnboardingProcess>(
      `${base(companyId)}/processes/${processId}/steps/${stepId}`,
      { token: token(), json: { completed } },
    ),
};
