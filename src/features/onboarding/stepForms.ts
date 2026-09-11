import type { OnboardingStepKind } from "@/features/onboarding/types/onboarding.types";

export type FieldType = "text" | "tel" | "email" | "date" | "number" | "select" | "textarea";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  maxLength?: number;
  /** Render on its own full-width row instead of the two-column grid. */
  wide?: boolean;
}

/** A short blurb shown above the fields for each kind. */
export const stepIntro: Record<OnboardingStepKind, string> = {
  PersonalInfo: "Tell us who you are and where to reach you.",
  EmergencyContact: "Who should we contact in an emergency?",
  TaxPayroll: "Basic tax details so payroll can set you up.",
  DirectDeposit: "Where should your pay be deposited?",
  PolicyAcknowledgement: "Please read and accept the policy below.",
  ITAccess: "Let's get your accounts and equipment sorted.",
  Availability: "When are you generally available to work?",
  Generic: "Review and confirm to continue.",
};

/** The policy text shown for acknowledgement steps, keyed loosely by step name. */
export function policyBody(stepName: string): string {
  const n = stepName.toLowerCase();
  if (n.includes("food") || n.includes("hygiene"))
    return "I have read and agree to follow all food safety, hygiene, and handling procedures, including handwashing, temperature control, allergen handling, and reporting illness before a shift.";
  if (n.includes("nda") || n.includes("ip") || n.includes("confidential"))
    return "I agree to keep all proprietary information, unreleased work, and trade secrets confidential, and I assign to the company all intellectual property I create within the scope of my role.";
  if (n.includes("security") || n.includes("acceptable use"))
    return "I agree to the acceptable use and information security policy: I will protect credentials, use approved systems, report incidents promptly, and handle customer and company data responsibly.";
  return "I have read, understood, and agree to abide by the company code of conduct and workplace policies.";
}

export const stepFields: Record<OnboardingStepKind, FieldDef[]> = {
  Generic: [],
  PolicyAcknowledgement: [],
  PersonalInfo: [
    { name: "legalFirstName", label: "Legal first name", type: "text", required: true },
    { name: "legalLastName", label: "Legal last name", type: "text", required: true },
    { name: "preferredName", label: "Preferred name", type: "text" },
    { name: "dateOfBirth", label: "Date of birth", type: "date" },
    { name: "phone", label: "Phone", type: "tel", required: true },
    { name: "email", label: "Personal email", type: "email" },
    { name: "addressLine1", label: "Address", type: "text", required: true, wide: true },
    { name: "addressLine2", label: "Apt / unit", type: "text", wide: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "state", label: "State / region", type: "text", required: true },
    { name: "postalCode", label: "Postal code", type: "text", required: true },
  ],
  EmergencyContact: [
    { name: "contactName", label: "Contact name", type: "text", required: true },
    { name: "relationship", label: "Relationship", type: "text", required: true },
    { name: "contactPhone", label: "Phone", type: "tel", required: true },
    { name: "altPhone", label: "Alternate phone", type: "tel" },
  ],
  TaxPayroll: [
    { name: "filingStatus", label: "Filing status", type: "select", required: true, options: ["Single", "Married filing jointly", "Married filing separately", "Head of household"] },
    { name: "allowances", label: "Allowances", type: "number" },
    { name: "ssnLast4", label: "SSN (last 4)", type: "text", required: true, maxLength: 4, placeholder: "1234" },
    { name: "additionalWithholding", label: "Extra withholding (per period)", type: "number" },
  ],
  DirectDeposit: [
    { name: "bankName", label: "Bank name", type: "text", required: true },
    { name: "accountType", label: "Account type", type: "select", required: true, options: ["Checking", "Savings"] },
    { name: "routingNumber", label: "Routing number", type: "text", required: true, maxLength: 9 },
    { name: "accountNumber", label: "Account number", type: "text", required: true, maxLength: 17 },
  ],
  ITAccess: [
    { name: "preferredUsername", label: "Preferred username", type: "text", required: true },
    { name: "equipment", label: "Equipment needed", type: "select", required: true, options: ["Laptop", "Desktop", "Both", "None — I have my own"] },
    { name: "shirtSize", label: "Shirt size (for swag/uniform)", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    { name: "notes", label: "Anything we should know?", type: "textarea", wide: true },
  ],
  Availability: [
    { name: "days", label: "Available days", type: "text", required: true, wide: true, placeholder: "e.g. Mon, Tue, Thu, Fri, Sat" },
    { name: "hoursPerWeek", label: "Target hours / week", type: "number" },
    { name: "earliestStart", label: "Earliest start time", type: "text", placeholder: "e.g. 7:00 AM" },
    { name: "notes", label: "Notes", type: "textarea", wide: true },
  ],
};
