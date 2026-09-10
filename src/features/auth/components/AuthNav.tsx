"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/components/AuthProvider";

/** Header action area that reflects authentication state. */
export function AuthNav() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-[var(--color-surface-2)]" />;
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/portal"
          className="hidden text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] sm:inline"
        >
          {user.fullName.split(" ")[0]}
        </Link>
        <Button href="/portal" variant="primary" size="sm">
          Portal
        </Button>
        <button
          onClick={logout}
          className="text-sm text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text)]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Button href="/login" variant="outline" size="sm">
      Employee Login
    </Button>
  );
}
