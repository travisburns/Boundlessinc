"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { workApi } from "@/features/work/api/work.api";
import { formatDate, shortDate } from "@/features/work/workFormat";
import type { Ring, RingEvent } from "@/features/work/types/work.types";

export function RingCalendarView({ ring }: { ring: Ring }) {
  const accent = ring.accentColor || "#C2410C";
  const [events, setEvents] = useState<RingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ title: "", date: "", timeLabel: "", detail: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workApi.rings.events(ring.id).then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, [ring.id]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title || !f.date) return;
    setBusy(true);
    setError(null);
    try {
      const created = await workApi.rings.createEvent(ring.id, {
        title: f.title, date: f.date, timeLabel: f.timeLabel || undefined, detail: f.detail || undefined,
      });
      setEvents((prev) => [...prev, created].sort((a, b) => (a.date < b.date ? -1 : 1)));
      setF({ title: "", date: "", timeLabel: "", detail: "" });
      setAdding(false);
    } catch {
      setError("Couldn't add the event — only the ring holder or an admin can.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--color-text)]">My Calendar</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{ring.name}</p>
        </div>
        {!adding && <Button onClick={() => setAdding(true)}>+ Add event</Button>}
      </div>

      {adding && (
        <form onSubmit={add} className="mt-6 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          {error && <p className="mb-3 text-sm text-[var(--color-danger)]">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title" className={cls + " sm:col-span-2"} />
            <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className={cls} />
            <input value={f.timeLabel} onChange={(e) => setF({ ...f, timeLabel: e.target.value })} placeholder="Time (e.g. 2:00 PM or End of Day)" className={cls} />
            <input value={f.detail} onChange={(e) => setF({ ...f, detail: e.target.value })} placeholder="Detail (e.g. Team Call)" className={cls + " sm:col-span-2"} />
          </div>
          <div className="mt-4 flex gap-3">
            <Button type="submit" disabled={busy || !f.title || !f.date}>{busy ? "Adding…" : "Add event"}</Button>
            <Button type="button" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
        {loading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-[var(--color-text-faint)]">Nothing scheduled.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((ev) => {
              const d = shortDate(ev.date);
              return (
                <li key={ev.id} className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border" style={{ borderColor: `${accent}55` }}>
                    <span className="text-[9px] tracking-wider text-[var(--color-text-faint)]">{d?.mon}</span>
                    <span className="text-base font-medium text-[var(--color-text)]">{d?.day}</span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[var(--color-text)]">{ev.title}</p>
                    <p className="truncate text-xs text-[var(--color-text-faint)]">
                      {formatDate(ev.date)}{ev.timeLabel ? ` · ${ev.timeLabel}` : ""}{ev.detail ? ` · ${ev.detail}` : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

const cls = "h-11 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] placeholder:text-[var(--color-text-faint)]";
