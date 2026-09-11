import { api, API_BASE_URL, ApiError } from "@/lib/api/client";
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
  RingFile,
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
  files: {
    list: (ringId: string, assignmentId?: string) =>
      api.get<RingFile[]>(
        `/api/rings/${ringId}/files${assignmentId ? `?assignmentId=${assignmentId}` : ""}`,
        authed(),
      ),

    /** Multipart upload — bypasses the JSON client so the browser sets the boundary. */
    upload: async (ringId: string, file: File, assignmentId?: string): Promise<RingFile> => {
      const form = new FormData();
      form.append("file", file);
      if (assignmentId) form.append("assignmentId", assignmentId);
      const res = await fetch(`${API_BASE_URL}/api/rings/${ringId}/files`, {
        method: "POST",
        headers: token() ? { Authorization: `Bearer ${token()}` } : undefined,
        body: form,
      });
      if (!res.ok) {
        throw new ApiError({ status: res.status, title: res.statusText });
      }
      return (await res.json()) as RingFile;
    },

    /** Fetches the file with the bearer token and returns a blob for download/preview. */
    blob: async (id: string): Promise<Blob> => {
      const res = await fetch(`${API_BASE_URL}/api/ring-files/${id}/download`, {
        headers: token() ? { Authorization: `Bearer ${token()}` } : undefined,
      });
      if (!res.ok) throw new ApiError({ status: res.status, title: res.statusText });
      return res.blob();
    },

    remove: (id: string) => api.delete<void>(`/api/ring-files/${id}`, { token: token() }),
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
