import { RequireAuth } from "@/features/auth/components/RequireAuth";

/**
 * Enterprise portal shell. Phase 1 provides the authentication guard; the full
 * portal navigation and capability modules arrive in later phases.
 */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
