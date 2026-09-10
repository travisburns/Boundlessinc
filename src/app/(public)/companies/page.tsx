import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MicroColumn } from "@/components/shared/MicroColumn";
import { CompanyGrid } from "@/features/companies/components/CompanyGrid";
import { IconHourglass, IconPeople, IconCompass, IconLeaf } from "@/components/shared/Icons";
import { companiesApi } from "@/features/companies/api/companies.api";
import type { CompanySummary } from "@/features/companies/types/company.types";

export const metadata: Metadata = {
  title: "Our Companies",
  description:
    "The Boundless Enterprises portfolio — distinct companies under a shared philosophy.",
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
      {/* Hero */}
      <section className="bg-cosmos relative overflow-hidden border-b border-[var(--color-line)]">
        <Container className="relative flex flex-col items-center py-24 text-center sm:py-28">
          <MicroColumn className="absolute left-5 top-24 sm:left-8" lines={["DIFFERENT", "COMPANIES", "A BRIGHTER", "TOMORROW"]} />
          <MicroColumn className="absolute right-5 top-24 sm:right-8" align="right" lines={["FURTHER", "HUMAN", "TOGETHER"]} />
          <p className="u-micro text-[var(--color-gold)]">The Boundless Portfolio</p>
          <h1 className="mt-5 font-display text-5xl tracking-[0.04em] text-[var(--color-text)] sm:text-6xl">
            OUR COMPANIES
          </h1>
          <p className="mt-5 max-w-xl font-serif text-xl text-[var(--color-text-muted)]">
            Distinct companies. Shared philosophy. Built for a more human future.
          </p>
        </Container>
      </section>

      {/* A House of Independent Companies */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
        <Container className="grid items-center gap-8 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">
              A House of Independent Companies
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-[var(--color-text-muted)]">
              Boundless Enterprises is a holding company built for the long horizon. Each
              company operates with its own identity, mission, and market, while sharing a
              common belief: technology, enterprise, and creativity should serve people first.
            </p>
          </div>
          <div className="relative min-h-52 overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)]">
            <Image src="/images/corporate/companies_mountains.png" alt="Mountains at sunrise" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-void)]/70 to-transparent" />
            <p className="absolute left-6 top-1/2 -translate-y-1/2 font-serif text-lg italic text-[var(--color-gold-soft)]">
              Independent
              <br />
              companies.
              <br />
              A more human
              <br />
              tomorrow.
            </p>
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-void)]">
        <Container className="py-16">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">Our Companies</h2>
            <p className="u-micro hidden text-[var(--color-text-faint)] sm:block">
              Different worlds. A shared purpose.
            </p>
          </div>
          <div className="mt-10">
            <CompanyGrid companies={subsidiaries} />
          </div>
        </Container>
      </section>

      {/* Shared Foundation */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
        <Container className="py-16">
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">Shared Foundation</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: IconHourglass, title: "Long Horizons", body: "We build for decades, not quarters." },
              { Icon: IconPeople, title: "Human-First Design", body: "People are the center. Everything else is a tool." },
              { Icon: IconCompass, title: "Independent Missions", body: "Each company keeps its own identity and purpose." },
              { Icon: IconLeaf, title: "Real Value", body: "Build things worth keeping." },
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
      <section className="bg-cosmos relative overflow-hidden">
        <Container className="relative flex flex-col items-center py-20 text-center">
          <MicroColumn className="absolute left-5 top-1/2 -translate-y-1/2 sm:left-8" lines={["SAME", "HUMANITY", "A BRIGHTER", "TOMORROW"]} />
          <MicroColumn className="absolute right-5 top-1/2 -translate-y-1/2 sm:right-8" align="right" lines={["MORE", "PEOPLE", "BRIGHTER", "WORLDS"]} />
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">
            Different companies. One horizon.
          </h2>
          <p className="mt-3 text-[var(--color-text-muted)]">
            Explore the companies of Boundless Enterprises and enter the worlds they are building.
          </p>
          <div className="mt-8">
            <Button href="#" size="lg">Enter a Company</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
