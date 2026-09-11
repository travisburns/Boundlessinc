"use client";

import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";
import { RingEmblem } from "@/features/work/components/RingEmblem";
import {
  IconClipboard, IconCalendar, IconFolder, IconBook, IconRing, IconUpload, IconChat,
  IconSearch, IconBell, type IconProps,
} from "@/components/shared/Icons";
import { useAuth } from "@/features/auth/components/AuthProvider";
import type { Ring } from "@/features/work/types/work.types";

const NAV: { label: string; key: string; Icon: (p: IconProps) => React.ReactNode }[] = [
  { label: "My Assignments", key: "assignments", Icon: IconClipboard },
  { label: "My Calendar", key: "calendar", Icon: IconCalendar },
  { label: "My Files", key: "files", Icon: IconFolder },
  { label: "References", key: "references", Icon: IconBook },
  { label: "Ring Guidelines", key: "guidelines", Icon: IconRing },
  { label: "Submit Work", key: "submit", Icon: IconUpload },
  { label: "Messages", key: "messages", Icon: IconChat },
];

const TOP_TABS = [
  { label: "My Work", key: "work" },
  { label: "Calendar", key: "calendar" },
  { label: "Resources", key: "resources" },
  { label: "Messages", key: "messages" },
];

/** Bespoke chrome for a ring's workspace: full-width top bar + left identity rail. */
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
    <div className="flex min-h-screen flex-col bg-[var(--color-ink)] text-[var(--color-text)]">
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center gap-6 border-b border-[var(--color-line)] px-5">
        <Link href="/" className="shrink-0">
          <Wordmark compact />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {TOP_TABS.map((t) => (
            <Link
              key={t.key}
              href={t.key === "work" ? `/ring/${ring.slug}` : `/ring/${ring.slug}#${t.key}`}
              className={
                "border-b-2 pb-[3px] text-sm transition-colors " +
                (t.key === "work"
                  ? "text-[var(--color-text)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]")
              }
              style={t.key === "work" ? { borderColor: "var(--color-gold)" } : undefined}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 py-2 lg:flex">
            <IconSearch size={16} className="text-[var(--color-text-faint)]" />
            <input placeholder="Search…" className="w-40 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]" />
          </div>
          <span className="relative">
            <IconBell size={20} className="text-[var(--color-text-muted)]" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full" style={{ background: accent }} aria-hidden />
          </span>
          <span className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white"
              style={{ background: accent }}
            >
              {ring.holderName.charAt(0)}
            </span>
            <span className="hidden text-sm sm:block">
              <span className="block leading-tight text-[var(--color-text)]">{ring.holderName}</span>
              <span className="block text-xs text-[var(--color-text-faint)]">{ring.name}</span>
            </span>
            <button onClick={logout} title={user?.email ?? "Sign out"} className="ml-1 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
              Sign out
            </button>
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left rail */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-void)] lg:flex">
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <RingEmblem domain={ring.domain} accent={accent} size={96} />
            <h2 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg uppercase tracking-[0.2em]">{ring.name}</h2>
            {ring.disciplines && (
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">
                {ring.disciplines}
              </p>
            )}
          </div>

          <nav className="space-y-1 px-3">
            {NAV.map(({ label, key, Icon }) => {
              const isActive = key === active;
              const href = key === "assignments" ? `/ring/${ring.slug}` : `/ring/${ring.slug}#${key}`;
              return (
                <Link
                  key={key}
                  href={href}
                  className={
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
                    (isActive
                      ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]")
                  }
                  style={isActive ? { boxShadow: `inset 2px 0 0 ${accent}` } : undefined}
                >
                  <Icon size={18} className={isActive ? "" : "text-[var(--color-text-faint)]"} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            {ring.motto && (
              <div className="px-6 py-6 text-center">
                <p className="font-[family-name:var(--font-cormorant)] text-lg italic text-[var(--color-text-muted)]">
                  “{ring.motto}”
                </p>
                <span className="mx-auto mt-3 block h-px w-10" style={{ background: accent }} />
              </div>
            )}
            {/* Atmospheric footer */}
            <div
              className="relative h-28 border-t border-[var(--color-line)]"
              style={{ background: "linear-gradient(to top, rgba(20,16,34,0.9), transparent)" }}
            >
              <svg viewBox="0 0 256 100" preserveAspectRatio="none" className="absolute bottom-0 h-full w-full opacity-40" aria-hidden>
                <path d="M0 100 L40 55 L80 78 L120 40 L160 70 L200 45 L256 72 L256 100 Z" fill={`${accent}55`} />
                <path d="M0 100 L60 68 L110 82 L170 58 L230 80 L256 70 L256 100 Z" fill="rgba(10,8,20,0.8)" />
              </svg>
              <div className="absolute inset-x-0 bottom-3 text-center">
                <p className="font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                  Boundless Enterprises
                </p>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-text-faint)]/60">A Greater Tomorrow</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
