"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  IconDoc, IconCheckCircle, IconHourglass, IconAlert, IconWaveform, IconBook, IconGlobe, IconTools,
  IconUpload, IconEdit, IconChat, IconFileText, IconRing, type IconProps,
} from "@/components/shared/Icons";
import { workApi } from "@/features/work/api/work.api";
import { STATUS_LABEL, statusColor, priorityColor, formatDate, shortDate, relativeTime } from "@/features/work/workFormat";
import type { Assignment, AssignmentSummary, Ring, RingActivity, RingEvent } from "@/features/work/types/work.types";

type Tab = "Active" | "InProgress" | "Review" | "Complete";

export function RingDashboard({ ring }: { ring: Ring }) {
  const [items, setItems] = useState<AssignmentSummary[]>([]);
  const [events, setEvents] = useState<RingEvent[]>([]);
  const [activity, setActivity] = useState<RingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Active");
  const [current, setCurrent] = useState<Assignment | null>(null);
  const [stepDone, setStepDone] = useState(false);
  const accent = ring.accentColor || "#C2410C";

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      workApi.rings.assignments(ring.id).catch(() => []),
      workApi.rings.events(ring.id).catch(() => []),
      workApi.rings.activity(ring.id).catch(() => []),
    ]).then(([list, ev, act]) => {
      if (cancelled) return;
      setItems(list);
      setEvents(ev);
      setActivity(act);
      setLoading(false);
      const top =
        list.find((a) => a.status === "InProgress") ??
        list.find((a) => a.status !== "Complete" && a.status !== "Archived");
      if (top) workApi.assignments.get(top.id).then((a) => !cancelled && setCurrent(a)).catch(() => {});
    });
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

  const firstName = ring.holderName.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)]">
        <HeroBackdrop accent={accent} imageUrl={ring.heroImageUrl} />
        <div className="relative flex items-start justify-between gap-6 p-8 sm:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">Welcome back, {firstName}</p>
            <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl italic leading-[1.05] text-[var(--color-text)] sm:text-6xl">
              {(ring.heroTitle ?? ring.name).split(" ").reduce<string[][]>((rows, w, i) => {
                const half = Math.ceil((ring.heroTitle ?? ring.name).split(" ").length / 2);
                (rows[i < half ? 0 : 1] ??= []).push(w);
                return rows;
              }, [[], []]).map((row, i) => <span key={i} className="block">{row.join(" ")}</span>)}
            </h1>
            {ring.heroSubtitle && (
              <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg italic text-[var(--color-text-muted)]">
                {ring.heroSubtitle}
              </p>
            )}
            <span className="mt-5 block h-px w-14" style={{ background: accent }} />
          </div>
          {ring.focus && (
            <div className="hidden w-56 shrink-0 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/60 p-4 backdrop-blur-sm sm:block">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">Focus</p>
              <p className="mt-1 font-[family-name:var(--font-cormorant)] italic text-[var(--color-text-muted)]">{ring.focus}</p>
            </div>
          )}
        </div>
      </section>

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat Icon={IconDoc} label="My Assignments" value={active.length} sub={`${inProgress.length} in progress`} tone="#3B82F6" />
        <Stat Icon={IconCheckCircle} label="Due This Week" value={dueThisWeek.length}
          sub={dueThisWeek.map((a) => formatDate(a.dueDate).replace(/,.*/, "")).join(", ") || "Nothing due"} tone="#22C55E" />
        <Stat Icon={IconHourglass} label="In Review" value={inReview.length} sub="Awaiting feedback" tone="#8B5CF6" />
        <Stat Icon={IconAlert} label="Blocked" value={blocked.length} sub={blocked.length ? "Needs attention" : "All clear"} tone="#EF4444" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Assignments */}
        <section className="lg:col-span-2">
          <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[var(--color-text)]">My Assignments</h2>
              {current && (
                <Link
                  href={`/ring/${ring.slug}/assignments/${current.code}`}
                  className="rounded-full border px-4 py-2 text-xs font-medium"
                  style={{ borderColor: `${accent}66`, color: accent }}
                >
                  + New Note / Update
                </Link>
              )}
            </div>
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
              <ul className="mt-2 divide-y divide-[var(--color-line)]">
                {shown.map((a) => (
                  <li key={a.id}>
                    <Link href={`/ring/${ring.slug}/assignments/${a.code}`} className="flex items-center gap-4 py-3.5 transition-colors hover:bg-[var(--color-void)]/30">
                      <Thumb code={a.code} accent={accent} />
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

          {ring.resources.length > 0 && (
            <div className="mt-6 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6">
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[var(--color-text)]">Helpful Resources</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {ring.resources.map((r) => {
                  const Icon = resourceIcon(r.label);
                  return (
                    <a key={r.label} href={r.href || "#"} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/30 p-4 transition-colors hover:border-[var(--color-gold)]/50">
                      <span className="flex items-center gap-3">
                        <Icon size={20} style={{ color: accent }} />
                        <span>
                          <span className="block text-sm font-medium text-[var(--color-text)]">{r.label}</span>
                          {r.sublabel && <span className="block text-xs text-[var(--color-text-faint)]">{r.sublabel}</span>}
                        </span>
                      </span>
                      <span className="text-[var(--color-text-faint)]">›</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Right column */}
        <aside className="space-y-6">
          {current && (
            <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">Current Task</h3>
              <div className="mt-3 flex items-start gap-3">
                <Thumb code={current.code} accent={accent} size={56} />
                <div className="min-w-0">
                  <p className="text-[11px] tracking-wider text-[var(--color-text-faint)]">{current.code}</p>
                  <p className="font-medium leading-snug text-[var(--color-text)]">{current.title}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1"><ProgressBar value={current.progressPercent} total={100} /></div>
                <span className="text-xs tabular-nums text-[var(--color-text-faint)]">{current.progressPercent}%</span>
              </div>
              {current.nextStep && (
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">Next step</p>
                  <label className="mt-2 flex items-center gap-2.5 text-sm text-[var(--color-text-muted)]">
                    <input type="checkbox" checked={stepDone} onChange={(e) => setStepDone(e.target.checked)} className="h-4 w-4 accent-[var(--color-gold)]" style={{ accentColor: accent }} />
                    <span className={stepDone ? "line-through" : ""}>{current.nextStep}</span>
                  </label>
                </div>
              )}
              <Link href={`/ring/${ring.slug}/assignments/${current.code}`} className="mt-5 block rounded-full px-4 py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: accent }}>
                Open Assignment →
              </Link>
            </div>
          )}

          {/* Calendar */}
          <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">My Calendar</h3>
              <span className="text-xs text-[var(--color-text-faint)]">View All</span>
            </div>
            <ul className="mt-4 space-y-3">
              {events.length === 0 && <li className="text-sm text-[var(--color-text-muted)]">Nothing scheduled.</li>}
              {events.map((e) => {
                const d = shortDate(e.date);
                return (
                  <li key={e.id} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-[var(--color-line)]">
                      <span className="text-[9px] tracking-wider text-[var(--color-text-faint)]">{d?.mon}</span>
                      <span className="text-sm font-medium text-[var(--color-text)]">{d?.day}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-[var(--color-text)]">{e.title}</span>
                      <span className="block truncate text-xs text-[var(--color-text-faint)]">
                        {[e.timeLabel, e.detail].filter(Boolean).join(" – ") || "—"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">Recent Activity</h3>
              <span className="text-xs text-[var(--color-text-faint)]">View All</span>
            </div>
            <ul className="mt-4 space-y-3.5">
              {activity.length === 0 && <li className="text-sm text-[var(--color-text-faint)]">No activity yet.</li>}
              {activity.map((a) => {
                const Icon = activityIcon(a.kind);
                return (
                  <li key={a.id} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)]" style={{ color: accent }}>
                      <Icon size={14} />
                    </span>
                    <span>
                      <span className="block text-sm text-[var(--color-text-muted)]">{a.text}</span>
                      <span className="block text-xs text-[var(--color-text-faint)]">{relativeTime(a.createdAtUtc)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function HeroBackdrop({ accent, imageUrl }: { accent: string; imageUrl?: string | null }) {
  if (imageUrl) {
    return (
      <>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, var(--color-void) 25%, transparent)` }} aria-hidden />
      </>
    );
  }
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="bg-cosmos absolute inset-0 opacity-60" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, var(--color-void) 30%, ${accent}22 75%, ${accent}33)` }} />
      <svg viewBox="0 0 600 240" preserveAspectRatio="none" className="absolute inset-y-0 right-0 h-full w-2/3 opacity-50">
        <defs>
          <radialGradient id="sun" cx="70%" cy="35%" r="40%">
            <stop offset="0%" stopColor={`${accent}88`} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="600" height="240" fill="url(#sun)" />
        <path d="M300 240 L360 150 L410 185 L470 120 L520 170 L600 130 L600 240 Z" fill="rgba(30,22,50,0.85)" />
        <path d="M360 240 L430 175 L480 200 L560 155 L600 180 L600 240 Z" fill="rgba(12,10,24,0.9)" />
      </svg>
    </div>
  );
}

function Stat({ Icon, label, value, sub, tone }: { Icon: (p: IconProps) => React.ReactNode; label: string; value: number; sub: string; tone: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${tone}22`, color: tone }}>
          <Icon size={18} />
        </span>
        <span className="font-[family-name:var(--font-cinzel)] text-3xl text-[var(--color-text)]">{value}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-[var(--color-text)]">{label}</p>
      <p className="mt-0.5 truncate text-xs text-[var(--color-text-faint)]">{sub}</p>
    </div>
  );
}

function TabBtn({ label, on, onClick, accent }: { label: string; on: boolean; onClick: () => void; accent: string }) {
  return (
    <button onClick={onClick} className={"-mb-px border-b-2 pb-2.5 transition-colors " + (on ? "text-[var(--color-text)]" : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]")} style={on ? { borderColor: accent } : undefined}>
      {label}
    </button>
  );
}

function Pill({ text, color }: { text: string; color: string }) {
  return (
    <span className="hidden shrink-0 rounded px-2 py-1 text-[10px] font-semibold tracking-wider sm:inline" style={{ background: `${color}22`, color }}>
      {text}
    </span>
  );
}

function Thumb({ code, accent, size = 44 }: { code: string; accent: string; size?: number }) {
  const [h1, h2] = huesFrom(code);
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg border border-[var(--color-line)]"
      style={{ width: size, height: size, background: `linear-gradient(135deg, hsl(${h1} 45% 28%), hsl(${h2} 40% 18%))`, color: `${accent}` }}
    >
      <IconRing size={Math.round(size * 0.4)} className="opacity-60" />
    </span>
  );
}

function huesFrom(code: string): [number, number] {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) % 360;
  return [h, (h + 40) % 360];
}

function resourceIcon(label: string): (p: IconProps) => React.ReactNode {
  const n = label.toLowerCase();
  if (n.includes("audio") || n.includes("sound") || n.includes("library")) return IconWaveform;
  if (n.includes("style") || n.includes("guide") || n.includes("doc")) return IconBook;
  if (n.includes("world") || n.includes("reference") || n.includes("region")) return IconGlobe;
  if (n.includes("tool") || n.includes("software")) return IconTools;
  return IconBook;
}

function activityIcon(kind: string): (p: IconProps) => React.ReactNode {
  switch (kind) {
    case "FileUpload": return IconUpload;
    case "Update": return IconEdit;
    case "Comment": return IconChat;
    case "Draft": return IconFileText;
    default: return IconEdit;
  }
}
