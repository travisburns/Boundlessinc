"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { workApi } from "@/features/work/api/work.api";
import type { Ring, RingInput, RingSummary } from "@/features/work/types/work.types";
import { AssignmentCreateForm } from "@/features/work/components/AssignmentCreateForm";

const DOMAINS = [
  "World", "Image", "Resonance", "Machine", "Crown", "Compass", "Engine",
  "Ledger", "Seal", "Hearth", "Herald", "Gate", "Circle",
];

const empty: RingInput = {
  domain: "World", name: "", codePrefix: "", holderName: "",
  disciplines: "", heroTitle: "", heroSubtitle: "", focus: "", motto: "", accentColor: "#6D28D9",
};

export function RingAdminView() {
  const { user } = useAuth();
  const [rings, setRings] = useState<RingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Ring | "new" | null>(null);
  const [assignFor, setAssignFor] = useState<RingSummary | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRings(await workApi.rings.list());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (user && !user.isPlatformAdmin) {
    return (
      <div className="mx-auto max-w-3xl">
        <Heading />
        <p className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-muted)]">
          Managing rings is limited to platform administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <Heading />
        {editing === null && !assignFor && <Button onClick={() => setEditing("new")}>+ Add ring</Button>}
      </div>

      {assignFor ? (
        <div className="mt-8">
          <button onClick={() => setAssignFor(null)} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">← Back to rings</button>
          <h2 className="mt-3 font-serif text-xl text-[var(--color-text)]">New assignment · {assignFor.name}</h2>
          <AssignmentCreateForm ringId={assignFor.id} onDone={() => setAssignFor(null)} />
        </div>
      ) : editing !== null ? (
        <RingForm
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); void load(); }}
        />
      ) : loading ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">Loading…</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rings.length === 0 && (
            <li className="rounded-[var(--radius)] border border-dashed border-[var(--color-line)] p-8 text-center text-sm text-[var(--color-text-muted)]">
              No rings yet. Add the first one.
            </li>
          )}
          {rings.map((r) => (
            <li key={r.id} className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="h-9 w-9 shrink-0 rounded-full border" style={{ borderColor: r.accentColor || "#666", background: `${r.accentColor || "#666"}22` }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--color-text)]">{r.name}</p>
                  <p className="truncate text-xs text-[var(--color-text-faint)]">{r.domain} · codes {r.codePrefix}-####</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setAssignFor(r)}>+ Assignment</Button>
                <EditButton ringId={r.id} onLoad={setEditing} />
                <Link href={`/ring/${r.slug}`} className="text-sm text-[var(--color-gold)] hover:underline">Open →</Link>
              </div>
              <HolderCell ring={r} onChanged={load} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditButton({ ringId, onLoad }: { ringId: string; onLoad: (r: Ring) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const rings = await workApi.rings.list();
          const slug = rings.find((x) => x.id === ringId)?.slug;
          if (slug) onLoad(await workApi.rings.get(slug));
        } finally {
          setBusy(false);
        }
      }}
    >
      Edit
    </Button>
  );
}

function Heading() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">Rings</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">The thirteen domains of Boundless Enterprises.</p>
    </div>
  );
}

function HolderCell({ ring, onChanged }: { ring: RingSummary; onChanged: () => void }) {
  const [inviting, setInviting] = useState(false);
  const [f, setF] = useState({ firstName: "", lastName: "", email: "" });
  const [created, setCreated] = useState<{ code: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const held = ring.holderName && ring.holderName !== "Unassigned";

  const link = created && typeof window !== "undefined"
    ? `${window.location.origin}/ring-invite/${encodeURIComponent(created.code)}`
    : "";

  async function holdMyself() {
    setBusy(true);
    try {
      await workApi.rings.setHolder(ring.id, {});
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function clearHolder() {
    setBusy(true);
    try {
      await workApi.rings.setHolder(ring.id, { clear: true });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    if (!f.firstName || !f.lastName || !f.email) return;
    setBusy(true);
    try {
      const res = await workApi.rings.inviteHolder(ring.id, f);
      setCreated({ code: res.code });
    } finally {
      setBusy(false);
    }
  }

  async function copy(v: string) {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  if (held) {
    return (
      <p className="mt-3 border-t border-[var(--color-line)] pt-3 text-xs text-[var(--color-text-muted)]">
        Holder: <span className="text-[var(--color-text)]">{ring.holderName}</span>
        <button onClick={clearHolder} disabled={busy} className="ml-3 text-[var(--color-text-faint)] hover:text-[var(--color-danger)]">Clear</button>
      </p>
    );
  }

  if (created) {
    return (
      <div className="mt-3 border-t border-[var(--color-line)] pt-3">
        <p className="text-xs text-[var(--color-text-muted)]">Invitation created for {f.email} — send this code:</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <code className="rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3 py-1.5 font-mono tracking-[0.15em] text-[var(--color-text)]">{created.code}</code>
          <Button size="sm" variant="outline" onClick={() => copy(created.code)}>Copy code</Button>
          <Button size="sm" variant="outline" onClick={() => copy(link)}>{copied ? "Copied!" : "Copy link"}</Button>
          <Button size="sm" variant="ghost" onClick={() => { setCreated(null); setInviting(false); setF({ firstName: "", lastName: "", email: "" }); }}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-[var(--color-line)] pt-3">
      {!inviting ? (
        <p className="text-xs text-[var(--color-text-faint)]">
          Unassigned
          <button onClick={holdMyself} disabled={busy} className="ml-3 text-[var(--color-gold)] hover:underline">Hold it myself</button>
          <button onClick={() => setInviting(true)} className="ml-3 text-[var(--color-gold)] hover:underline">Invite someone</button>
        </p>
      ) : (
        <form onSubmit={invite} className="flex flex-wrap items-end gap-2">
          <input value={f.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} placeholder="First" className={holderInput} />
          <input value={f.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} placeholder="Last" className={holderInput} />
          <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} type="email" placeholder="Email" className={holderInput + " w-52"} />
          <Button size="sm" type="submit" disabled={busy || !f.firstName || !f.lastName || !f.email}>{busy ? "…" : "Send invite"}</Button>
          <Button size="sm" type="button" variant="ghost" onClick={() => setInviting(false)}>Cancel</Button>
        </form>
      )}
    </div>
  );
}

const holderInput = "h-9 w-28 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] placeholder:text-[var(--color-text-faint)]";

function RingForm({ initial, onCancel, onSaved }: { initial: Ring | null; onCancel: () => void; onSaved: () => void }) {
  const isEdit = initial !== null;
  const [f, setF] = useState<RingInput>(() =>
    initial
      ? {
          domain: initial.domain, name: initial.name, codePrefix: initial.codePrefix, holderName: initial.holderName,
          holderUserId: initial.holderUserId, disciplines: initial.disciplines ?? "", heroTitle: initial.heroTitle ?? "",
          heroSubtitle: initial.heroSubtitle ?? "", focus: initial.focus ?? "", motto: initial.motto ?? "",
          accentColor: initial.accentColor ?? "#6D28D9",
          resources: initial.resources,
        }
      : { ...empty },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof RingInput>(k: K, v: RingInput[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.codePrefix.trim() || !f.holderName.trim()) {
      setError("Name, code prefix, and holder are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isEdit) await workApi.rings.update(initial!.id, f);
      else await workApi.rings.create(f);
      onSaved();
    } catch {
      setError("Could not save. That domain may already have a ring.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
      <h2 className="font-serif text-xl text-[var(--color-text)]">{isEdit ? `Edit ${initial!.name}` : "New ring"}</h2>
      {error && <p className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Domain">
          <select value={f.domain} onChange={(e) => set("domain", e.target.value)} disabled={isEdit} className={cls}>
            {DOMAINS.map((d) => <option key={d} value={d}>The {d}</option>)}
          </select>
        </Field>
        <Field label="Code prefix" hint={isEdit ? "Permanent" : "e.g. RES"}>
          <input value={f.codePrefix} onChange={(e) => set("codePrefix", e.target.value.toUpperCase())} disabled={isEdit} className={cls} />
        </Field>
        <Field label="Name"><input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="The Resonance" className={cls} /></Field>
        <Field label="Holder (founder)"><input value={f.holderName} onChange={(e) => set("holderName", e.target.value)} className={cls} /></Field>
        <Field label="Disciplines" wide><input value={f.disciplines ?? ""} onChange={(e) => set("disciplines", e.target.value)} placeholder="Music · Audio · Sound Design · Emotion" className={cls} /></Field>
        <Field label="Hero title"><input value={f.heroTitle ?? ""} onChange={(e) => set("heroTitle", e.target.value)} placeholder="Create Worlds Through Sound" className={cls} /></Field>
        <Field label="Hero subtitle"><input value={f.heroSubtitle ?? ""} onChange={(e) => set("heroSubtitle", e.target.value)} placeholder="Same notes. Greater realms." className={cls} /></Field>
        <Field label="Focus" wide><input value={f.focus ?? ""} onChange={(e) => set("focus", e.target.value)} className={cls} /></Field>
        <Field label="Motto" wide><input value={f.motto ?? ""} onChange={(e) => set("motto", e.target.value)} className={cls} /></Field>
        <Field label="Accent color">
          <div className="flex items-center gap-2">
            <input type="color" value={f.accentColor || "#6D28D9"} onChange={(e) => set("accentColor", e.target.value)} className="h-11 w-12 rounded-lg border border-[var(--color-line)] bg-transparent" />
            <input value={f.accentColor ?? ""} onChange={(e) => set("accentColor", e.target.value)} className={cls} />
          </div>
        </Field>
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Create ring"}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

const cls =
  "h-11 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] placeholder:text-[var(--color-text-faint)] disabled:opacity-60";

function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={"flex flex-col gap-1.5 " + (wide ? "sm:col-span-2" : "")}>
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}{hint && <span className="ml-2 normal-case tracking-normal text-[var(--color-text-faint)]/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
