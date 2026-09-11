import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type { InviteDetail, InvitationCreated } from "@/features/onboarding/types/invite.types";

const token = () => getToken() ?? undefined;
const publicBase = "/api/onboarding/invite";

/** Public self-serve endpoints — authenticated by the invite code, not a JWT. */
export const inviteApi = {
  get: (code: string) =>
    api.get<InviteDetail>(`${publicBase}/${encodeURIComponent(code)}`, {
      cache: "no-store",
    }),

  start: (code: string, firstName?: string, lastName?: string) =>
    api.post<InviteDetail>(`${publicBase}/${encodeURIComponent(code)}/start`, {
      json: { firstName, lastName },
    }),

  setStep: (code: string, stepId: string, completed: boolean, responseJson?: string) =>
    api.patch<InviteDetail>(
      `${publicBase}/${encodeURIComponent(code)}/steps/${stepId}`,
      { json: { completed, responseJson } },
    ),
};

/** Authorized: a manager creates an invitation from the portal. */
export const inviteAdminApi = {
  create: (
    companyId: string,
    body: {
      templateId: string;
      email: string;
      firstName: string;
      lastName: string;
      title?: string;
      expiresInDays?: number;
    },
  ) =>
    api.post<InvitationCreated>(
      `/api/companies/${companyId}/onboarding/invitations`,
      { token: token(), json: body },
    ),
};
