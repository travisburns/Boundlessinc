"use client";

import { useState } from "react";

/**
 * The type-and-sign control used both per-stage and for the final whole-document
 * agreement. The hire types their full name, enters a signature (rendered in an
 * elegant script), and must tick the agreement box before the action enables.
 */
export function SignatureBlock({
  agreeLabel,
  submitLabel,
  defaultName = "",
  accent = "#C2410C",
  busy = false,
  error,
  onSubmit,
}: {
  agreeLabel: string;
  submitLabel: string;
  defaultName?: string;
  accent?: string;
  busy?: boolean;
  error?: string | null;
  onSubmit: (typedName: string, signature: string) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [signature, setSignature] = useState(defaultName);
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState(false);

  const nameOk = name.trim().length >= 2;
  const signatureOk = signature.trim().length >= 2;
  const canSubmit = nameOk && signatureOk && agreed && !busy;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (canSubmit) onSubmit(name.trim(), signature.trim());
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
            Full legal name
          </span>
          <input
            value={name}
            onChange={(e) => {
              const v = e.target.value;
              // Keep the signature mirroring the name until the hire edits it directly.
              setSignature((prev) => (prev === name ? v : prev));
              setName(v);
            }}
            placeholder="Your full name"
            className="w-full rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-void)]/50 px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]/60"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
            Signature
          </span>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Sign your name"
            className="w-full rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-void)]/50 px-3.5 py-2.5 text-2xl italic text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]/60"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            aria-label="Signature"
          />
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--color-text-muted)]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-gold)]"
        />
        <span>{agreeLabel}</span>
      </label>

      {touched && !canSubmit && !busy && (
        <p className="text-xs text-[var(--color-danger,#dc2626)]">
          {!nameOk
            ? "Type your full name."
            : !signatureOk
              ? "Add your signature."
              : !agreed
                ? "Tick the box to confirm you have read and agree."
                : ""}
        </p>
      )}
      {error && <p className="text-xs text-[var(--color-danger,#dc2626)]">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: accent }}
      >
        {busy ? "Recording…" : submitLabel}
      </button>
    </form>
  );
}
