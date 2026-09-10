import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { ActiveCompanyProvider } from "@/features/portal/context/ActiveCompanyProvider";
import { PortalShell } from "@/features/portal/components/PortalShell";

/** Enterprise portal shell: authentication guard, company context, and chrome. */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <ActiveCompanyProvider>
        <PortalShell>{children}</PortalShell>
      </ActiveCompanyProvider>
    </RequireAuth>
  );
}
