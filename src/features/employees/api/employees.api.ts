import { api } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type {
  CreateEmployeeInput,
  Employee,
} from "@/features/employees/types/employee.types";

function authToken(): string | undefined {
  return getToken() ?? undefined;
}

/** Company-scoped employee data access (portal, authenticated). */
export const employeesApi = {
  list: (companyId: string) =>
    api.get<Employee[]>(`/api/companies/${companyId}/employees`, {
      token: authToken(),
      cache: "no-store",
    }),

  create: (companyId: string, input: CreateEmployeeInput) =>
    api.post<Employee>(`/api/companies/${companyId}/employees`, {
      token: authToken(),
      json: input,
    }),
};
