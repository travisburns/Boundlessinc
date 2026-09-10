import { Button } from "@/components/ui/Button";
import type { CompanyDetail } from "@/features/companies/types/company.types";

/**
 * Company-specific actions surfaced on a subsidiary page: visit the operating
 * company, employee login, make a payment, and contact.
 */
export function CompanyActions({ company }: { company: CompanyDetail }) {
  const contactHref = company.contactEmail
    ? `mailto:${company.contactEmail}`
    : "/contact";

  return (
    <div className="flex flex-wrap gap-3">
      {company.websiteUrl && (
        <Button href={company.websiteUrl} external size="lg">
          Visit Company
        </Button>
      )}
      {company.supportsEmployeeLogin && (
        <Button href="/login" variant="outline" size="lg">
          Employee Login
        </Button>
      )}
      {company.supportsPayments && (
        <Button href={`/companies/${company.slug}/pay`} variant="outline" size="lg">
          Make a Payment
        </Button>
      )}
      <Button href={contactHref} variant="ghost" size="lg">
        Contact
      </Button>
    </div>
  );
}
