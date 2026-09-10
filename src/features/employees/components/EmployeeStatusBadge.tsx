import type { EmployeeStatus } from "@/features/employees/types/employee.types";

const styles: Record<EmployeeStatus, string> = {
  Active: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  Pending: "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  OnLeave: "bg-[var(--color-cosmic)]/20 text-[var(--color-cosmic-soft)]",
  Terminated: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
};

export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status.replace(/([a-z])([A-Z])/g, "$1 $2")}
    </span>
  );
}
