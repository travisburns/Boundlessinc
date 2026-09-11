"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/shared/Icons";
import { inviteAdminApi } from "@/features/onboarding/api/invite.api";
import type { InvitationCreated, OnboardingRequest } from "@/features/onboarding/types/invite.types";
import type { OnboardingTemplate } from "@/features/onboarding/types/onboarding.types";

/**
 * Admin panel: pending "request to onboard" submissions. Approving one lets the
 * admin pick a template and issues the invitation code (shown once); declining
 * removes it from the queue.
 */
export function PendingRequests({
  companyId,
  templates,
}: {
  companyId: string;
  templates: OnboardingTemplate[];
}) {
  const [requests, setRequests] = useState<OnboardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [issued, setIssued] = useState<Record<string, InvitationCreated>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRequests(await inviteAdminApi.requests(companyId));
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    void load();
  }, [load]);

  function onApproved(requestId: string, created: InvitationCreated) {
    setIssued((prev) => ({ ...prev, [requestId]: created }));
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  }

  async function decline(requestId: string) {
    await inviteAdminApi.declineRequest(companyId, requestId);
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  }

  const issuedList = Object.entries(issued);

  if (loading) return null;
  if (requests.length === 0 && issuedList.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
        Onboarding requests
        {requests.length > 0 && (
          <span className="ml-2 rounded-full bg-[var(--color-gold)]/15 px-2 py-0.5 text-xs text-[var(--color-gold)]">
            {requests.length}
          </span>
        )}
      </h2>

      <div className="mt-3 space-y-3">
        {requests.map((r) => (
          <RequestRow
            key={r.id}
            request={r}
            companyId={companyId}
            templates={templates}
            onApproved={(c) => onApproved(r.id, c)}
            onDecline={() => decline(r.id)}
          />
        ))}

        {issuedList.map(([requestId, created]) => (
          <IssuedRow key={requestId} created={created} />
        ))}
      </div>
    </div>
  );
}

function RequestRow({
  request,
  companyId,
  templates,
  onApproved,
  onDecline,
}: {
  request: OnboardingRequest;
  companyId: string;
  templates: OnboardingTemplate[];
  onApproved: (created: InvitationCreated) => void;
  onDecline: () => void;
}) {
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    if (!templateId) {
      setError("Pick a template first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await inviteAdminApi.approveRequest(companyId, request.id, {
        templateId,
        title: request.desiredRole || undefined,
      });
      onApproved(created);
    } catch {
      setError("Could not approve. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-[var(--color-text)]">
            {request.firstName} {request.lastName}
          </p>
          <p className="truncate text-xs text-[var(--color-text-faint)]">
            {request.email}
            {request.desiredRole ? ` · ${request.desiredRole}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="h-9 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
          >
            {templates.length === 0 && <option value="">No templates</option>}
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={approve} disabled={busy || !templateId}>
            {busy ? "Approving…" : "Approve"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onDecline} disabled={busy}>
            Decline
          </Button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

function IssuedRow({ created }: { created: InvitationCreated }) {
  const [copied, setCopied] = useState(false);
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/onboarding/start?code=${encodeURIComponent(created.code)}`
      : "";

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-gold)]/40 bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-2 text-[var(--color-gold)]">
        <IconCheck size={16} />
        <span className="text-sm font-semibold">Approved — code issued for {created.email}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3 py-2 font-mono tracking-[0.15em] text-[var(--color-text)]">
          {created.code}
        </code>
        <Button size="sm" variant="outline" onClick={() => copy(created.code)}>
          Copy code
        </Button>
        <Button size="sm" variant="outline" onClick={() => copy(link)}>
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-faint)]">
        Shown once — send it to the new hire. Expires {new Date(created.expiresAtUtc).toLocaleDateString()}.
      </p>
    </div>
  );
}
