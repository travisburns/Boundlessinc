"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/shared/Icons";
import { companiesApi } from "@/features/companies/api/companies.api";
import { requestApi } from "@/features/onboarding/api/invite.api";
import type { CompanySummary } from "@/features/companies/types/company.types";
import type { RequestSubmitted } from "@/features/onboarding/types/invite.types";

/**
 * Public "request to onboard" form. A prospective hire picks the company and
 * submits their details; an admin reviews and, on approval, a code is issued
 * and sent to them.
 */
export function RequestOnboardingForm() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<RequestSubmitted | null>(null);

  useEffect(() => {
    companiesApi
      .list()
      .then((list) => setCompanies(list.filter((c) => c.status === "Active")))
      .catch(() => setError("Couldn't load companies. Please try again later."));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyId || !firstName || !lastName || !email) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await requestApi.submit({
        companyId,
        firstName,
        lastName,
        email,
        desiredRole: desiredRole || undefined,
      });
      setDone(result);
    } catch {
      setError("Couldn't submit your request. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto mt-8 max-w-lg rounded-[var(--radius)] border border-[var(--color-gold)]/40 bg-[var(--color-surface)] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-gold)] text-[var(--color-gold)]">
          <IconCheck size={28} />
        </div>
        <h2 className="mt-5 font-serif text-xl text-[var(--color-text)]">Request sent</h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Thanks, {firstName}. Your request to onboard with {done.companyName} has been sent for
          review. Once it&apos;s approved you&apos;ll receive your onboarding code by email.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/onboarding">Have a code? Start onboarding</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-8 max-w-lg rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8"
    >
      {error && (
        <div className="mb-4 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">Company</span>
        <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} required className={cls}>
          <option value="">Select the company you&apos;re joining…</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--color-text-muted)]">First name</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={cls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--color-text-muted)]">Last name</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className={cls} />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={cls} />
      </label>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">
          Role you&apos;re joining as <span className="text-[var(--color-text-faint)]">(optional)</span>
        </span>
        <input
          value={desiredRole}
          onChange={(e) => setDesiredRole(e.target.value)}
          placeholder="e.g. Kitchen Team Member"
          className={cls}
        />
      </label>

      <div className="mt-7">
        <Button type="submit" size="lg" className="w-full" disabled={submitting || !companyId}>
          {submitting ? "Sending…" : "Request onboarding →"}
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-[var(--color-text-faint)]">
        An administrator reviews each request before a code is issued.
      </p>
    </form>
  );
}

const cls =
  "h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] placeholder:text-[var(--color-text-faint)]";
