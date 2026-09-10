import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";

/** Centered card shell for authentication screens, on the cosmic backdrop. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-cosmic-grid flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="mb-8">
        <Wordmark />
      </div>
      <div className="w-full max-w-md rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)]/80 p-8 shadow-[var(--shadow-elev)] backdrop-blur">
        {children}
      </div>
      <Link
        href="/"
        className="mt-6 text-xs text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text-muted)]"
      >
        ← Back to Boundless Enterprises
      </Link>
    </div>
  );
}
