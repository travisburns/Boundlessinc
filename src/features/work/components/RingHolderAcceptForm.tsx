"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RingEmblem } from "@/features/work/components/RingEmblem";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { ApiError } from "@/lib/api/client";
import { workApi } from "@/features/work/api/work.api";
import type { RingHolderInvite } from "@/features/work/types/work.types";

export function RingHolderAcceptForm({ code }: { code: string }) {
  const router = useRouter();
  const { applySession } = useAuth();
  const [invite, setInvite] = useState<RingHolderInvite | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    workApi.ringInvite
      .get(code)
      .then((i) => {
        setInvite(i);
        setFirstName(i.firstName);
        setLastName(i.lastName);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [code]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await workApi.ringInvite.accept(code, { password, firstName, lastName });
      applySession(result);
      router.push("/ring");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? "This invitation is no longer valid — the ring may already have a holder, or an account with this email exists."
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  const accent = invite?.accentColor || "#C2410C";

  return (
    <section className="bg-cosmos relative min-h-[70vh] overflow-hidden">
      <Container className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-md">
          {state === "loading" && <p className="text-center text-[var(--color-text-muted)]">Loading your invitation…</p>}

          {state === "error" && (
            <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center">
              <p className="text-[var(--color-text)]">We couldn&apos;t find that invitation.</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Check the link, or ask your admin for a new one.</p>
            </div>
          )}

          {state === "ready" && invite && (
            invite.status !== "Pending" ? (
              <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center">
                <h1 className="font-serif text-2xl text-[var(--color-text)]">This invitation was already used.</h1>
                <div className="mt-6 flex justify-center"><Button href="/login">Employee Login</Button></div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center text-center">
                  <RingEmblem domain={ringDomainFromSlug(invite.ringSlug)} accent={accent} size={80} />
                  <p className="mt-5 u-micro text-[var(--color-gold)]">You&apos;ve been chosen to hold</p>
                  <h1 className="mt-2 font-display text-3xl tracking-[0.05em] text-[var(--color-text)] uppercase">{invite.ringName}</h1>
                  {invite.disciplines && (
                    <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">{invite.disciplines}</p>
                  )}
                </div>

                <form onSubmit={submit} className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
                  <p className="text-sm text-[var(--color-text-muted)]">Set up your account to claim your ring.</p>
                  {error && <div className="mt-4 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--color-danger)]">{error}</div>}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="First name"><input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={cls} /></Field>
                    <Field label="Last name"><input value={lastName} onChange={(e) => setLastName(e.target.value)} className={cls} /></Field>
                  </div>
                  <div className="mt-4"><Field label="Email"><input value={invite.email} disabled className={cls + " opacity-70"} /></Field></div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Password"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={cls} /></Field>
                    <Field label="Confirm password"><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={cls} /></Field>
                  </div>
                  <div className="mt-6">
                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                      {submitting ? "Claiming…" : "Claim your ring →"}
                    </Button>
                  </div>
                </form>
              </>
            )
          )}
        </div>
      </Container>
    </section>
  );
}

const cls = "h-11 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
      {children}
    </label>
  );
}

function ringDomainFromSlug(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
