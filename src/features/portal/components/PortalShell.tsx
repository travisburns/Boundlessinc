"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/shared/Wordmark";
import { CompanySwitcher } from "@/features/portal/components/CompanySwitcher";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { portalNav } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

/** Authenticated portal chrome: sidebar navigation, top bar, and content area. */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[var(--color-ink)]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-void)] md:flex">
        <div className="flex h-16 items-center border-b border-[var(--color-line)] px-6">
          <Wordmark compact />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {portalNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/portal" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--color-line)] p-3 text-xs text-[var(--color-text-faint)]">
          <Link href="/" className="hover:text-[var(--color-text-muted)]">
            ← Public site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-[var(--color-line)] px-6">
          <CompanySwitcher />
          <div className="flex items-center gap-4 text-sm">
            {user && <span className="hidden text-[var(--color-text-muted)] sm:inline">{user.email}</span>}
            <button
              onClick={logout}
              className="text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text)]"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
