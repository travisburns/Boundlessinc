import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Section, Eyebrow } from "@/components/ui/Section";
import { CompanyGrid } from "@/features/companies/components/CompanyGrid";
import { companiesApi } from "@/features/companies/api/companies.api";
import type { CompanySummary } from "@/features/companies/types/company.types";
import { siteConfig } from "@/lib/constants/site";

async function getSubsidiaries(): Promise<CompanySummary[]> {
  try {
    const companies = await companiesApi.list();
    return companies.filter((c) => c.type !== "Holding");
  } catch {
    // The public site must render even when the API is unavailable.
    return [];
  }
}

export default async function HomePage() {
  const subsidiaries = await getSubsidiaries();

  return (
    <>
      {/* Hero */}
      <div className="bg-cosmic-grid">
        <Container className="flex flex-col items-center py-28 text-center sm:py-36">
          <Eyebrow>Central Platform · Digital Operating System</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-balance font-[family-name:var(--font-display)] text-5xl leading-[1.05] text-[var(--color-text)] sm:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-[var(--color-text-muted)]">
            The holding company behind a portfolio of independent ventures —
            unified by shared identity, onboarding, payments, and a private
            intelligence layer.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/companies" size="lg">
              Our Companies
            </Button>
            <Button href="/philosophy" variant="outline" size="lg">
              Our Philosophy
            </Button>
          </div>
        </Container>
      </div>

      {/* Mission */}
      <Section>
        <Container className="max-w-3xl text-center">
          <Eyebrow>Why we exist</Eyebrow>
          <p className="mt-6 text-balance font-[family-name:var(--font-display)] text-2xl leading-relaxed text-[var(--color-text)] sm:text-3xl">
            {siteConfig.mission}
          </p>
        </Container>
      </Section>

      {/* Portfolio preview */}
      <Section className="border-t border-[var(--color-line)] bg-[var(--color-void)]">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>The portfolio</Eyebrow>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)] sm:text-4xl">
                Independent companies, one philosophy.
              </h2>
            </div>
            <Button href="/companies" variant="ghost" size="sm">
              View all →
            </Button>
          </div>

          <div className="mt-12">
            <CompanyGrid companies={subsidiaries} />
          </div>
        </Container>
      </Section>
    </>
  );
}
