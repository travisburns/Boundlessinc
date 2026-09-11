"use client";

import { use } from "react";
import { RingLoader } from "@/features/work/components/RingLoader";

export default function RingGuidelinesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <RingLoader
      slug={slug}
      active="guidelines"
      render={(ring) => {
        const accent = ring.accentColor || "#C2410C";
        return (
          <div className="mx-auto max-w-2xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--color-text)]">Ring Guidelines</h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">What {ring.name} stands for and how it works.</p>

            <div className="mt-6 space-y-5">
              {ring.motto && (
                <blockquote className="rounded-[var(--radius)] border-l-2 bg-[var(--color-surface)] p-5 font-[family-name:var(--font-cormorant)] text-xl italic text-[var(--color-text)]" style={{ borderColor: accent }}>
                  “{ring.motto}”
                </blockquote>
              )}
              {ring.disciplines && (
                <Block label="Remit">
                  <p className="text-[var(--color-text-muted)]">{ring.disciplines}</p>
                </Block>
              )}
              {ring.focus && (
                <Block label="Focus">
                  <p className="text-[var(--color-text-muted)]">{ring.focus}</p>
                </Block>
              )}
              <Block label="How work flows">
                <ol className="list-decimal space-y-1 pl-5 text-[var(--color-text-muted)]">
                  <li>Assignments are issued to the ring and appear on your dashboard.</li>
                  <li>Move each through Assigned → In Progress → Review → Complete.</li>
                  <li>Log progress and submit deliverables under Submit Work.</li>
                  <li>Anything blocked is flagged so it can be cleared quickly.</li>
                </ol>
              </Block>
            </div>
          </div>
        );
      }}
    />
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">{label}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
