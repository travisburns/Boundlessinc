"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { companiesApi } from "@/features/companies/api/companies.api";
import type {
  CompanyDetail,
  CompanyInput,
  CompanyStatus,
  CompanyType,
} from "@/features/companies/types/company.types";

const TYPES: CompanyType[] = ["Holding", "Subsidiary", "Venture"];
const STATUSES: CompanyStatus[] = ["ComingSoon", "Active", "Inactive", "Archived"];

const emptyInput: CompanyInput = {
  name: "",
  slug: "",
  code: "",
  type: "Subsidiary",
  status: "ComingSoon",
  tagline: "",
  description: "",
  sector: "",
  accentColor: "#6D28D9",
  websiteUrl: "",
  domain: "",
  contactEmail: "",
  contactPhone: "",
  supportsEmployeeLogin: true,
  supportsPayments: true,
  sortOrder: 0,
};

export function CompanyManagementView() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<CompanyDetail | "new" | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCompanies(await companiesApi.listAll());
    } catch {
      setError("Could not load companies. You may not have admin access.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function onSaved(saved: CompanyDetail) {
    setCompanies((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      const next = exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [...prev, saved];
      return next.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
    });
    setEditing(null);
  }

  if (user && !user.isPlatformAdmin) {
    return (
      <div className="mx-auto max-w-3xl">
        <Heading />
        <p className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-muted)]">
          Managing the portfolio is limited to platform administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <Heading />
        {editing === null && (
          <Button onClick={() => setEditing("new")}>+ Add company</Button>
        )}
      </div>

      {editing !== null ? (
        <CompanyForm
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={onSaved}
        />
      ) : loading ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-sm text-[var(--color-danger)]">{error}</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {companies.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-4 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
            >
              <span
                className="h-9 w-9 shrink-0 rounded-full border border-[var(--color-line)]"
                style={{ background: c.accentColor ?? "var(--color-surface-2)" }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-[var(--color-text)]">{c.name}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="truncate text-xs text-[var(--color-text-faint)]">
                  {c.code} · /{c.slug} · {c.type}
                  {c.sector ? ` · ${c.sector}` : ""}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing(c)}>
                Edit
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Heading() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
        Companies
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Add and customize the companies in the portfolio.
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: CompanyStatus }) {
  const tone: "success" | "info" | "neutral" =
    status === "Active" ? "success" : status === "ComingSoon" ? "info" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}

function CompanyForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: CompanyDetail | null;
  onCancel: () => void;
  onSaved: (c: CompanyDetail) => void;
}) {
  const isEdit = initial !== null;
  const [form, setForm] = useState<CompanyInput>(() =>
    initial ? toInput(initial) : { ...emptyInput },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof CompanyInput>(key: K, value: CompanyInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = isEdit
        ? await companiesApi.update(initial!.id, form)
        : await companiesApi.create(form);
      onSaved(saved);
    } catch {
      setError("Could not save. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6"
    >
      <h2 className="font-serif text-xl text-[var(--color-text)]">
        {isEdit ? `Edit ${initial!.name}` : "New company"}
      </h2>

      {error && <p className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Name" required>
          <Text value={form.name} onChange={(v) => set("name", v)} />
        </Field>
        <Field label="Sector">
          <Text value={form.sector ?? ""} onChange={(v) => set("sector", v)} placeholder="e.g. Food / Hospitality" />
        </Field>

        <Field label="Slug" hint={isEdit ? "Permanent" : "Auto from name if blank"}>
          <Text value={form.slug ?? ""} onChange={(v) => set("slug", v)} disabled={isEdit} placeholder="auto" />
        </Field>
        <Field label="Code" hint={isEdit ? "Permanent" : "Auto from name if blank"}>
          <Text value={form.code ?? ""} onChange={(v) => set("code", v)} disabled={isEdit} placeholder="auto" />
        </Field>

        <Field label="Type">
          <Select value={form.type} onChange={(v) => set("type", v as CompanyType)} options={TYPES} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={(v) => set("status", v as CompanyStatus)} options={STATUSES} />
        </Field>

        <Field label="Tagline" wide>
          <Text value={form.tagline ?? ""} onChange={(v) => set("tagline", v)} placeholder="Short one-line positioning" />
        </Field>
        <Field label="Description" wide>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className={inputCls + " min-h-[5rem] py-2.5"}
          />
        </Field>

        <Field label="Accent color">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.accentColor || "#6D28D9"}
              onChange={(e) => set("accentColor", e.target.value)}
              className="h-11 w-12 rounded-lg border border-[var(--color-line)] bg-transparent"
            />
            <Text value={form.accentColor ?? ""} onChange={(v) => set("accentColor", v)} />
          </div>
        </Field>
        <Field label="Sort order">
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field label="Website URL">
          <Text value={form.websiteUrl ?? ""} onChange={(v) => set("websiteUrl", v)} placeholder="https://" />
        </Field>
        <Field label="Domain">
          <Text value={form.domain ?? ""} onChange={(v) => set("domain", v)} placeholder="example.com" />
        </Field>

        <Field label="Contact email">
          <Text value={form.contactEmail ?? ""} onChange={(v) => set("contactEmail", v)} type="email" />
        </Field>
        <Field label="Contact phone">
          <Text value={form.contactPhone ?? ""} onChange={(v) => set("contactPhone", v)} type="tel" />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-5">
        <Check label="Employee login" checked={form.supportsEmployeeLogin} onChange={(v) => set("supportsEmployeeLogin", v)} />
        <Check label="Payments" checked={form.supportsPayments} onChange={(v) => set("supportsPayments", v)} />
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create company"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

const inputCls =
  "h-11 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] placeholder:text-[var(--color-text-faint)] disabled:opacity-60";

function Field({
  label,
  hint,
  required,
  wide,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={"flex flex-col gap-1.5 " + (wide ? "sm:col-span-2" : "")}>
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
        {required && <span className="text-[var(--color-gold)]"> *</span>}
        {hint && <span className="ml-2 normal-case tracking-normal text-[var(--color-text-faint)]/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Text({
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--color-gold)]"
      />
      {label}
    </label>
  );
}

function toInput(c: CompanyDetail): CompanyInput {
  return {
    name: c.name,
    slug: c.slug,
    code: c.code,
    type: c.type,
    status: c.status,
    tagline: c.tagline ?? "",
    description: c.description ?? "",
    sector: c.sector ?? "",
    accentColor: c.accentColor ?? "#6D28D9",
    websiteUrl: c.websiteUrl ?? "",
    domain: c.domain ?? "",
    contactEmail: c.contactEmail ?? "",
    contactPhone: c.contactPhone ?? "",
    supportsEmployeeLogin: c.supportsEmployeeLogin,
    supportsPayments: c.supportsPayments,
    sortOrder: c.sortOrder,
  };
}
