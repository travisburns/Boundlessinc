import { RequireAuth } from "@/features/auth/components/RequireAuth";

/** Ring workspace: authenticated, with its own bespoke chrome (no portal shell). */
export default function RingLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
