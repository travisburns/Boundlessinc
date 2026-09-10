import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/** Labelled text input with inline error message. */
export const Input = forwardRef<HTMLInputElement, FieldProps>(function Input(
  { label, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-muted)]">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-text)]",
          "placeholder:text-[var(--color-text-faint)] outline-none transition-colors",
          "focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/40",
          error && "border-[var(--color-danger)]",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
    </div>
  );
});
