import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  CompanyDocument,
  CreateDocumentInput,
  DocumentAssignment,
} from "@/features/documents/types/document.types";

const token = () => getToken() ?? undefined;
const base = (companyId: string) => `/api/companies/${companyId}/documents`;

export const documentsApi = {
  list: (companyId: string) =>
    api.get<CompanyDocument[]>(base(companyId), { token: token(), cache: "no-store" }),

  create: (companyId: string, input: CreateDocumentInput) =>
    api.post<CompanyDocument>(base(companyId), { token: token(), json: input }),

  assignments: (companyId: string) =>
    api.get<DocumentAssignment[]>(`${base(companyId)}/assignments`, { token: token(), cache: "no-store" }),

  assign: (companyId: string, documentId: string, employeeId: string) =>
    api.post<DocumentAssignment>(`${base(companyId)}/${documentId}/assignments`, {
      token: token(),
      json: { employeeId },
    }),

  acknowledge: (companyId: string, assignmentId: string) =>
    api.post<DocumentAssignment>(`${base(companyId)}/assignments/${assignmentId}/acknowledge`, {
      token: token(),
    }),
};
