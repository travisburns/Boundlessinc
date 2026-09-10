import { cn } from "@/lib/utils/cn";

/** Vertical rhythm wrapper for page sections. */
export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

/** Small uppercase eyebrow label used above section headings. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
      {children}
    </span>
  );
}
