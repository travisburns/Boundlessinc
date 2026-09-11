import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { OnboardingWizard } from "@/features/onboarding/components/OnboardingWizard";

export const metadata: Metadata = {
  title: "Start Onboarding",
  description: "Redeem your invitation and complete your onboarding.",
};

export default function OnboardingStartPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-20 text-center text-[var(--color-text-muted)]">
          Loading…
        </Container>
      }
    >
      <OnboardingWizard />
    </Suspense>
  );
}
