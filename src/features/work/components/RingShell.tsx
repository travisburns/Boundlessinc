"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/components/AuthProvider";
import type { Ring } from "@/features/work/types/work.types";

const NAV = [
  { label: "My Assignments", key: "assignments" },
  { label: "My Calendar", key: "calendar" },
  { label: "My Files", key: "files" },
  { label: "References", key: "references" },
  { label: "Ring Guidelines", key: "guidelines" },
  { label: "Submit Work", key: "submit" },
  { label: "Messages", key: "messages" },
];

/** Bespoke chrome for a ring's workspace: left rail (identity + nav) and top bar. */
export function RingShell({
  ring,
  active = "assignments",
  children,
}: {
  ring: Ring;
  active?: string;
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const accent = ring.accentColor || "#C2410C";

  return (
    <div className="flex min-h-screen bg-[var(--color-ink)] text-[var(--color-text)]">
      {/* Left rail */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-void)] lg:flex">
        <div className="flex flex-col items-center border-b border-[var(--color-line)] px-6 py-8 text-center">
          <span
            className="flex h-24 w-24 items-center justify-center rounded-full border"
            style={{ borderColor: accent, boxShadow: `0 0 40px -12px ${accent}` }}
          >
            <span className="font-[family-name:var(--font-cinzel)] text-3xl" style={{ color: accent }}>
              {ring.name.replace(/^The\s+/i, "").charAt(0)}
            </span>
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg tracking-[0.2em] uppercase">
            {ring.name}
          </h2>
          {ring.disciplines && (
            <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">
              {ring.disciplines}
            </p>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const isActive = item.key === active;
            const href = item.key === "assignments" ? `/ring/${ring.slug}` : `/ring/${ring.slug}#${item.key}`;
            return (
              <Link
                key={item.key}
                href={href}
                className={
                  "block rounded-lg px-3 py-2 text-sm transition-colors " +
                  (isActive
                    ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {ring.motto && (
          <div className="border-t border-[var(--color-line)] px-6 py-6 text-center">
            <p className="font-[family-name:var(--font-cormorant)] text-lg italic text-[var(--color-text-muted)]">
              “{ring.motto}”
            </p>
          </div>
        )}
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-[var(--color-line)] px-6">
          <Link href="/" className="font-[family-name:var(--font-cinzel)] text-sm tracking-[0.3em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            Boundless <span className="text-[var(--color-text-faint)]">Enterprises</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-right sm:block">
              <span className="block text-[var(--color-text)]">{ring.holderName}</span>
              <span className="block text-xs text-[var(--color-text-faint)]">{ring.name}</span>
            </span>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white"
              style={{ background: accent }}
            >
              {ring.holderName.charAt(0)}
            </span>
            <button
              onClick={logout}
              className="text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text)]"
              title={user?.email ?? "Sign out"}
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
