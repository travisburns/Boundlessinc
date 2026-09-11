import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type { AuthResult } from "@/features/auth/types/auth.types";
import type {
  Assignment,
  AssignmentInput,
  AssignmentStatus,
  AssignmentSummary,
  Ring,
  RingActivity,
  RingEvent,
  RingHolderInvite,
  RingHolderInviteCreated,
  RingInput,
  RingSummary,
} from "@/features/work/types/work.types";

const token = () => getToken() ?? undefined;
const authed = () => ({ token: token(), cache: "no-store" as RequestCache });

export const workApi = {
  rings: {
    list: () => api.get<RingSummary[]>("/api/rings", authed()),
    get: (slug: string) => api.get<Ring>(`/api/rings/${encodeURIComponent(slug)}`, authed()),
    /** The ring held by the current user (204 → null). */
    mine: () => api.get<Ring | undefined>("/api/rings/mine", authed()),
    create: (body: RingInput) => api.post<Ring>("/api/rings", { token: token(), json: body }),
    update: (id: string, body: RingInput) => api.put<Ring>(`/api/rings/${id}`, { token: token(), json: body }),
    assignments: (ringId: string, status?: AssignmentStatus) =>
      api.get<AssignmentSummary[]>(
        `/api/rings/${ringId}/assignments${status ? `?status=${status}` : ""}`,
        authed(),
      ),
    createAssignment: (ringId: string, body: AssignmentInput) =>
      api.post<Assignment>(`/api/rings/${ringId}/assignments`, { token: token(), json: body }),
    events: (ringId: string) => api.get<RingEvent[]>(`/api/rings/${ringId}/events`, authed()),
    activity: (ringId: string) => api.get<RingActivity[]>(`/api/rings/${ringId}/activity`, authed()),
    inviteHolder: (ringId: string, body: { firstName: string; lastName: string; email: string }) =>
      api.post<RingHolderInviteCreated>(`/api/rings/${ringId}/holder/invite`, { token: token(), json: body }),
    setHolder: (ringId: string, body: { email?: string; clear?: boolean }) =>
      api.post<Ring>(`/api/rings/${ringId}/holder`, { token: token(), json: body }),
  },
  /** Public: ring-holder onboarding. */
  ringInvite: {
    get: (code: string) => api.get<RingHolderInvite>(`/api/ring-invite/${encodeURIComponent(code)}`),
    accept: (code: string, body: { password: string; firstName?: string; lastName?: string }) =>
      api.post<AuthResult>(`/api/ring-invite/${encodeURIComponent(code)}/accept`, { json: body }),
  },
  assignments: {
    get: (id: string) => api.get<Assignment>(`/api/assignments/${id}`, authed()),
    getByCode: (code: string) =>
      api.get<Assignment>(`/api/assignments/by-code/${encodeURIComponent(code)}`, authed()),
    update: (id: string, body: AssignmentInput) =>
      api.put<Assignment>(`/api/assignments/${id}`, { token: token(), json: body }),
    setStatus: (id: string, status: AssignmentStatus, progressPercent?: number) =>
      api.patch<Assignment>(`/api/assignments/${id}/status`, {
        token: token(),
        json: { status, progressPercent },
      }),
    addUpdate: (id: string, body: string) =>
      api.post<Assignment>(`/api/assignments/${id}/updates`, { token: token(), json: { body } }),
  },
};
