"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconKey } from "@/components/shared/Icons";

/**
 * Public entry point for a self-serve new hire: they type the invite code from
 * their welcome email and are taken to the onboarding wizard.
 */
export function InviteCodeEntry() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/onboarding/start?code=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 w-full max-w-md">
      <div className="flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-[var(--color-void)]/40 px-4 focus-within:border-[var(--color-gold)]">
        <IconKey size={18} className="text-[var(--color-text-faint)]" />
        <input
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ONB-XXXX-XXXX"
          autoComplete="off"
          spellCheck={false}
          className="h-12 flex-1 bg-transparent font-mono tracking-[0.2em] text-[var(--color-text)] outline-none placeholder:tracking-[0.2em] placeholder:text-[var(--color-text-faint)]"
          aria-label="Invitation code"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <Button type="submit" size="lg">
          Begin onboarding →
        </Button>
      </div>
    </form>
  );
}
