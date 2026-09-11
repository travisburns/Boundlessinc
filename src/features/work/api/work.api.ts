import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  Assignment,
  AssignmentInput,
  AssignmentStatus,
  AssignmentSummary,
  Ring,
  RingActivity,
  RingEvent,
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
