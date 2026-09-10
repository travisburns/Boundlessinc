import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { aboutContent } from "@/lib/constants/content";

export const metadata: Metadata = {
  title: "About",
  description: aboutContent.intro,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={aboutContent.eyebrow} title={aboutContent.title} subtitle={aboutContent.intro} />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {aboutContent.principles.map((p) => (
              <div
                key={p.title}
                className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6"
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
