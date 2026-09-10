export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-full bg-[var(--color-gold)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs tabular-nums text-[var(--color-text-faint)]">
        {value}/{total}
      </span>
    </div>
  );
}
