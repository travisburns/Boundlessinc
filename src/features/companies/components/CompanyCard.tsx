import Link from "next/link";
import Image from "next/image";
import type { CompanySummary } from "@/features/companies/types/company.types";

// Cropped emblem/imagery from the design, keyed by slug.
const THUMBS: Record<string, string> = {
  boundless: "/images/companies/boundless.png",
  firefin: "/images/companies/firefin.png",
  skaffaldos: "/images/companies/skaffaldos.png",
  digitalheavyweights: "/images/companies/digitalheavyweights.png",
};

/** Portfolio card: a cosmic emblem banner over the company's name, sector, and a route in. */
export function CompanyCard({ company }: { company: CompanySummary }) {
  const thumb = THUMBS[company.slug];
  const accent = company.accentColor ?? "var(--color-cosmic)";

  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] transition-colors duration-300 hover:border-[color:var(--accent)]"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="relative h-40 w-full overflow-hidden bg-[var(--color-void)]">
        {thumb ? (
          <Image
            src={thumb}
            alt={`${company.name} emblem`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            style={{ background: `radial-gradient(circle at 50% 40%, ${accent}33, transparent 70%)` }}
          >
            <span className="font-display text-2xl text-[var(--color-text)]">{company.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
        {company.sector && (
          <span className="absolute right-3 top-3 u-micro text-[var(--color-text-muted)]">
            {company.sector.split(" / ")[0]}
          </span>
        )}
        {company.status === "ComingSoon" && (
          <span className="absolute left-3 top-3 rounded-full border border-[var(--color-line)] bg-[var(--color-void)]/70 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-[var(--color-text-faint)]">
            Coming soon
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl text-[var(--color-text)]">{company.name}</h3>
        {company.tagline && (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
            {company.tagline}
          </p>
        )}
        <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-line)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors group-hover:border-[color:var(--accent)] group-hover:text-[var(--color-text)]">
          View Company
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
