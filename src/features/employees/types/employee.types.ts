export type EmployeeStatus = "Pending" | "Active" | "OnLeave" | "Terminated";
export type EmploymentType =
  | "FullTime"
  | "PartTime"
  | "Contract"
  | "Temporary"
  | "Intern";

/** Mirrors the backend EmployeeDto. */
export interface Employee {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  status: EmployeeStatus;
  title?: string | null;
  department?: string | null;
  employmentType?: EmploymentType | null;
  startDate?: string | null;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  department?: string;
  employmentType: EmploymentType;
  startDate: string; // yyyy-MM-dd
}
