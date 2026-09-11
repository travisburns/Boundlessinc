"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { workApi } from "@/features/work/api/work.api";
import { STATUS_LABEL, statusColor, priorityColor, formatDate, shortDate, relativeTime } from "@/features/work/workFormat";
import type { Assignment, AssignmentSummary, Ring } from "@/features/work/types/work.types";

type Tab = "Active" | "InProgress" | "Review" | "Complete";

export function RingDashboard({ ring }: { ring: Ring }) {
  const [items, setItems] = useState<AssignmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Active");
  const [current, setCurrent] = useState<Assignment | null>(null);
  const accent = ring.accentColor || "#C2410C";

  useEffect(() => {
    let cancelled = false;
    workApi.rings
      .assignments(ring.id)
      .then((list) => {
        if (cancelled) return;
        setItems(list);
        setLoading(false);
        const top =
          list.find((a) => a.status === "InProgress") ??
          list.find((a) => a.status !== "Complete" && a.status !== "Archived");
        if (top) workApi.assignments.get(top.id).then((a) => !cancelled && setCurrent(a)).catch(() => {});
      })
      .catch(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [ring.id]);

  const active = useMemo(() => items.filter((a) => a.status !== "Complete" && a.status !== "Archived"), [items]);
  const inProgress = useMemo(() => items.filter((a) => a.status === "InProgress"), [items]);
  const inReview = useMemo(() => items.filter((a) => a.status === "Review"), [items]);
  const completed = useMemo(() => items.filter((a) => a.status === "Complete"), [items]);
  const blocked = useMemo(() => items.filter((a) => a.status === "Blocked"), [items]);

  const dueThisWeek = useMemo(() => {
    const now = new Date();
    const in7 = new Date(now.getTime() + 7 * 86_400_000);
    return active.filter((a) => {
      if (!a.dueDate) return false;
      const d = new Date(`${a.dueDate}T00:00:00`);
      return d >= now && d <= in7;
    });
  }, [active]);

  const shown =
    tab === "Active" ? active : tab === "InProgress" ? inProgress : tab === "Review" ? inReview : completed;

  const upcoming = useMemo(
    () => [...active].filter((a) => a.dueDate).sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1)).slice(0, 5),
    [active],
  );

  const firstName = ring.holderName.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)]">
        <div className="bg-cosmos absolute inset-0" style={{ opacity: 0.5 }} aria-hidden />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(90deg, var(--color-void) 30%, ${accent}22)` }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
            Welcome back, {firstName}
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl italic leading-tight text-[var(--color-text)] sm:text-5xl">
            {ring.heroTitle ?? ring.name}
          </h1>
          {ring.heroSubtitle && (
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-[var(--color-text-muted)]">
              {ring.heroSubtitle}
            </p>
          )}
          {ring.focus && (
            <div className="mt-2 max-w-sm rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/50 p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">Focus</p>
              <p className="mt-1 font-[family-name:var(--font-cormorant)] italic text-[var(--color-text-muted)]">
                {ring.focus}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="My Assignments" value={active.length} sub={`${inProgress.length} in progress`} tone="#3B82F6" />
        <Stat label="Due This Week" value={dueThisWeek.length} sub={dueThisWeek.map((a) => formatDate(a.dueDate).replace(/,.*/, "")).join(", ") || "Nothing due"} tone="#22C55E" />
        <Stat label="In Review" value={inReview.length} sub="Awaiting feedback" tone="#8B5CF6" />
        <Stat label="Blocked" value={blocked.length} sub={blocked.length ? "Needs attention" : "All clear"} tone="#EF4444" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Assignments */}
        <section className="lg:col-span-2">
          <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[var(--color-text)]">
              My Assignments
            </h2>
            <div className="mt-4 flex flex-wrap gap-4 border-b border-[var(--color-line)] text-sm">
              <TabBtn label={`Active (${active.length})`} on={tab === "Active"} onClick={() => setTab("Active")} accent={accent} />
              <TabBtn label={`In Progress (${inProgress.length})`} on={tab === "InProgress"} onClick={() => setTab("InProgress")} accent={accent} />
              <TabBtn label={`In Review (${inReview.length})`} on={tab === "Review"} onClick={() => setTab("Review")} accent={accent} />
              <TabBtn label={`Completed (${completed.length})`} on={tab === "Complete"} onClick={() => setTab("Complete")} accent={accent} />
            </div>

            {loading ? (
              <p className="mt-6 text-sm text-[var(--color-text-muted)]">Loading…</p>
            ) : shown.length === 0 ? (
              <p className="mt-6 text-sm text-[var(--color-text-muted)]">Nothing here.</p>
            ) : (
              <ul className="mt-4 divide-y divide-[var(--color-line)]">
                {shown.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/ring/${ring.slug}/assignments/${a.code}`}
                      className="flex items-center gap-4 py-3.5 transition-colors hover:bg-[var(--color-void)]/30"
                    >
                      <span className="h-11 w-11 shrink-0 rounded-lg border border-[var(--color-line)]" style={{ background: `${accent}22` }} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="text-[11px] tracking-wider text-[var(--color-text-faint)]">{a.code}</span>
                        <span className="block truncate font-medium text-[var(--color-text)]">{a.title}</span>
                        {a.summary && <span className="block truncate text-xs text-[var(--color-text-muted)]">{a.summary}</span>}
                      </span>
                      <Pill text={a.priority.toUpperCase()} color={priorityColor(a.priority)} />
                      <Pill text={STATUS_LABEL[a.status].toUpperCase()} color={statusColor(a.status)} />
                      <span className="hidden w-24 shrink-0 text-right text-xs text-[var(--color-text-muted)] sm:block">
                        Due<br />{formatDate(a.dueDate)}
                      </span>
                      <span className="text-[var(--color-text-faint)]">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Resources */}
          {ring.resources.length > 0 && (
            <div className="mt-6 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6">
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[var(--color-text)]">Helpful Resources</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {ring.resources.map((r) => (
                  <a
                    key={r.label}
                    href={r.href || "#"}
                    className="rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/30 p-4 transition-colors hover:border-[var(--color-gold)]/50"
                  >
                    <p className="text-sm font-medium text-[var(--color-text)]">{r.label}</p>
                    {r.sublabel && <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">{r.sublabel}</p>}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right column */}
        <aside className="space-y-6">
          {current && (
            <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">Current Task</h3>
              <p className="mt-3 text-[11px] tracking-wider text-[var(--color-text-faint)]">{current.code}</p>
              <p className="font-medium text-[var(--color-text)]">{current.title}</p>
              <div className="mt-3">
                <ProgressBar value={current.progressPercent} total={100} />
              </div>
              {current.nextStep && (
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">Next step</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{current.nextStep}</p>
                </div>
              )}
              <Link
                href={`/ring/${ring.slug}/assignments/${current.code}`}
                className="mt-5 block rounded-full px-4 py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: accent }}
              >
                Open Assignment →
              </Link>
            </div>
          )}

          <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">My Calendar</h3>
            <ul className="mt-4 space-y-3">
              {upcoming.length === 0 && <li className="text-sm text-[var(--color-text-muted)]">Nothing scheduled.</li>}
              {upcoming.map((a) => {
                const d = shortDate(a.dueDate);
                return (
                  <li key={a.id} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-[var(--color-line)]">
                      <span className="text-[9px] tracking-wider text-[var(--color-text-faint)]">{d?.mon}</span>
                      <span className="text-sm font-medium text-[var(--color-text)]">{d?.day}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-[var(--color-text)]">{a.title}</span>
                      <span className="block text-xs text-[var(--color-text-faint)]">Due · {a.code}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {current && current.updates.length > 0 && (
            <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">Recent Activity</h3>
              <ul className="mt-4 space-y-3">
                {current.updates.slice(0, 5).map((u) => (
                  <li key={u.id} className="text-sm">
                    <p className="text-[var(--color-text-muted)]">{u.body}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">{relativeTime(u.createdAtUtc)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: number; sub: string; tone: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-cinzel)] text-3xl text-[var(--color-text)]">{value}</span>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: tone }} aria-hidden />
      </div>
      <p className="mt-2 text-sm font-medium text-[var(--color-text)]">{label}</p>
      <p className="mt-0.5 truncate text-xs text-[var(--color-text-faint)]">{sub}</p>
    </div>
  );
}

function TabBtn({ label, on, onClick, accent }: { label: string; on: boolean; onClick: () => void; accent: string }) {
  return (
    <button
      onClick={onClick}
      className={"-mb-px border-b-2 pb-2.5 transition-colors " + (on ? "text-[var(--color-text)]" : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]")}
      style={on ? { borderColor: accent } : undefined}
    >
      {label}
    </button>
  );
}

function Pill({ text, color }: { text: string; color: string }) {
  return (
    <span
      className="hidden shrink-0 rounded px-2 py-1 text-[10px] font-semibold tracking-wider sm:inline"
      style={{ background: `${color}22`, color }}
    >
      {text}
    </span>
  );
}
