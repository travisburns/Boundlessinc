"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { coreOnboardingApi } from "@/features/onboarding-core/api/coreOnboarding.api";
import type {
  CoreOnboardingDocument,
  CoreOnboardingProgress,
} from "@/features/onboarding-core/types/coreOnboarding.types";
import { SignatureBlock } from "@/features/onboarding-core/components/SignatureBlock";

const ACCENT = "#B8860B"; // Boundless gold

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

export function CoreOnboardingFlow() {
  const { user } = useAuth();
  const [doc, setDoc] = useState<CoreOnboardingDocument | null>(null);
  const [progress, setProgress] = useState<CoreOnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // index 0..stages.length-1 = a stage; index === stages.length = final review.
  const [index, setIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await coreOnboardingApi.get();
        if (cancelled) return;
        setDoc(d);
        setProgress(d.progress);
        const signed = new Set(d.progress.signedStageKeys);
        const firstUnsigned = d.stages.findIndex((s) => !signed.has(s.key));
        setIndex(firstUnsigned === -1 ? d.stages.length : firstUnsigned);
      } catch {
        if (!cancelled) setLoadError("We couldn't load your onboarding document. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stages = doc?.stages ?? [];
  const signedSet = useMemo(() => new Set(progress?.signedStageKeys ?? []), [progress]);
  const atReview = index >= stages.length;
  const stage = atReview ? null : stages[index];
  const stageSigned = stage ? signedSet.has(stage.key) : false;
  const existingSig = stage ? progress?.signatures.find((s) => s.stageKey === stage.key) : undefined;

  const defaultName = existingSig?.typedName || user?.fullName || "";

  async function signCurrent(typedName: string, signature: string) {
    if (!stage) return;
    setBusy(true);
    setActionError(null);
    try {
      const p = await coreOnboardingApi.signStage(stage.key, { typedName, signature });
      setProgress(p);
      setEditing(false);
      goNext();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Something went wrong recording your signature.");
    } finally {
      setBusy(false);
    }
  }

  function goNext() {
    setActionError(null);
    setEditing(false);
    // Move to the next stage, or to review once past the last one.
    setIndex((i) => Math.min(i + 1, stages.length));
  }

  function goTo(i: number) {
    setActionError(null);
    setEditing(false);
    setIndex(i);
  }

  async function completeDocument(typedName: string, signature: string) {
    setBusy(true);
    setActionError(null);
    try {
      const p = await coreOnboardingApi.complete({ typedName, signature });
      setProgress(p);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Something went wrong completing your onboarding.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-text-muted)]">
        Opening your onboarding…
      </div>
    );
  }

  if (loadError || !doc) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">{loadError ?? "Not available."}</p>
        <button
          onClick={() => location.reload()}
          className="rounded-full border border-[var(--color-line)] px-5 py-2 text-sm text-[var(--color-text)] hover:border-[var(--color-gold)]/60"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
      {/* Masthead */}
      <header className="mb-5 text-center">
        <p className="font-[family-name:var(--font-cinzel)] text-[11px] uppercase tracking-[0.4em] text-[var(--color-text-faint)]">
          Boundless Enterprise · Core Onboarding
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-cinzel)] text-2xl uppercase tracking-[0.25em] text-[var(--color-text)] sm:text-3xl">
          The First Horizon
        </h1>
      </header>

      {/* Progress rail */}
      <ProgressRail
        total={stages.length}
        current={index}
        signedKeys={signedSet}
        stages={stages}
        complete={progress?.isComplete ?? false}
        onJump={goTo}
      />

      {/* Body */}
      <div className="mt-6 flex-1">
        {atReview ? (
          <ReviewPanel
            doc={doc}
            progress={progress}
            defaultName={user?.fullName || progress?.completedName || ""}
            busy={busy}
            error={actionError}
            onBack={() => goTo(stages.length - 1)}
            onComplete={completeDocument}
          />
        ) : (
          stage && (
            <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
              {/* The exact page */}
              <figure className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-void)]/40 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stage.imageUrl}
                  alt={`${stage.title} — page ${stage.pageNumber}`}
                  className="h-auto w-full"
                  loading="eager"
                />
              </figure>

              {/* Sign panel */}
              <div className="lg:sticky lg:top-6 lg:self-start">
                <div className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">
                    Section {stage.order} of {stages.length}
                  </p>
                  <h2 className="mt-1.5 font-[family-name:var(--font-cinzel)] text-lg uppercase tracking-[0.12em] text-[var(--color-text)]">
                    {stage.title}
                  </h2>
                  <p className="mt-1 font-[family-name:var(--font-cormorant)] text-base italic text-[var(--color-text-muted)]">
                    {stage.subtitle}
                  </p>

                  <div className="my-5 h-px bg-[var(--color-line)]" />

                  {stageSigned && !editing ? (
                    <div className="space-y-4">
                      <div className="rounded-[var(--radius)] border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Signed</p>
                        <p
                          className="mt-1 text-2xl italic text-[var(--color-text)]"
                          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                        >
                          {existingSig?.typedName}
                        </p>
                        {existingSig && (
                          <p className="mt-1 text-xs text-[var(--color-text-faint)]">
                            Agreed {fmtDate(existingSig.signedAtUtc)}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => goNext()}
                          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white"
                          style={{ background: ACCENT }}
                        >
                          {index === stages.length - 1 ? "Review & finish →" : "Continue →"}
                        </button>
                        <button
                          onClick={() => setEditing(true)}
                          className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                          Re-sign
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
                        Read this section above, then type your name and sign to confirm you have read and agree.
                      </p>
                      <SignatureBlock
                        key={stage.key}
                        agreeLabel="I have read and agree to this section."
                        submitLabel={index === stages.length - 1 ? "Sign & review" : "Sign & continue"}
                        defaultName={defaultName}
                        accent={ACCENT}
                        busy={busy}
                        error={actionError}
                        onSubmit={signCurrent}
                      />
                    </>
                  )}
                </div>

                {/* Back link */}
                {index > 0 && (
                  <button
                    onClick={() => goTo(index - 1)}
                    className="mt-4 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
                  >
                    ← Previous section
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ProgressRail({
  total,
  current,
  signedKeys,
  stages,
  complete,
  onJump,
}: {
  total: number;
  current: number;
  signedKeys: Set<string>;
  stages: CoreOnboardingDocument["stages"];
  complete: boolean;
  onJump: (i: number) => void;
}) {
  const signedCount = signedKeys.size;
  const pct = total === 0 ? 0 : Math.round((signedCount / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
        <span>
          {signedCount} of {total} sections signed
        </span>
        <span>{complete ? "Complete" : `${pct}%`}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {stages.map((s, i) => {
          const isSigned = signedKeys.has(s.key);
          const isCurrent = i === current;
          const reachable = isSigned || i <= current;
          return (
            <button
              key={s.key}
              title={`${s.order}. ${s.title}`}
              disabled={!reachable}
              onClick={() => reachable && onJump(i)}
              className="h-1.5 flex-1 rounded-full transition-colors disabled:cursor-not-allowed"
              style={{
                minWidth: 14,
                background: isSigned
                  ? "#B8860B"
                  : isCurrent
                    ? "var(--color-text-muted)"
                    : "var(--color-line)",
                outline: isCurrent ? "1px solid var(--color-gold)" : undefined,
                outlineOffset: 2,
              }}
              aria-label={`Section ${s.order}: ${s.title}${isSigned ? " (signed)" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ReviewPanel({
  doc,
  progress,
  defaultName,
  busy,
  error,
  onBack,
  onComplete,
}: {
  doc: CoreOnboardingDocument;
  progress: CoreOnboardingProgress | null;
  defaultName: string;
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onComplete: (name: string, signature: string) => void;
}) {
  if (progress?.isComplete) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold)]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl uppercase tracking-[0.2em] text-[var(--color-text)]">
          Welcome to Boundless
        </h2>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg italic text-[var(--color-text-muted)]">
          You have read and agreed to the Core Onboarding document in full.
        </p>
        {progress.completedAtUtc && (
          <p className="mt-2 text-xs text-[var(--color-text-faint)]">
            Signed by {progress.completedName} on {fmtDate(progress.completedAtUtc)}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/ring"
            className="rounded-full px-6 py-2.5 text-sm font-medium text-white"
            style={{ background: "#B8860B" }}
          >
            Continue →
          </Link>
        </div>
        <p className="mt-6 text-xs text-[var(--color-text-faint)]">
          Next: the questionnaire, then your role. (Coming in Parts 2 &amp; 3.)
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-4">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-cinzel)] text-xl uppercase tracking-[0.18em] text-[var(--color-text)]">
          One last agreement
        </h2>
        <p className="mt-2 font-[family-name:var(--font-cormorant)] text-lg italic text-[var(--color-text-muted)]">
          You have signed all {doc.stages.length} sections. Now agree to the document as a whole.
        </p>
      </div>

      <ul className="mt-6 grid gap-1.5 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 sm:grid-cols-2">
        {doc.stages.map((s) => {
          const sig = progress?.signatures.find((x) => x.stageKey === s.key);
          return (
            <li key={s.key} className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <span className="text-[var(--color-gold)]">✓</span>
              <span className="truncate">
                {s.order}. {s.title}
              </span>
              {sig && <span className="ml-auto shrink-0 text-[10px] text-[var(--color-text-faint)]">{fmtDate(sig.signedAtUtc)}</span>}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-[var(--radius)] border border-[var(--color-gold)]/25 bg-[var(--color-surface)] p-5 sm:p-6">
        <SignatureBlock
          agreeLabel="I have read and agree to the entire Boundless Core Onboarding document."
          submitLabel="Complete onboarding"
          defaultName={defaultName}
          accent="#B8860B"
          busy={busy}
          error={error}
          onSubmit={onComplete}
        />
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
      >
        ← Back to the last section
      </button>
    </div>
  );
}
