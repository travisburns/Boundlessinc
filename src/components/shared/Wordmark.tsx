import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Boundless Enterprises wordmark. Text-based so it renders crisply at any size
 * and in any theme; can be swapped for an SVG logo asset later.
 */
export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex flex-col leading-none", className)}>
      <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.2em] text-[var(--color-text)]">
        BOUNDLESS
      </span>
      {!compact && (
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.42em] text-[var(--color-gold)] transition-colors group-hover:text-[var(--color-gold-soft)]">
          Enterprises
        </span>
      )}
    </Link>
  );
}
