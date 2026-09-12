import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  CoreOnboardingDocument,
  CoreOnboardingProgress,
  SignStageInput,
} from "@/features/onboarding-core/types/coreOnboarding.types";

const token = () => getToken() ?? undefined;
const authed = () => ({ token: token(), cache: "no-store" as RequestCache });

export const coreOnboardingApi = {
  /** The document and the current user's signing progress. */
  get: () => api.get<CoreOnboardingDocument>("/api/onboarding/core", authed()),

  /** Record the read-and-agree signature for one stage. */
  signStage: (stageKey: string, body: SignStageInput) =>
    api.post<CoreOnboardingProgress>(
      `/api/onboarding/core/stages/${encodeURIComponent(stageKey)}/sign`,
      { token: token(), json: body },
    ),

  /** Record agreement to the document as a whole. */
  complete: (body: SignStageInput) =>
    api.post<CoreOnboardingProgress>("/api/onboarding/core/complete", {
      token: token(),
      json: body,
    }),
};
