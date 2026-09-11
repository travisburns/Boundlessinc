export type AssignmentStatus =
  | "Draft"
  | "Assigned"
  | "InProgress"
  | "Blocked"
  | "Review"
  | "Complete"
  | "Archived";

export type AssignmentType =
  | "Create"
  | "Build"
  | "Research"
  | "Review"
  | "Decide"
  | "Maintain"
  | "Fix"
  | "Deliver"
  | "Plan";

export type AssignmentPriority = "Low" | "Normal" | "High" | "Critical";

export interface RingResource {
  label: string;
  sublabel?: string | null;
  href?: string | null;
}

export interface RingSummary {
  id: string;
  domain: string;
  slug: string;
  name: string;
  disciplines?: string | null;
  holderName: string;
  accentColor?: string | null;
  codePrefix: string;
}

export interface Ring extends RingSummary {
  holderUserId?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  focus?: string | null;
  motto?: string | null;
  heroImageUrl?: string | null;
  resources: RingResource[];
}

export interface AssignmentSummary {
  id: string;
  code: string;
  ringId: string;
  title: string;
  summary?: string | null;
  type: AssignmentType;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  progressPercent: number;
  dueDate?: string | null;
}

export interface AssignmentUpdate {
  id: string;
  author: string;
  body: string;
  createdAtUtc: string;
}

export interface Assignment {
  id: string;
  code: string;
  ringId: string;
  ringName: string;
  title: string;
  summary?: string | null;
  objective?: string | null;
  type: AssignmentType;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  assigneeName?: string | null;
  issuedBy?: string | null;
  companyId?: string | null;
  assignedAtUtc?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  completedAtUtc?: string | null;
  deliverable?: string | null;
  acceptanceCriteria: string[];
  dependencies?: string | null;
  blockers?: string | null;
  progressPercent: number;
  nextStep?: string | null;
  reviewRequired: boolean;
  reviewedBy?: string | null;
  references: string[];
  tags: string[];
  domainDataJson?: string | null;
  updates: AssignmentUpdate[];
}

/** Payload for creating/updating an assignment. */
export interface AssignmentInput {
  title: string;
  type: AssignmentType;
  priority: AssignmentPriority;
  summary?: string;
  objective?: string;
  assigneeName?: string;
  issuedBy?: string;
  companyId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  deliverable?: string;
  acceptanceCriteria?: string[];
  dependencies?: string;
  blockers?: string;
  nextStep?: string;
  reviewRequired: boolean;
  references?: string[];
  tags?: string[];
  domainDataJson?: string | null;
}

/** Payload for creating/updating a ring. */
export interface RingInput {
  domain: string;
  name: string;
  codePrefix: string;
  holderName: string;
  holderUserId?: string | null;
  disciplines?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  focus?: string;
  motto?: string;
  accentColor?: string;
  heroImageUrl?: string | null;
  resources?: RingResource[];
}
