"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/shared/Icons";
import { inviteAdminApi } from "@/features/onboarding/api/invite.api";
import type { InvitationCreated } from "@/features/onboarding/types/invite.types";
import type { OnboardingTemplate } from "@/features/onboarding/types/onboarding.types";

/**
 * Manager-facing panel to create a self-serve onboarding invitation. On success
 * it reveals the one-time code and a shareable link — shown once, never stored
 * in plaintext — for the manager to send to the new hire.
 */
export function InviteNewHire({
  companyId,
  templates,
}: {
  companyId: string;
  templates: OnboardingTemplate[];
}) {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<InvitationCreated | null>(null);
  const [copied, setCopied] = useState(false);

  const link =
    created && typeof window !== "undefined"
      ? `${window.location.origin}/onboarding/start?code=${encodeURIComponent(created.code)}`
      : "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!templateId || !email || !firstName || !lastName) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await inviteAdminApi.create(companyId, {
        templateId,
        email,
        firstName,
        lastName,
        title: title || undefined,
      });
      setCreated(result);
    } catch {
      setError("Could not create the invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setCreated(null);
    setTemplateId("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setTitle("");
    setCopied(false);
    setError(null);
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  if (!open) {
    return (
      <div className="mt-4">
        <Button variant="outline" onClick={() => setOpen(true)} disabled={templates.length === 0}>
          + Invite a new hire (self-serve)
        </Button>
        {templates.length === 0 && (
          <p className="mt-2 text-xs text-[var(--color-text-faint)]">
            Add an onboarding template first.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      {created ? (
        <div>
          <div className="flex items-center gap-2 text-[var(--color-gold)]">
            <IconCheck size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Invitation created</h3>
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Send this code to {created.email}. It&apos;s shown once — they redeem it at the
            onboarding page to set up their record and complete onboarding themselves.
          </p>

          <div className="mt-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-faint)]">
              Invite code
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="flex-1 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 py-2.5 font-mono text-lg tracking-[0.2em] text-[var(--color-text)]">
                {created.code}
              </code>
              <Button variant="outline" onClick={() => copy(created.code)}>
                Copy
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-faint)]">
              Shareable link
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                readOnly
                value={link}
                className="flex-1 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 py-2.5 text-sm text-[var(--color-text-muted)] outline-none"
              />
              <Button variant="outline" onClick={() => copy(link)}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <p className="mt-4 text-xs text-[var(--color-text-faint)]">
            Expires {new Date(created.expiresAtUtc).toLocaleDateString()}.
          </p>

          <div className="mt-5 flex gap-3">
            <Button onClick={reset}>Invite another</Button>
            <Button variant="ghost" onClick={() => { reset(); setOpen(false); }}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Invite a new hire
          </h3>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            They&apos;ll receive a code, redeem it publicly, and onboard themselves — no need to
            create an employee record first.
          </p>

          {error && <p className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Labeled label="First name">
              <TextInput value={firstName} onChange={setFirstName} required />
            </Labeled>
            <Labeled label="Last name">
              <TextInput value={lastName} onChange={setLastName} required />
            </Labeled>
            <Labeled label="Email">
              <TextInput value={email} onChange={setEmail} type="email" required />
            </Labeled>
            <Labeled label="Role / title">
              <TextInput value={title} onChange={setTitle} placeholder="e.g. Kitchen Team Member" />
            </Labeled>
          </div>

          <div className="mt-3">
            <Labeled label="Onboarding template">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
              >
                <option value="">Select template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Labeled>
          </div>

          <div className="mt-5 flex gap-3">
            <Button
              type="submit"
              disabled={submitting || !templateId || !email || !firstName || !lastName}
            >
              {submitting ? "Creating…" : "Create invitation"}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
    />
  );
}
