"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useActiveCompany } from "@/features/portal/context/ActiveCompanyProvider";
import { employeesApi } from "@/features/employees/api/employees.api";
import type { Employee } from "@/features/employees/types/employee.types";
import { onboardingApi } from "@/features/onboarding/api/onboarding.api";
import { OnboardingProcessCard } from "@/features/onboarding/components/OnboardingProcessCard";
import type {
  OnboardingProcess,
  OnboardingTemplate,
} from "@/features/onboarding/types/onboarding.types";

export function OnboardingView() {
  const { activeCompany, activeCompanyId } = useActiveCompany();
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [processes, setProcesses] = useState<OnboardingProcess[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [employeeId, setEmployeeId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [starting, setStarting] = useState(false);

  const load = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const [t, p, e] = await Promise.all([
        onboardingApi.templates(companyId),
        onboardingApi.processes(companyId),
        employeesApi.list(companyId),
      ]);
      setTemplates(t);
      setProcesses(p);
      setEmployees(e);
    } catch {
      setError("Could not load onboarding.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeCompanyId) load(activeCompanyId);
  }, [activeCompanyId, load]);

  const employeeName = useMemo(() => {
    const map = new Map(employees.map((e) => [e.id, e.fullName]));
    return (id: string) => map.get(id) ?? "Employee";
  }, [employees]);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCompanyId || !employeeId || !templateId) return;
    setStarting(true);
    try {
      const created = await onboardingApi.start(activeCompanyId, employeeId, templateId);
      setProcesses((prev) => [created, ...prev]);
      setEmployeeId("");
      setTemplateId("");
    } finally {
      setStarting(false);
    }
  }

  function onProcessChange(updated: OnboardingProcess) {
    setProcesses((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
        Onboarding
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        {activeCompany ? activeCompany.companyName : "Select a company"} · reusable
        templates, shared tracking
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-sm text-[var(--color-danger)]">{error}</p>
      ) : (
        <>
          {/* Start */}
          <form
            onSubmit={start}
            className="mt-8 flex flex-wrap items-end gap-3 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
          >
            <Field label="Employee">
              <Select value={employeeId} onChange={setEmployeeId} placeholder="Select employee">
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Template">
              <Select value={templateId} onChange={setTemplateId} placeholder="Select template">
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Button type="submit" disabled={starting || !employeeId || !templateId}>
              {starting ? "Starting…" : "Start onboarding"}
            </Button>
          </form>

          {templates.length === 0 && (
            <p className="mt-4 text-sm text-[var(--color-text-faint)]">
              No onboarding templates for this company yet.
            </p>
          )}

          {/* Active processes */}
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            In progress
          </h2>
          {processes.length === 0 ? (
            <div className="mt-4 rounded-[var(--radius)] border border-dashed border-[var(--color-line)] p-10 text-center text-sm text-[var(--color-text-muted)]">
              No onboarding in progress.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {processes.map((p) => (
                <OnboardingProcessCard
                  key={p.id}
                  process={p}
                  employeeName={employeeName(p.employeeId)}
                  onChange={onProcessChange}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 min-w-52 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
}
