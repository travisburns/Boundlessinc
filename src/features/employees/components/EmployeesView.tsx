"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useActiveCompany } from "@/features/portal/context/ActiveCompanyProvider";
import { employeesApi } from "@/features/employees/api/employees.api";
import { AddEmployeeForm } from "@/features/employees/components/AddEmployeeForm";
import { EmployeeStatusBadge } from "@/features/employees/components/EmployeeStatusBadge";
import type { Employee } from "@/features/employees/types/employee.types";

export function EmployeesView() {
  const { activeCompany, activeCompanyId } = useActiveCompany();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      setEmployees(await employeesApi.list(companyId));
    } catch {
      setError("Could not load employees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeCompanyId) load(activeCompanyId);
  }, [activeCompanyId, load]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
            Employees
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {activeCompany ? activeCompany.companyName : "Select a company"}
          </p>
        </div>
        {!adding && activeCompanyId && (
          <Button size="sm" onClick={() => setAdding(true)}>
            Add employee
          </Button>
        )}
      </div>

      {adding && activeCompanyId && (
        <div className="mt-6">
          <AddEmployeeForm
            companyId={activeCompanyId}
            onCancel={() => setAdding(false)}
            onCreated={(created) => {
              setEmployees((prev) => [...prev, created].sort((a, b) => a.lastName.localeCompare(b.lastName)));
              setAdding(false);
            }}
          />
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading employees…</p>
        ) : error ? (
          <p className="text-sm text-[var(--color-danger)]">{error}</p>
        ) : employees.length === 0 ? (
          <div className="rounded-[var(--radius)] border border-dashed border-[var(--color-line)] p-10 text-center text-sm text-[var(--color-text-muted)]">
            No employees yet. Add the first one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-line)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-b border-[var(--color-line)] last:border-0">
                    <td className="px-4 py-3">
                      <div className="text-[var(--color-text)]">{e.fullName}</div>
                      <div className="text-xs text-[var(--color-text-faint)]">{e.email}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{e.title ?? "—"}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{e.department ?? "—"}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">
                      {e.employmentType?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <EmployeeStatusBadge status={e.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
