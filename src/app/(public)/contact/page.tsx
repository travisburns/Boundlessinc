import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactForm } from "@/features/contact/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Boundless Enterprises.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch."
        subtitle="Questions, partnerships, or press — reach the holding company directly."
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_auto]">
          <ContactForm />
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                General
              </h3>
              <p className="mt-2 text-[var(--color-text-muted)]">hello@boundless.enterprises</p>
            </div>
            <div>
              <h3 className="font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                Partnerships
              </h3>
              <p className="mt-2 text-[var(--color-text-muted)]">partners@boundless.enterprises</p>
            </div>
            <div>
              <h3 className="font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                Careers
              </h3>
              <p className="mt-2 text-[var(--color-text-muted)]">careers@boundless.enterprises</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
