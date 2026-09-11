"use client";

import { use } from "react";
import { RingLoader } from "@/features/work/components/RingLoader";

export default function RingReferencesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <RingLoader
      slug={slug}
      active="references"
      render={(ring) => {
        const accent = ring.accentColor || "#C2410C";
        return (
          <div className="mx-auto max-w-3xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--color-text)]">References</h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Approved resources for {ring.name}.</p>
            {ring.resources.length === 0 ? (
              <p className="mt-6 text-sm text-[var(--color-text-faint)]">No references have been added yet.</p>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {ring.resources.map((r) => (
                  <a
                    key={r.label}
                    href={r.href || "#"}
                    className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-gold)]/50"
                  >
                    <span className="block h-1.5 w-8 rounded-full" style={{ background: accent }} />
                    <p className="mt-3 font-medium text-[var(--color-text)]">{r.label}</p>
                    {r.sublabel && <p className="mt-0.5 text-sm text-[var(--color-text-faint)]">{r.sublabel}</p>}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
