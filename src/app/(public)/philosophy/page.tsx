import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { philosophyContent } from "@/lib/constants/content";

export const metadata: Metadata = {
  title: "Philosophy",
  description: philosophyContent.intro,
};

export default function PhilosophyPage() {
  return (
    <>
      <PageHeader
        eyebrow={philosophyContent.eyebrow}
        title={philosophyContent.title}
        subtitle={philosophyContent.intro}
      />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {philosophyContent.tenets.map((t) => (
              <div key={t.title} className="border-l-2 border-[var(--color-gold)] pl-5">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
                  {t.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{t.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="border-t border-[var(--color-line)] bg-[var(--color-void)]">
        <Container className="max-w-3xl text-center">
          <p className="text-balance font-[family-name:var(--font-display)] text-2xl leading-relaxed text-[var(--color-text)] sm:text-3xl">
            {philosophyContent.closing}
          </p>
        </Container>
      </Section>
    </>
  );
}
