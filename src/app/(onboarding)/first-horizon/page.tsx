import { CoreOnboardingFlow } from "@/features/onboarding-core/components/CoreOnboardingFlow";

export const metadata = {
  title: "The First Horizon · Core Onboarding · Boundless",
};

/** Part 1 of BoundlessIP onboarding: read and sign each page of the core document. */
export default function FirstHorizonPage() {
  return <CoreOnboardingFlow />;
}
