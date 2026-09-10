"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useActiveCompany } from "@/features/portal/context/ActiveCompanyProvider";
import { integrationsApi } from "@/features/integrations/api/integrations.api";
import type { Integration } from "@/features/integrations/types/integration.types";
import { API_BASE_URL } from "@/lib/api/client";

export function IntegrationsView() {
  const { activeCompany, activeCompanyId } = useActiveCompany();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const load = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      setIntegrations(await integrationsApi.list(companyId));
    } catch {
      setError("Could not load integrations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeCompanyId) load(activeCompanyId);
  }, [activeCompanyId, load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCompanyId || !name.trim()) return;
    setCreating(true);
    try {
      const result = await integrationsApi.create(activeCompanyId, name.trim());
      setNewKey(result.apiKey);
      setName("");
      await load(activeCompanyId);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
        Integrations
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        {activeCompany ? activeCompany.companyName : "Select a company"} · connect the operating
        app to push normalized events upward
      </p>

      {newKey && (
        <div className="mt-6 rounded-[var(--radius)] border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 p-5">
          <p className="text-sm font-medium text-[var(--color-text)]">
            API key created — copy it now. It won&apos;t be shown again.
          </p>
          <code className="mt-3 block break-all rounded-lg bg-[var(--color-void)] px-3 py-2 font-mono text-sm text-[var(--color-gold-soft)]">
            {newKey}
          </code>
          <button
            onClick={() => setNewKey(null)}
            className="mt-3 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            I&apos;ve saved it — dismiss
          </button>
        </div>
      )}

      <form
        onSubmit={create}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
      >
        <div className="min-w-64 flex-1">
          <Input
            label="New integration"
            placeholder="e.g. Firefin POS"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={creating || !name.trim()}>
          {creating ? "Creating…" : "Create integration"}
        </Button>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>
        ) : error ? (
          <p className="text-sm text-[var(--color-danger)]">{error}</p>
        ) : integrations.length === 0 ? (
          <div className="rounded-[var(--radius)] border border-dashed border-[var(--color-line)] p-10 text-center text-sm text-[var(--color-text-muted)]">
            No integrations yet. Create one to get an API key.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-line)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Key</th>
                  <th className="px-4 py-3 font-medium">Events</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((i) => (
                  <tr key={i.id} className="border-b border-[var(--color-line)] last:border-0">
                    <td className="px-4 py-3 text-[var(--color-text)]">{i.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">
                      {i.apiKeyPrefix}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[var(--color-text-muted)]">{i.eventCount}</td>
                    <td className="px-4 py-3">
                      <Badge tone={i.status === "Active" ? "success" : "neutral"}>{i.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-void)] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
          Pushing events
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Operating apps post normalized events with their API key:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--color-ink)] p-4 text-xs text-[var(--color-text-muted)]">
{`POST ${API_BASE_URL}/api/intelligence/events
X-Api-Key: <your key>
Content-Type: application/json

{ "eventType": "OrderCompleted", "revenue": 76.42, "currency": "USD" }`}
        </pre>
      </div>
    </div>
  );
}
