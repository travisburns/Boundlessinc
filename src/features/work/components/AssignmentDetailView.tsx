"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { workApi } from "@/features/work/api/work.api";
import { RingFileManager } from "@/features/work/components/RingFileManager";
import { STATUS_LABEL, statusColor, priorityColor, formatDate, relativeTime } from "@/features/work/workFormat";
import type { Assignment, AssignmentStatus, Ring } from "@/features/work/types/work.types";

export function AssignmentDetailView({ ring, code }: { ring: Ring; code: string }) {
  const slug = ring.slug;
  const accent = ring.accentColor || "#C2410C";
  const [a, setA] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    workApi.assignments
      .getByCode(code)
      .then((x) => setA(x))
      .catch(() => setA(null))
      .finally(() => setLoading(false));
  }, [code]);

  async function setStatus(status: AssignmentStatus) {
    if (!a) return;
    setBusy(true);
    try {
      setA(await workApi.assignments.setStatus(a.id, status));
    } finally {
      setBusy(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!a || !note.trim()) return;
    setBusy(true);
    try {
      setA(await workApi.assignments.addUpdate(a.id, note.trim()));
      setNote("");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  if (!a) return <p className="text-sm text-[var(--color-danger)]">Assignment not found.</p>;

  const domainData = parseDomainData(a.domainDataJson);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/ring/${slug}`} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
        ← Back to assignments
      </Link>

      <div className="mt-4">
        <p className="text-xs tracking-wider text-[var(--color-text-faint)]">{a.code}</p>
        <h1 className="mt-1 font-[family-name:var(--font-cormorant)] text-4xl text-[var(--color-text)]">{a.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <Meta k="Ring" v={a.ringName} />
          <Meta k="Type" v={a.type} />
          <span className="rounded px-2 py-1 font-semibold" style={{ background: `${priorityColor(a.priority)}22`, color: priorityColor(a.priority) }}>
            {a.priority.toUpperCase()}
          </span>
          <span className="rounded px-2 py-1 font-semibold" style={{ background: `${statusColor(a.status)}22`, color: statusColor(a.status) }}>
            {STATUS_LABEL[a.status].toUpperCase()}
          </span>
          <Meta k="Due" v={formatDate(a.dueDate)} />
        </div>
      </div>

      {a.objective && <Section title="Objective"><p className="leading-relaxed text-[var(--color-text-muted)]">{a.objective}</p></Section>}
      {a.deliverable && <Section title="Deliverable"><p className="leading-relaxed text-[var(--color-text-muted)]">{a.deliverable}</p></Section>}

      {a.acceptanceCriteria.length > 0 && (
        <Section title="Acceptance Criteria">
          <ul className="space-y-2">
            {a.acceptanceCriteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[var(--color-text-muted)]">
                <span className="mt-1 text-[var(--color-gold)]">◦</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {domainData.length > 0 && (
        <Section title="Details">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {domainData.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-[var(--color-text-faint)]">{k}</dt>
                <dd className="text-[var(--color-text)]">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {(a.dependencies || a.blockers) && (
        <Section title="Dependencies & Blockers">
          {a.dependencies && <p className="text-[var(--color-text-muted)]">{a.dependencies}</p>}
          {a.blockers && <p className="mt-2 text-[var(--color-danger)]">Blocked: {a.blockers}</p>}
        </Section>
      )}

      {a.references.length > 0 && (
        <Section title="References">
          <ul className="list-disc space-y-1 pl-5 text-[var(--color-text-muted)]">
            {a.references.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </Section>
      )}

      {/* Updates */}
      <Section title="Updates">
        <form onSubmit={addNote} className="mb-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Log progress…"
            rows={2}
            className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={busy || !note.trim()}
              className="rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              style={{ background: accent }}
            >
              Post update
            </button>
          </div>
        </form>
        {a.updates.length === 0 ? (
          <p className="text-sm text-[var(--color-text-faint)]">No updates yet.</p>
        ) : (
          <ul className="space-y-3">
            {a.updates.map((u) => (
              <li key={u.id} className="rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/30 p-3">
                <p className="text-sm text-[var(--color-text-muted)]">{u.body}</p>
                <p className="mt-1 text-xs text-[var(--color-text-faint)]">{u.author} · {relativeTime(u.createdAtUtc)}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Submit Work */}
      <Section title="Submit Work">
        <RingFileManager ring={ring} assignmentId={a.id} compact />
      </Section>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--color-line)] pt-6">
        {a.status === "Assigned" && <Action label="Start work" onClick={() => setStatus("InProgress")} busy={busy} accent={accent} />}
        {a.status === "InProgress" && <Action label="Submit for Review" onClick={() => setStatus("Review")} busy={busy} accent={accent} />}
        {a.status === "Review" && <Action label="Mark Complete" onClick={() => setStatus("Complete")} busy={busy} accent={accent} />}
        {a.status !== "Blocked" && a.status !== "Complete" && (
          <button onClick={() => setStatus("Blocked")} disabled={busy} className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] disabled:opacity-50">
            Mark Blocked
          </button>
        )}
        {a.status === "Blocked" && <Action label="Resume" onClick={() => setStatus("InProgress")} busy={busy} accent={accent} />}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <span className="text-[var(--color-text-muted)]">
      <span className="text-[var(--color-text-faint)]">{k}:</span> {v}
    </span>
  );
}

function Action({ label, onClick, busy, accent }: { label: string; onClick: () => void; busy: boolean; accent: string }) {
  return (
    <button onClick={onClick} disabled={busy} className="rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50" style={{ background: accent }}>
      {label}
    </button>
  );
}

function parseDomainData(json?: string | null): [string, string][] {
  if (!json) return [];
  try {
    const obj = JSON.parse(json) as Record<string, unknown>;
    return Object.entries(obj).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : String(v)]);
  } catch {
    return [];
  }
}
