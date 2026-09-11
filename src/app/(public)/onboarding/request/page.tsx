import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RequestOnboardingForm } from "@/features/onboarding/components/RequestOnboardingForm";

export const metadata: Metadata = {
  title: "Request Onboarding",
  description: "Ask to onboard into a Boundless Enterprises company.",
};

export default function RequestOnboardingPage() {
  return (
    <section className="bg-cosmos relative min-h-[70vh] overflow-hidden">
      <Container className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="u-micro text-[var(--color-gold)]">New to the portfolio</p>
          <h1 className="mt-3 font-display text-4xl tracking-[0.03em] text-[var(--color-text)] sm:text-5xl">
            REQUEST ONBOARDING
          </h1>
          <p className="mt-4 font-serif text-lg text-[var(--color-text-muted)]">
            Don&apos;t have a code yet? Tell us where you&apos;re headed and we&apos;ll get you set up.
          </p>
        </div>
        <RequestOnboardingForm />
      </Container>
    </section>
  );
}
