"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { OnboardingEmployeeStep } from "@/features/onboarding/types/onboarding.types";
import { stepFields, stepIntro, policyBody, type FieldDef } from "@/features/onboarding/stepForms";

/**
 * Renders the real form for one onboarding step (based on its kind), captures
 * the hire's input, and hands back the data as a JSON string on submit.
 */
export function StepForm({
  step,
  busy,
  onSubmit,
  onBack,
  canGoBack,
}: {
  step: OnboardingEmployeeStep;
  busy: boolean;
  onSubmit: (responseJson: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}) {
  const fields = useMemo(() => stepFields[step.kind] ?? [], [step.kind]);
  const initial = useMemo(() => {
    const base: Record<string, string> = {};
    for (const f of fields) base[f.name] = "";
    if (step.responseJson) {
      try {
        Object.assign(base, JSON.parse(step.responseJson));
      } catch {
        /* ignore malformed saved data */
      }
    }
    return base;
  }, [fields, step.responseJson]);

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [accepted, setAccepted] = useState<boolean>(() => {
    if (step.kind !== "PolicyAcknowledgement") return false;
    try {
      return step.responseJson ? JSON.parse(step.responseJson).accepted === true : false;
    } catch {
      return false;
    }
  });
  const [error, setError] = useState<string | null>(null);

  function set(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (step.kind === "PolicyAcknowledgement") {
      if (!accepted) {
        setError("Please tick the box to accept before continuing.");
        return;
      }
      onSubmit(JSON.stringify({ accepted: true, acceptedAt: new Date().toISOString() }));
      return;
    }

    const missing = fields.find((f) => f.required && !values[f.name]?.trim());
    if (missing) {
      setError(`Please fill in “${missing.label}.”`);
      return;
    }

    const payload: Record<string, string> = {};
    for (const f of fields) {
      const val = values[f.name]?.trim();
      if (val) payload[f.name] = val;
    }
    onSubmit(JSON.stringify(payload));
  }

  return (
    <form onSubmit={submit} className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-xl text-[var(--color-text)]">{step.name}</h2>
        {!step.isRequired && (
          <span className="u-micro text-[var(--color-text-faint)]">Optional</span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{stepIntro[step.kind]}</p>

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {step.kind === "PolicyAcknowledgement" ? (
        <div className="mt-5">
          <div className="max-h-56 overflow-y-auto rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/30 p-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
            {policyBody(step.name)}
          </div>
          <label className="mt-4 flex items-start gap-3 text-sm text-[var(--color-text)]">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--color-gold)]"
            />
            <span>I have read and accept {step.name.replace(/policy/i, "").trim() || "this policy"}.</span>
          </label>
        </div>
      ) : fields.length === 0 ? (
        <p className="mt-5 text-sm text-[var(--color-text-muted)]">
          Nothing to fill in here — confirm to mark this step complete.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <Field key={f.name} field={f} value={values[f.name] ?? ""} onChange={(v) => set(f.name, v)} />
          ))}
        </div>
      )}

      <div className="mt-7 flex items-center justify-between gap-3">
        {canGoBack ? (
          <Button type="button" variant="ghost" onClick={onBack} disabled={busy}>
            ← Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Saving…" : step.isCompleted ? "Save & continue →" : "Continue →"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const cls =
    "h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] placeholder:text-[var(--color-text-faint)]";
  return (
    <label className={"flex flex-col gap-1.5 " + (field.wide ? "sm:col-span-2" : "")}>
      <span className="text-sm font-medium text-[var(--color-text-muted)]">
        {field.label}
        {field.required && <span className="text-[var(--color-gold)]"> *</span>}
      </span>
      {field.type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={cls}>
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={cls.replace("h-11", "min-h-[5rem] py-2.5")}
        />
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className={cls}
        />
      )}
    </label>
  );
}
