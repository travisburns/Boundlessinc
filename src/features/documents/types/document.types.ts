export type DocumentType = "Policy" | "Agreement" | "Onboarding" | "Resource";
export type AssignmentStatus = "Assigned" | "Acknowledged";

export interface CompanyDocument {
  id: string;
  companyId: string;
  title: string;
  type: DocumentType;
  description?: string | null;
  url?: string | null;
  version: number;
  isActive: boolean;
  publishedAtUtc: string;
  assignedCount: number;
  acknowledgedCount: number;
}

export interface DocumentAssignment {
  id: string;
  documentId: string;
  documentTitle: string;
  employeeId: string;
  employeeName?: string | null;
  status: AssignmentStatus;
  assignedAtUtc: string;
  acknowledgedAtUtc?: string | null;
}

export interface CreateDocumentInput {
  title: string;
  type: DocumentType;
  description?: string;
  url?: string;
}
