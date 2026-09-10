import { cn } from "@/lib/utils/cn";

/** The wide-tracked marginal micro-labels that run down the sides of cosmic bands. */
export function MicroColumn({
  lines,
  align = "left",
  className,
}: {
  lines: string[];
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "u-micro hidden select-none flex-col lg:flex",
        align === "right" ? "items-end text-right" : "items-start text-left",
        className,
      )}
    >
      {lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
      <span className="rule-gold mt-3" />
    </div>
  );
}
