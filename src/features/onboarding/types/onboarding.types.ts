export interface OnboardingTemplateStep {
  order: number;
  name: string;
  description?: string | null;
  isRequired: boolean;
}

export interface OnboardingTemplate {
  id: string;
  companyId: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  steps: OnboardingTemplateStep[];
}

export type OnboardingStatus = "NotStarted" | "InProgress" | "Completed";

export interface OnboardingEmployeeStep {
  id: string;
  order: number;
  name: string;
  isRequired: boolean;
  isCompleted: boolean;
  completedAtUtc?: string | null;
}

export interface OnboardingProcess {
  id: string;
  companyId: string;
  employeeId: string;
  templateName: string;
  status: OnboardingStatus;
  totalSteps: number;
  completedSteps: number;
  startedAtUtc: string;
  completedAtUtc?: string | null;
  steps: OnboardingEmployeeStep[];
}
