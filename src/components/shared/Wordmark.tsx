import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Emblem } from "@/components/shared/Emblem";

/**
 * Boundless Enterprises wordmark: the sacred-geometry emblem beside the engraved
 * (Cinzel) wordmark. `compact` drops "ENTERPRISES" for tight spaces.
 */
export function Wordmark({
  className,
  compact = false,
  emblemSize = 30,
}: {
  className?: string;
  compact?: boolean;
  emblemSize?: number;
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)}>
      <Emblem size={emblemSize} className="shrink-0 transition-opacity group-hover:opacity-80" />
      <span className="font-display leading-none text-[var(--color-text)]">
        <span className="block text-[0.95rem] font-medium tracking-[0.28em]">BOUNDLESS</span>
        {!compact && (
          <span className="mt-0.5 block text-[0.6rem] tracking-[0.42em] text-[var(--color-text-muted)]">
            ENTERPRISES
          </span>
        )}
      </span>
    </Link>
  );
}
