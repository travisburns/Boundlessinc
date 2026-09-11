import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MicroColumn } from "@/components/shared/MicroColumn";
import { InviteCodeEntry } from "@/features/onboarding/components/InviteCodeEntry";
import {
  IconUser,
  IconCard,
  IconLeaf,
  IconPeople,
  IconStar,
  IconHandshake,
} from "@/components/shared/Icons";

export const metadata: Metadata = {
  title: "Employee Onboarding",
  description:
    "How new team members join a Boundless Enterprises company — a guided, company-specific onboarding.",
};

const steps = [
  { Icon: IconUser, title: "Personal information", body: "Tell us who you are and how to reach you." },
  { Icon: IconCard, title: "Documents & payroll", body: "Employment documents, tax, and payroll details." },
  { Icon: IconLeaf, title: "Policies & training", body: "Company policies and role-specific training." },
  { Icon: IconStar, title: "Role setup", body: "Access, accounts, and equipment for your role." },
  { Icon: IconPeople, title: "Orientation", body: "Meet your company and how it works." },
  { Icon: IconHandshake, title: "Manager approval", body: "Final review and your first horizon." },
];

export default function OnboardingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cosmos relative overflow-hidden border-b border-[var(--color-line)]">
        <Container className="relative flex flex-col items-center py-24 text-center sm:py-28">
          <MicroColumn className="absolute left-5 top-24 sm:left-8" lines={["PEOPLE", "FIRST", "A BRIGHTER", "TOMORROW"]} />
          <MicroColumn className="absolute right-5 top-24 sm:right-8" align="right" lines={["ONE", "ACCOUNT", "MANY WORLDS"]} />
          <p className="u-micro text-[var(--color-gold)]">Welcome to Boundless Enterprises</p>
          <h1 className="mt-5 font-display text-5xl tracking-[0.03em] text-[var(--color-text)] sm:text-6xl">
            EMPLOYEE ONBOARDING
          </h1>
          <p className="mt-5 max-w-xl font-serif text-xl text-[var(--color-text-muted)]">
            A guided welcome into your company — shared foundations, tailored to where you&apos;re headed.
          </p>
          <p className="mt-8 text-sm text-[var(--color-text-muted)]">
            Have an invitation code? Enter it to begin.
          </p>
          <InviteCodeEntry />
          <p className="mt-6 text-sm text-[var(--color-text-muted)]">
            No code yet?{" "}
            <Link href="/onboarding/request" className="text-[var(--color-gold)] hover:underline">
              Request onboarding →
            </Link>
          </p>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
        <Container className="py-16">
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">How onboarding works</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-text-muted)]">
            Onboarding at Boundless Enterprises runs on a reusable engine: every company
            shares the same reliable process, while each one — Firefin, Boundless,
            SkaffaldOS, and the rest — tailors the steps to its work. When you&apos;re hired,
            your company sends you an invitation code. Enter it above to set up your own
            record and walk through onboarding yourself, step by step, through to completion.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map(({ Icon, title, body }, i) => (
              <div key={title} className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
                <div className="flex items-center gap-3">
                  <span className="u-micro text-[var(--color-gold)]">{String(i + 1).padStart(2, "0")}</span>
                  <Icon size={22} className="text-[var(--color-gold)]" />
                </div>
                <h3 className="mt-4 font-serif text-lg text-[var(--color-text)]">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-cosmos relative overflow-hidden">
        <Container className="relative flex flex-col items-center py-20 text-center">
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">
            Already onboarded?
          </h2>
          <p className="mt-3 max-w-lg text-[var(--color-text-muted)]">
            Once you&apos;ve finished onboarding, sign in to reach your companies, tools, and
            resources. Didn&apos;t get an invitation code? Reach out and we&apos;ll get you set up.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/login" size="lg">Employee Login</Button>
            <Button href="/contact" variant="outline" size="lg">Contact Us</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
