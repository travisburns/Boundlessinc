import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { careersContent } from "@/lib/constants/content";

export const metadata: Metadata = {
  title: "Careers",
  description: careersContent.intro,
};

export default function CareersPage() {
  return (
    <>
      <PageHeader eyebrow={careersContent.eyebrow} title={careersContent.title} subtitle={careersContent.intro} />
      <Section>
        <Container>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Where we hire
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careersContent.areas.map((area) => (
              <div
                key={area}
                className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-[var(--color-text)]"
              >
                {area}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-void)] p-8">
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">
              Don&apos;t see your role?
            </h3>
            <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
              We&apos;re always interested in exceptional people. Tell us how you&apos;d
              help build what comes after.
            </p>
            <div className="mt-6">
              <Button href="/contact">Get in touch</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
