"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { employeesApi } from "@/features/employees/api/employees.api";
import type {
  CreateEmployeeInput,
  Employee,
  EmploymentType,
} from "@/features/employees/types/employee.types";
import { ApiError } from "@/lib/api/client";

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "FullTime",
  "PartTime",
  "Contract",
  "Temporary",
  "Intern",
];

export function AddEmployeeForm({
  companyId,
  onCreated,
  onCancel,
}: {
  companyId: string;
  onCreated: (employee: Employee) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CreateEmployeeInput>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    department: "",
    employmentType: "FullTime",
    startDate: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof CreateEmployeeInput>(key: K, value: CreateEmployeeInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      const created = await employeesApi.create(companyId, form);
      onCreated(created);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
        setError(err.message);
      } else {
        setError("Could not add employee. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const fe = (name: string) => fieldErrors[name]?.[0];

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6"
    >
      <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
        Add employee
      </h2>

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input label="First name" required value={form.firstName} error={fe("FirstName")} onChange={(e) => set("firstName", e.target.value)} />
        <Input label="Last name" required value={form.lastName} error={fe("LastName")} onChange={(e) => set("lastName", e.target.value)} />
        <Input label="Email" type="email" required value={form.email} error={fe("Email") ?? fe("email")} onChange={(e) => set("email", e.target.value)} />
        <Input label="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <Input label="Title" required value={form.title} error={fe("Title")} onChange={(e) => set("title", e.target.value)} />
        <Input label="Department" value={form.department} onChange={(e) => set("department", e.target.value)} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="employmentType" className="text-sm font-medium text-[var(--color-text-muted)]">
            Employment type
          </label>
          <select
            id="employmentType"
            value={form.employmentType}
            onChange={(e) => set("employmentType", e.target.value as EmploymentType)}
            className="h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </option>
            ))}
          </select>
        </div>

        <Input label="Start date" type="date" required value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add employee"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
