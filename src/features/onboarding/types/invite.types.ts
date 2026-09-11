import type { OnboardingProcess } from "@/features/onboarding/types/onboarding.types";

export type InviteStatus =
  | "Pending"
  | "InProgress"
  | "Completed"
  | "Expired"
  | "Revoked";

/** Public view of an onboarding invitation, resolved by code. */
export interface InviteDetail {
  status: InviteStatus;
  companyName: string;
  templateName: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  /** Present once the invitation has been started. */
  process: OnboardingProcess | null;
}

/** Returned to a manager when an invitation is created — includes the raw code once. */
export interface InvitationCreated {
  id: string;
  code: string;
  email: string;
  templateName: string;
  expiresAtUtc: string;
}
