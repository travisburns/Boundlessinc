"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatTile } from "@/components/ui/StatTile";
import { useActiveCompany } from "@/features/portal/context/ActiveCompanyProvider";
import { paymentsApi } from "@/features/payments/api/payments.api";
import { formatMoney } from "@/lib/formatting/money";
import type {
  Invoice,
  InvoiceStatus,
  Payment,
  PaymentStatus,
  Subscription,
} from "@/features/payments/types/payment.types";

const invoiceTone: Record<InvoiceStatus, "success" | "warning" | "neutral"> = {
  Paid: "success",
  Open: "warning",
  Draft: "neutral",
  Void: "neutral",
};
const paymentTone: Record<PaymentStatus, "success" | "warning" | "danger" | "neutral"> = {
  Succeeded: "success",
  Pending: "warning",
  Failed: "danger",
  Refunded: "neutral",
};

export function PaymentsView() {
  const { activeCompany, activeCompanyId } = useActiveCompany();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const load = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const [inv, pay, subs] = await Promise.all([
        paymentsApi.invoices(companyId),
        paymentsApi.payments(companyId),
        paymentsApi.subscriptions(companyId),
      ]);
      setInvoices(inv);
      setPayments(pay);
      setSubscriptions(subs);
    } catch {
      setError("Could not load billing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeCompanyId) load(activeCompanyId);
  }, [activeCompanyId, load]);

  async function pay(invoiceId: string) {
    if (!activeCompanyId) return;
    setPayingId(invoiceId);
    try {
      await paymentsApi.payInvoice(activeCompanyId, invoiceId);
      await load(activeCompanyId);
    } finally {
      setPayingId(null);
    }
  }

  const outstanding = invoices
    .filter((i) => i.status === "Open")
    .reduce((sum, i) => sum + i.total, 0);
  const mrr = subscriptions
    .filter((s) => s.status === "Active")
    .reduce((sum, s) => sum + s.monthlyRecurringRevenue, 0);
  const collected = payments
    .filter((p) => p.status === "Succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
        Payments
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        {activeCompany ? activeCompany.companyName : "Select a company"} · company-aware billing
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-sm text-[var(--color-danger)]">{error}</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatTile label="Outstanding" value={formatMoney(outstanding)} hint="Open invoices" />
            <StatTile label="Collected" value={formatMoney(collected)} hint="Succeeded payments" />
            <StatTile label="MRR" value={formatMoney(mrr)} hint="Active subscriptions" />
          </div>

          <Section title="Invoices">
            {invoices.length === 0 ? (
              <Empty>No invoices yet.</Empty>
            ) : (
              <Table head={["Invoice", "Customer", "Total", "Status", ""]}>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-b border-[var(--color-line)] last:border-0">
                    <Td>{i.number}</Td>
                    <Td muted>{i.customerName ?? "—"}</Td>
                    <Td>{formatMoney(i.total, i.currency)}</Td>
                    <Td>
                      <Badge tone={invoiceTone[i.status]}>{i.status}</Badge>
                    </Td>
                    <Td>
                      {i.status === "Open" && (
                        <Button size="sm" onClick={() => pay(i.id)} disabled={payingId === i.id}>
                          {payingId === i.id ? "Paying…" : "Pay"}
                        </Button>
                      )}
                    </Td>
                  </tr>
                ))}
              </Table>
            )}
          </Section>

          <Section title="Subscriptions">
            {subscriptions.length === 0 ? (
              <Empty>No subscriptions.</Empty>
            ) : (
              <Table head={["Plan", "Customer", "Amount", "MRR", "Status"]}>
                {subscriptions.map((s) => (
                  <tr key={s.id} className="border-b border-[var(--color-line)] last:border-0">
                    <Td>
                      {s.planName}
                      {s.tier && <span className="text-[var(--color-text-faint)]"> · {s.tier}</span>}
                    </Td>
                    <Td muted>{s.customerName ?? "—"}</Td>
                    <Td muted>
                      {formatMoney(s.amount, s.currency)}/{s.interval.toLowerCase()}
                    </Td>
                    <Td>{formatMoney(s.monthlyRecurringRevenue, s.currency)}</Td>
                    <Td>
                      <Badge tone={s.status === "Active" ? "success" : "neutral"}>{s.status}</Badge>
                    </Td>
                  </tr>
                ))}
              </Table>
            )}
          </Section>

          <Section title="Payment ledger">
            {payments.length === 0 ? (
              <Empty>No payments recorded.</Empty>
            ) : (
              <Table head={["Amount", "Method", "Reference", "Status"]}>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--color-line)] last:border-0">
                    <Td>{formatMoney(p.amount, p.currency)}</Td>
                    <Td muted>{p.method ?? "—"}</Td>
                    <Td muted>
                      <span className="font-mono text-xs">{p.externalId ?? "—"}</span>
                    </Td>
                    <Td>
                      <Badge tone={paymentTone[p.status]}>{p.status}</Badge>
                    </Td>
                  </tr>
                ))}
              </Table>
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-line)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td className={`px-4 py-3 ${muted ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
      {children}
    </td>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius)] border border-dashed border-[var(--color-line)] p-8 text-center text-sm text-[var(--color-text-muted)]">
      {children}
    </div>
  );
}
