export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </div>
      <div className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</div>}
    </div>
  );
}
