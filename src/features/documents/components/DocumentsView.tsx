"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useActiveCompany } from "@/features/portal/context/ActiveCompanyProvider";
import { employeesApi } from "@/features/employees/api/employees.api";
import type { Employee } from "@/features/employees/types/employee.types";
import { documentsApi } from "@/features/documents/api/documents.api";
import type {
  CompanyDocument,
  CreateDocumentInput,
  DocumentAssignment,
  DocumentType,
} from "@/features/documents/types/document.types";

const DOC_TYPES: DocumentType[] = ["Policy", "Agreement", "Onboarding", "Resource"];

export function DocumentsView() {
  const { activeCompany, activeCompanyId } = useActiveCompany();
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [assignments, setAssignments] = useState<DocumentAssignment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const [docs, asgs, emps] = await Promise.all([
        documentsApi.list(companyId),
        documentsApi.assignments(companyId),
        employeesApi.list(companyId),
      ]);
      setDocuments(docs);
      setAssignments(asgs);
      setEmployees(emps);
    } catch {
      setError("Could not load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeCompanyId) load(activeCompanyId);
  }, [activeCompanyId, load]);

  async function assign(documentId: string, employeeId: string) {
    if (!activeCompanyId || !employeeId) return;
    setBusy(documentId);
    try {
      await documentsApi.assign(activeCompanyId, documentId, employeeId);
      await load(activeCompanyId);
    } finally {
      setBusy(null);
    }
  }

  async function acknowledge(assignmentId: string) {
    if (!activeCompanyId) return;
    setBusy(assignmentId);
    try {
      await documentsApi.acknowledge(activeCompanyId, assignmentId);
      await load(activeCompanyId);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
            Documents
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {activeCompany ? activeCompany.companyName : "Select a company"} · policies,
            agreements, and resources
          </p>
        </div>
        {!adding && activeCompanyId && (
          <Button size="sm" onClick={() => setAdding(true)}>
            Add document
          </Button>
        )}
      </div>

      {adding && activeCompanyId && (
        <div className="mt-6">
          <AddDocumentForm
            onCancel={() => setAdding(false)}
            onCreate={async (input) => {
              await documentsApi.create(activeCompanyId, input);
              setAdding(false);
              await load(activeCompanyId);
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-sm text-[var(--color-danger)]">{error}</p>
      ) : (
        <>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Library
          </h2>
          {documents.length === 0 ? (
            <Empty>No documents yet.</Empty>
          ) : (
            <div className="mt-4 space-y-3">
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-text)]">{d.title}</span>
                      <Badge tone="info">{d.type}</Badge>
                    </div>
                    {d.description && (
                      <p className="mt-0.5 truncate text-xs text-[var(--color-text-faint)]">{d.description}</p>
                    )}
                    <p className="mt-1 text-xs text-[var(--color-text-faint)]">
                      {d.acknowledgedCount}/{d.assignedCount} acknowledged · v{d.version}
                    </p>
                  </div>
                  <AssignControl
                    employees={employees}
                    busy={busy === d.id}
                    onAssign={(employeeId) => assign(d.id, employeeId)}
                  />
                </div>
              ))}
            </div>
          )}

          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Assignments
          </h2>
          {assignments.length === 0 ? (
            <Empty>No assignments yet. Assign a document to an employee above.</Empty>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-[var(--radius)] border border-[var(--color-line)]">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Document</th>
                    <th className="px-4 py-3 font-medium">Employee</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id} className="border-b border-[var(--color-line)] last:border-0">
                      <td className="px-4 py-3 text-[var(--color-text)]">{a.documentTitle}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">{a.employeeName ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge tone={a.status === "Acknowledged" ? "success" : "warning"}>{a.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {a.status === "Assigned" && (
                          <Button size="sm" variant="outline" disabled={busy === a.id} onClick={() => acknowledge(a.id)}>
                            {busy === a.id ? "…" : "Acknowledge"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AssignControl({
  employees,
  busy,
  onAssign,
}: {
  employees: Employee[];
  busy: boolean;
  onAssign: (employeeId: string) => void;
}) {
  const [value, setValue] = useState("");
  if (employees.length === 0) {
    return <span className="text-xs text-[var(--color-text-faint)]">No employees</span>;
  }
  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => {
        setValue("");
        onAssign(e.target.value);
      }}
      className="h-9 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
    >
      <option value="">{busy ? "Assigning…" : "Assign to…"}</option>
      {employees.map((e) => (
        <option key={e.id} value={e.id}>
          {e.fullName}
        </option>
      ))}
    </select>
  );
}

function AddDocumentForm({
  onCreate,
  onCancel,
}: {
  onCreate: (input: CreateDocumentInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CreateDocumentInput>({ title: "", type: "Policy", description: "" });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate(form);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
      <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">Add document</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input label="Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-muted)]">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as DocumentType }))}
            className="h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
          >
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add document"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-[var(--radius)] border border-dashed border-[var(--color-line)] p-8 text-center text-sm text-[var(--color-text-muted)]">
      {children}
    </div>
  );
}
