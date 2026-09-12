/** Types for the Boundless core onboarding document (Part 1 of BoundlessIP onboarding). */

/** A signing stage — one exact page of the onboarding document. */
export interface CoreOnboardingStage {
  key: string;
  order: number;
  pageNumber: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

/** A recorded per-stage agreement. */
export interface CoreOnboardingSignature {
  stageKey: string;
  stageOrder: number;
  stageTitle: string;
  typedName: string;
  signedAtUtc: string;
}

/** The current user's progress through the document. */
export interface CoreOnboardingProgress {
  signedStageKeys: string[];
  signatures: CoreOnboardingSignature[];
  isComplete: boolean;
  completedAtUtc: string | null;
  completedName: string | null;
}

/** The whole document plus the caller's progress. */
export interface CoreOnboardingDocument {
  version: string;
  stages: CoreOnboardingStage[];
  progress: CoreOnboardingProgress;
}

export interface SignStageInput {
  typedName: string;
  signature: string;
}
