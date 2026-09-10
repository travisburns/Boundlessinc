import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CompanyActions } from "@/features/companies/components/CompanyActions";
import { companiesApi } from "@/features/companies/api/companies.api";
import type { CompanyDetail } from "@/features/companies/types/company.types";
import { ApiError } from "@/lib/api/client";

async function getCompany(slug: string): Promise<CompanyDetail | null> {
  try {
    return await companiesApi.getBySlug(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) return { title: "Company not found" };
  return {
    title: company.name,
    description: company.tagline ?? company.description ?? undefined,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  const accent = company.accentColor ?? "var(--color-cosmic)";

  return (
    <>
      <div
        className="border-b border-[var(--color-line)]"
        style={{
          background: `radial-gradient(circle at 15% -20%, color-mix(in srgb, ${accent} 30%, transparent), transparent 60%), var(--color-ink)`,
        }}
      >
        <Container className="py-20 sm:py-28">
          <div className="flex items-center gap-4">
            <span
              className="inline-flex h-14 w-14 items-center justify-center rounded-xl text-xl font-semibold text-white"
              style={{ background: accent }}
            >
              {company.name.charAt(0)}
            </span>
            <div>
              {company.sector && (
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                  {company.sector}
                </p>
              )}
              <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-text)] sm:text-5xl">
                {company.name}
              </h1>
            </div>
          </div>

          {company.tagline && (
            <p className="mt-6 max-w-2xl text-xl text-[var(--color-text-muted)]">
              {company.tagline}
            </p>
          )}

          <div className="mt-10">
            <CompanyActions company={company} />
          </div>
        </Container>
      </div>

      {company.description && (
        <Section>
          <Container className="max-w-3xl">
            <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">
              {company.description}
            </p>
          </Container>
        </Section>
      )}
    </>
  );
}
