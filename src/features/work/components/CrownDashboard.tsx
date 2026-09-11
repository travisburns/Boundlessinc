"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconRing, IconDoc, IconHourglass, IconAlert, IconBuilding, IconUpload, IconEdit, IconChat, IconFileText,
  type IconProps,
} from "@/components/shared/Icons";
import { workApi } from "@/features/work/api/work.api";
import { relativeTime } from "@/features/work/workFormat";
import type { OrgOverview, Ring } from "@/features/work/types/work.types";

/**
 * The Crown's organization-wide dashboard — a different kind of workspace: the
 * whole enterprise at a glance rather than a single discipline's task list.
 */
export function CrownDashboard({ ring }: { ring: Ring }) {
  const [data, setData] = useState<OrgOverview | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const accent = ring.accentColor || "#D4AF37";

  useEffect(() => {
    workApi.org
      .overview()
      .then((d) => {
        setData(d);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const firstName = ring.holderName.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)]">
        <div className="absolute inset-0" aria-hidden>
          <div className="bg-cosmos absolute inset-0 opacity-60" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, var(--color-void) 30%, ${accent}22 80%)` }} />
        </div>
        <div className="relative p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">Welcome back, {firstName}</p>
          <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl italic leading-tight text-[var(--color-text)] sm:text-5xl">
            {ring.heroTitle ?? "Chart the Greater Tomorrow"}
          </h1>
          {ring.heroSubtitle && <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg italic text-[var(--color-text-muted)]">{ring.heroSubtitle}</p>}
          <span className="mt-5 block h-px w-14" style={{ background: accent }} />
        </div>
      </section>

      {state === "loading" && <p className="mt-6 text-sm text-[var(--color-text-muted)]">Loading the enterprise…</p>}
      {state === "error" && <p className="mt-6 text-sm text-[var(--color-danger)]">The organization overview is available to the Crown and platform admins.</p>}

      {state === "ready" && data && (
        <>
          {/* Org totals */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Stat Icon={IconRing} label="Rings held" value={`${data.totals.heldRings}/${data.totals.totalRings}`} tone={accent} />
            <Stat Icon={IconBuilding} label="Companies" value={data.totals.companies} tone="#0891B2" />
            <Stat Icon={IconDoc} label="Active work" value={data.totals.activeAssignments} tone="#3B82F6" />
            <Stat Icon={IconHourglass} label="In review" value={data.totals.inReview} tone="#8B5CF6" />
            <Stat Icon={IconAlert} label="Blocked" value={data.totals.blocked} tone="#EF4444" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Rings grid */}
            <section className="lg:col-span-2">
              <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6">
                <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[var(--color-text)]">The Thirteen Rings</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {data.rings.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/ring/${r.slug}`}
                      className="rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/30 p-4 transition-colors hover:border-[var(--color-gold)]/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 font-medium text-[var(--color-text)]">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.accentColor || "#666" }} aria-hidden />
                          {r.name}
                        </span>
                        {!r.held && <span className="u-micro text-[var(--color-text-faint)]">Unheld</span>}
                      </div>
                      <p className="mt-1 truncate text-xs text-[var(--color-text-faint)]">
                        {r.held ? r.holderName : "No holder yet"}
                      </p>
                      <div className="mt-3 flex gap-4 text-xs text-[var(--color-text-muted)]">
                        <span>{r.activeAssignments} active</span>
                        {r.inReview > 0 && <span className="text-[#8B5CF6]">{r.inReview} review</span>}
                        {r.blocked > 0 && <span className="text-[var(--color-danger)]">{r.blocked} blocked</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Right column */}
            <aside className="space-y-6">
              <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">Companies</h3>
                <ul className="mt-4 space-y-2.5">
                  {data.companies.map((c) => (
                    <li key={c.name} className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate text-[var(--color-text)]">{c.name}</span>
                      <span className="shrink-0 text-xs text-[var(--color-text-faint)]">{c.status}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/portal/companies" className="mt-4 block text-xs text-[var(--color-gold)] hover:underline">Manage companies →</Link>
              </div>

              <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">Across the Rings</h3>
                <ul className="mt-4 space-y-3.5">
                  {data.recentActivity.length === 0 && <li className="text-sm text-[var(--color-text-faint)]">No activity yet.</li>}
                  {data.recentActivity.map((a) => {
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

              <Link href="/portal/rings" className="block rounded-full px-4 py-2.5 text-center text-sm font-medium text-white" style={{ background: accent }}>
                Manage the rings →
              </Link>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ Icon, label, value, tone }: { Icon: (p: IconProps) => React.ReactNode; label: string; value: number | string; tone: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${tone}22`, color: tone }}>
          <Icon size={18} />
        </span>
        <span className="font-[family-name:var(--font-cinzel)] text-2xl text-[var(--color-text)]">{value}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-[var(--color-text)]">{label}</p>
    </div>
  );
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
