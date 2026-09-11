"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MicroColumn } from "@/components/shared/MicroColumn";
import { IconCheck } from "@/components/shared/Icons";
import { ApiError } from "@/lib/api/client";
import { inviteApi } from "@/features/onboarding/api/invite.api";
import type { InviteDetail } from "@/features/onboarding/types/invite.types";
import type { OnboardingEmployeeStep } from "@/features/onboarding/types/onboarding.types";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; invite: InviteDetail };

export function OnboardingWizard() {
  const params = useSearchParams();
  const code = params.get("code")?.trim() ?? "";

  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [busy, setBusy] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const load = useCallback(async () => {
    if (!code) {
      setState({ kind: "error", message: "No invitation code was provided." });
      return;
    }
    setState({ kind: "loading" });
    try {
      const invite = await inviteApi.get(code);
      setFirstName(invite.firstName);
      setLastName(invite.lastName);
      setState({ kind: "ready", invite });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof ApiError && err.status === 404
            ? "We couldn't find that invitation. Check the code and try again."
            : "Something went wrong loading your invitation. Please try again.",
      });
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onStart() {
    setBusy(true);
    try {
      const invite = await inviteApi.start(code, firstName, lastName);
      setState({ kind: "ready", invite });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof ApiError && err.status === 409
            ? "This invitation is no longer active. Please contact your company."
            : "We couldn't start your onboarding. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function onToggleStep(step: OnboardingEmployeeStep) {
    setBusy(true);
    try {
      const invite = await inviteApi.setStep(code, step.id, !step.isCompleted);
      setState({ kind: "ready", invite });
    } catch {
      // Reload authoritative state on failure.
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-cosmos relative min-h-[70vh] overflow-hidden">
      <Container className="relative py-16 sm:py-20">
        <MicroColumn
          className="absolute left-5 top-16 hidden sm:block"
          lines={["ONE", "ACCOUNT", "MANY WORLDS"]}
        />
        <div className="mx-auto max-w-2xl">
          {state.kind === "loading" && <Loading />}
          {state.kind === "error" && <ErrorPanel message={state.message} onRetry={load} />}
          {state.kind === "ready" && (
            <ReadyPanel
              invite={state.invite}
              firstName={firstName}
              lastName={lastName}
              setFirstName={setFirstName}
              setLastName={setLastName}
              busy={busy}
              onStart={onStart}
              onToggleStep={onToggleStep}
            />
          )}
        </div>
      </Container>
    </section>
  );
}

function Loading() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-10 text-center">
      <p className="text-[var(--color-text-muted)]">Loading your invitation…</p>
    </div>
  );
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-10 text-center">
      <p className="text-[var(--color-text)]">{message}</p>
      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={onRetry} variant="outline">Try again</Button>
        <Button href="/onboarding">Back to onboarding</Button>
      </div>
    </div>
  );
}

function ReadyPanel({
  invite,
  firstName,
  lastName,
  setFirstName,
  setLastName,
  busy,
  onStart,
  onToggleStep,
}: {
  invite: InviteDetail;
  firstName: string;
  lastName: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  busy: boolean;
  onStart: () => void;
  onToggleStep: (step: OnboardingEmployeeStep) => void;
}) {
  if (invite.status === "Expired" || invite.status === "Revoked") {
    return (
      <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-10 text-center">
        <h1 className="font-serif text-2xl text-[var(--color-text)]">
          This invitation is {invite.status === "Expired" ? "expired" : "no longer valid"}.
        </h1>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Please contact {invite.companyName || "your company"} for a new invitation.
        </p>
        <div className="mt-6 flex justify-center">
          <Button href="/contact" variant="outline">Contact us</Button>
        </div>
      </div>
    );
  }

  const process = invite.process;
  const finished = invite.status === "Completed" || process?.status === "Completed";

  // Header shared across states.
  const header = (
    <div className="text-center">
      <p className="u-micro text-[var(--color-gold)]">{invite.companyName}</p>
      <h1 className="mt-3 font-display text-3xl tracking-[0.03em] text-[var(--color-text)] sm:text-4xl">
        {finished ? "YOU'RE ALL SET" : "WELCOME ABOARD"}
      </h1>
      <p className="mt-3 font-serif text-lg text-[var(--color-text-muted)]">
        {invite.templateName}
      </p>
    </div>
  );

  if (finished) {
    return (
      <div>
        {header}
        <div className="mt-8 rounded-[var(--radius)] border border-[var(--color-gold)]/40 bg-[var(--color-surface)] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-gold)] text-[var(--color-gold)]">
            <IconCheck size={28} />
          </div>
          <h2 className="mt-5 font-serif text-xl text-[var(--color-text)]">
            Onboarding complete, {invite.firstName}.
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Your record at {invite.companyName} is active. Once your account is ready you can
            sign in to reach your companies, tools, and resources.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button href="/login">Employee Login</Button>
          </div>
        </div>
      </div>
    );
  }

  // Not started yet — confirm details and begin.
  if (!process) {
    return (
      <div>
        {header}
        <div className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-8">
          <p className="text-sm text-[var(--color-text-muted)]">
            Confirm your details to begin. You&apos;ll then work through your onboarding steps.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">First name</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">Last name</span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/40 px-3.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
              />
            </label>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--color-text-faint)]">Email</dt>
              <dd className="text-[var(--color-text)]">{invite.email}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-faint)]">Role</dt>
              <dd className="text-[var(--color-text)]">{invite.title}</dd>
            </div>
          </dl>
          <div className="mt-7">
            <Button onClick={onStart} size="lg" className="w-full">
              {busy ? "Starting…" : "Begin onboarding →"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // In progress — step checklist.
  return (
    <div>
      {header}
      <div className="mt-8 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-8">
        <div className="mb-6">
          <ProgressBar value={process.completedSteps} total={process.totalSteps} />
        </div>
        <ul className="flex flex-col gap-2.5">
          {process.steps.map((step) => (
            <li key={step.id}>
              <button
                type="button"
                disabled={busy}
                onClick={() => onToggleStep(step)}
                className="flex w-full items-center gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-void)]/30 px-4 py-3.5 text-left transition-colors hover:border-[var(--color-gold)]/50 disabled:opacity-60"
              >
                <span
                  className={
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border " +
                    (step.isCompleted
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-void)]"
                      : "border-[var(--color-line)] text-transparent")
                  }
                >
                  <IconCheck size={14} />
                </span>
                <span className="flex-1">
                  <span
                    className={
                      "block text-sm " +
                      (step.isCompleted
                        ? "text-[var(--color-text-muted)] line-through"
                        : "text-[var(--color-text)]")
                    }
                  >
                    {step.name}
                  </span>
                </span>
                {!step.isRequired && (
                  <span className="u-micro text-[var(--color-text-faint)]">Optional</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-[var(--color-text-faint)]">
          Complete every required step to finish onboarding. You can leave and return with your
          code at any time.
        </p>
      </div>
    </div>
  );
}
