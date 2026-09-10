export type InvoiceStatus = "Draft" | "Open" | "Paid" | "Void";
export type PaymentStatus = "Pending" | "Succeeded" | "Failed" | "Refunded";
export type SubscriptionStatus = "Active" | "PastDue" | "Canceled";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
}

export interface Invoice {
  id: string;
  companyId: string;
  customerId: string;
  customerName?: string | null;
  number: string;
  currency: string;
  status: InvoiceStatus;
  total: number;
  issuedAtUtc: string;
  dueAtUtc?: string | null;
  paidAtUtc?: string | null;
  items: InvoiceItem[];
}

export interface Payment {
  id: string;
  companyId: string;
  invoiceId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string | null;
  externalId?: string | null;
  processedAtUtc?: string | null;
}

export interface Subscription {
  id: string;
  companyId: string;
  customerId: string;
  customerName?: string | null;
  planName: string;
  tier?: string | null;
  amount: number;
  monthlyRecurringRevenue: number;
  currency: string;
  interval: string;
  status: SubscriptionStatus;
  startedAtUtc: string;
}
