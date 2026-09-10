import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

/** Standard hero header for interior public pages. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-cosmic-grid border-b border-[var(--color-line)]">
      <Container className="py-20 sm:py-24">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-4 max-w-3xl text-balance font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--color-text)] sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            {subtitle}
          </p>
        )}
      </Container>
    </div>
  );
}
