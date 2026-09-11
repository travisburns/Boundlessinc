import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  InviteDetail,
  InvitationCreated,
  OnboardingRequest,
  RequestSubmitted,
} from "@/features/onboarding/types/invite.types";

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

/** Public: a prospective hire requests to onboard (admin approves later). */
export const requestApi = {
  submit: (body: {
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    desiredRole?: string;
  }) => api.post<RequestSubmitted>("/api/onboarding/requests", { json: body }),
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

  /** Pending onboarding requests awaiting review. */
  requests: (companyId: string) =>
    api.get<OnboardingRequest[]>(
      `/api/companies/${companyId}/onboarding/requests`,
      { token: token(), cache: "no-store" },
    ),

  /** Approve a request → issues an invitation (code returned once). */
  approveRequest: (
    companyId: string,
    requestId: string,
    body: { templateId: string; title?: string; expiresInDays?: number },
  ) =>
    api.post<InvitationCreated>(
      `/api/companies/${companyId}/onboarding/requests/${requestId}/approve`,
      { token: token(), json: body },
    ),

  /** Decline a request. */
  declineRequest: (companyId: string, requestId: string) =>
    api.post<void>(
      `/api/companies/${companyId}/onboarding/requests/${requestId}/decline`,
      { token: token() },
    ),
};
