import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MicroColumn } from "@/components/shared/MicroColumn";
import {
  IconGlobe,
  IconUser,
  IconCard,
  IconHandshake,
  IconBuilding,
  IconLeaf,
  IconNodes,
  IconChart,
  IconPeople,
  IconHourglass,
  IconStar,
  IconArrowRight,
} from "@/components/shared/Icons";
import { companiesApi } from "@/features/companies/api/companies.api";
import { companyContent, companyThumb } from "@/features/companies/companyContent";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) return { title: "Company not found" };
  return { title: company.name, description: company.tagline ?? company.description ?? undefined };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  const content = companyContent[slug] ?? {};
  const aboutImage = content.aboutImage ?? companyThumb(slug);
  const aboutParagraphs = content.aboutParagraphs ?? (company.description ? [company.description] : []);
  const accent = company.accentColor ?? "var(--color-gold)";

  return (
    <>
      {/* Hero */}
      <section className="bg-cosmos relative overflow-hidden border-b border-[var(--color-line)]">
        <Container className="relative py-24 text-center sm:py-28">
          <MicroColumn className="absolute left-5 top-24 sm:left-8" lines={["GOOD", "COMPANY", "BRIGHTER", "TOMORROW"]} />
          <MicroColumn className="absolute right-5 top-24 sm:right-8" align="right" lines={["A MORE", "HUMAN", "FUTURE"]} />
          <p className="u-micro text-[var(--color-text-faint)]">
            <Link href="/companies" className="hover:text-[var(--color-text-muted)]">Our Companies</Link> / {company.name}
          </p>
          <p className="mt-6 u-micro text-[var(--color-gold)]">A Boundless Enterprises Company</p>
          <h1 className="mt-3 font-display text-6xl tracking-[0.02em] text-[var(--color-text)] sm:text-7xl">
            {company.name}
          </h1>
          {company.tagline && (
            <p className="mx-auto mt-4 max-w-2xl font-serif text-2xl text-[var(--color-text-muted)]">
              {company.tagline}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {company.websiteUrl && <Button href={company.websiteUrl} external size="lg">Visit Company</Button>}
            {company.supportsEmployeeLogin && <Button href="/login" variant="outline" size="lg">Employee Login</Button>}
            {company.supportsPayments && <Button href={`/companies/${company.slug}/pay`} variant="outline" size="lg">Make a Payment</Button>}
            <Button href={company.contactEmail ? `mailto:${company.contactEmail}` : "/contact"} variant="outline" size="lg">Contact</Button>
          </div>
        </Container>
      </section>

      {/* About */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
        <Container className="grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">About {company.name}</h2>
            <span className="rule-gold mt-4 block" />
            {aboutParagraphs.map((p, i) => (
              <p key={i} className="mt-5 max-w-md leading-relaxed text-[var(--color-text-muted)]">{p}</p>
            ))}
          </div>
          {aboutImage && (
            <div className="relative min-h-64 overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)]">
              <Image src={aboutImage} alt={`${company.name} imagery`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          )}
        </Container>
      </section>

      {/* What X Does (only when the company has design features) */}
      {content.features && (
        <section className="border-b border-[var(--color-line)] bg-[var(--color-void)]">
          <Container className="py-16">
            <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">What {company.name} Does</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {content.features.map((f) => (
                <div key={f.title} className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)]">
                  <div className="relative h-36 w-full">
                    <Image src={f.image} alt={f.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-[var(--color-text)]">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Company Access */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
        <Container className="py-16">
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">Company Access</h2>
            <p className="text-sm text-[var(--color-text-faint)]">Get to the resources, services, and information you need.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AccessCard Icon={IconGlobe} title={`Visit ${company.domain ?? company.name}`} body="Explore products, locations, and more." href={company.websiteUrl ?? "#"} external={!!company.websiteUrl} />
            <AccessCard Icon={IconUser} title="Employee Login" body="Access internal tools and resources." href="/login" />
            <AccessCard Icon={IconCard} title="Make a Payment" body="Pay bills, invoices, or outstanding balances." href={`/companies/${company.slug}/pay`} />
            <AccessCard Icon={IconHandshake} title="Vendor / Partner Inquiry" body="Work with us. Share your information and proposal." href="/contact" />
          </div>
        </Container>
      </section>

      {/* At a Glance */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-void)]">
        <Container className="py-14">
          <h2 className="font-serif text-2xl text-[var(--color-text)]">At a Glance</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Glance Icon={IconBuilding} label="Industry" value={company.sector?.split(" / ")[0] ?? "—"} />
            <Glance Icon={IconLeaf} label="Focus" value={company.sector ?? "—"} />
            <Glance Icon={IconNodes} label="Parent Company" value="Boundless Enterprises" />
            <Glance Icon={IconChart} label="Status" value={company.type === "Venture" ? "Active Venture" : "Operating Company"} />
          </div>
        </Container>
      </section>

      {/* Aligned with Boundless */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
        <Container className="py-16">
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">Aligned with Boundless</h2>
            <p className="text-sm text-[var(--color-text-faint)]">
              {company.name} is proud to be part of a larger vision — different companies, a shared purpose.
            </p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: IconPeople, title: "Human-First", body: "People are the center. Everything else is a tool." },
              { Icon: IconHourglass, title: "Long Horizons", body: "We build for decades, not quarters." },
              { Icon: IconStar, title: "Craft & Experience", body: "Extraordinary experiences create a brighter world." },
              { Icon: IconLeaf, title: "Real Value", body: "We make things that matter, for people's real lives." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <Icon size={28} className="text-[var(--color-gold)]" />
                <h3 className="mt-4 font-serif text-lg text-[var(--color-text)]">{title}</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing */}
      <section className="bg-cosmos relative overflow-hidden" style={{ ["--accent" as string]: accent }}>
        <Container className="relative flex flex-col items-center py-20 text-center">
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">Enter {company.name}</h2>
          <p className="mt-3 text-[var(--color-text-muted)]">Explore the brand, the experiences, and what&apos;s next.</p>
          <div className="mt-8">
            <Button href={company.websiteUrl ?? "/contact"} external={!!company.websiteUrl} size="lg">
              {company.websiteUrl ? `Visit ${company.name}` : "Get in touch"}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function AccessCard({
  Icon,
  title,
  body,
  href,
  external,
}: {
  Icon: (p: { size?: number; className?: string }) => React.ReactElement;
  title: string;
  body: string;
  href: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <Icon size={22} className="text-[var(--color-gold)]" />
      <h3 className="mt-4 font-serif text-lg text-[var(--color-text)]">{title}</h3>
      <p className="mt-1 flex-1 text-sm text-[var(--color-text-muted)]">{body}</p>
      <IconArrowRight size={18} className="mt-4 text-[var(--color-text-faint)]" />
    </>
  );
  const cls = "flex flex-col rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-gold)]";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

function Glance({
  Icon,
  label,
  value,
}: {
  Icon: (p: { size?: number; className?: string }) => React.ReactElement;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon size={24} className="text-[var(--color-gold)]" />
      <h3 className="mt-3 font-serif text-lg text-[var(--color-text)]">{label}</h3>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{value}</p>
    </div>
  );
}
