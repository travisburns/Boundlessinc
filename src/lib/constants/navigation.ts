/** Public site information architecture (see the platform UX model). */
export interface NavItem {
  label: string;
  href: string;
}

export const publicNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Our Companies", href: "/companies" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/** Actions surfaced on a subsidiary company page. */
export const companyActionLabels = {
  visit: "Visit Company",
  login: "Employee Login",
  payment: "Make a Payment",
  contact: "Contact",
} as const;

/** Enterprise portal navigation (behind authentication). */
export const portalNav: NavItem[] = [
  { label: "Overview", href: "/portal" },
  { label: "Companies", href: "/portal/companies" },
  { label: "Employees", href: "/portal/employees" },
  { label: "Onboarding", href: "/portal/onboarding" },
  { label: "Payments", href: "/portal/payments" },
  { label: "Documents", href: "/portal/documents" },
  { label: "Intelligence", href: "/portal/intelligence" },
  { label: "Integrations", href: "/portal/integrations" },
  { label: "Settings", href: "/portal/settings" },
];
