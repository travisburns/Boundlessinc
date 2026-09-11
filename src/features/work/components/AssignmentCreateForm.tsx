"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { workApi } from "@/features/work/api/work.api";
import type { AssignmentInput, AssignmentPriority, AssignmentType } from "@/features/work/types/work.types";

const TYPES: AssignmentType[] = ["Create", "Build", "Research", "Review", "Decide", "Maintain", "Fix", "Deliver", "Plan"];
const PRIORITIES: AssignmentPriority[] = ["Low", "Normal", "High", "Critical"];

export function AssignmentCreateForm({ ringId, onDone }: { ringId: string; onDone: () => void }) {
  const [f, setF] = useState<AssignmentInput>({
    title: "", type: "Create", priority: "Normal", summary: "", objective: "", deliverable: "",
    dueDate: "", nextStep: "", issuedBy: "The Crown", assigneeName: "", reviewRequired: false,
  });
  const [criteria, setCriteria] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof AssignmentInput>(k: K, v: AssignmentInput[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await workApi.rings.createAssignment(ringId, {
        ...f,
        dueDate: f.dueDate || null,
        acceptanceCriteria: criteria.split("\n").map((s) => s.trim()).filter(Boolean),
      });
      onDone();
    } catch {
      setError("Could not create the assignment. Try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
      {error && <p className="mb-3 text-sm text-[var(--color-danger)]">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" wide><input value={f.title} onChange={(e) => set("title", e.target.value)} className={cls} /></Field>
        <Field label="Type">
          <select value={f.type} onChange={(e) => set("type", e.target.value as AssignmentType)} className={cls}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select value={f.priority} onChange={(e) => set("priority", e.target.value as AssignmentPriority)} className={cls}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Summary" wide><input value={f.summary ?? ""} onChange={(e) => set("summary", e.target.value)} className={cls} /></Field>
        <Field label="Objective" wide><textarea value={f.objective ?? ""} onChange={(e) => set("objective", e.target.value)} rows={2} className={cls + " h-auto py-2.5"} /></Field>
        <Field label="Deliverable" wide><textarea value={f.deliverable ?? ""} onChange={(e) => set("deliverable", e.target.value)} rows={2} className={cls + " h-auto py-2.5"} /></Field>
        <Field label="Acceptance criteria (one per line)" wide>
          <textarea value={criteria} onChange={(e) => setCriteria(e.target.value)} rows={3} className={cls + " h-auto py-2.5"} />
        </Field>
        <Field label="Due date"><input type="date" value={f.dueDate ?? ""} onChange={(e) => set("dueDate", e.target.value)} className={cls} /></Field>
        <Field label="Next step"><input value={f.nextStep ?? ""} onChange={(e) => set("nextStep", e.target.value)} className={cls} /></Field>
        <Field label="Assignee"><input value={f.assigneeName ?? ""} onChange={(e) => set("assigneeName", e.target.value)} placeholder="Defaults to the ring holder" className={cls} /></Field>
        <Field label="Issued by"><input value={f.issuedBy ?? ""} onChange={(e) => set("issuedBy", e.target.value)} className={cls} /></Field>
      </div>
      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create assignment"}</Button>
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  );
}

const cls =
  "h-11 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] placeholder:text-[var(--color-text-faint)]";

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={"flex flex-col gap-1.5 " + (wide ? "sm:col-span-2" : "")}>
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-faint)]">{label}</span>
      {children}
    </label>
  );
}
