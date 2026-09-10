import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompanyGrid } from "@/features/companies/components/CompanyGrid";
import { companiesApi } from "@/features/companies/api/companies.api";
import type { CompanySummary } from "@/features/companies/types/company.types";

export const metadata: Metadata = {
  title: "Our Companies",
  description:
    "The Boundless Enterprises portfolio — independent companies under a shared philosophy.",
};

export default async function CompaniesPage() {
  let companies: CompanySummary[] = [];
  try {
    companies = await companiesApi.list();
  } catch {
    companies = [];
  }

  const subsidiaries = companies.filter((c) => c.type !== "Holding");

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Our Companies"
        subtitle="The holding company presents distinct companies under a shared philosophy. Choose a company to enter."
      />
      <Section>
        <Container>
          <CompanyGrid companies={subsidiaries} />
        </Container>
      </Section>
    </>
  );
}
