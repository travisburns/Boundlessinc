import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  Invoice,
  Payment,
  Subscription,
} from "@/features/payments/types/payment.types";

const token = () => getToken() ?? undefined;
const base = (companyId: string) => `/api/companies/${companyId}/billing`;

export const paymentsApi = {
  invoices: (companyId: string) =>
    api.get<Invoice[]>(`${base(companyId)}/invoices`, { token: token(), cache: "no-store" }),

  payInvoice: (companyId: string, invoiceId: string) =>
    api.post<Payment>(`${base(companyId)}/invoices/${invoiceId}/pay`, { token: token() }),

  payments: (companyId: string) =>
    api.get<Payment[]>(`${base(companyId)}/payments`, { token: token(), cache: "no-store" }),

  subscriptions: (companyId: string) =>
    api.get<Subscription[]>(`${base(companyId)}/subscriptions`, { token: token(), cache: "no-store" }),
};
