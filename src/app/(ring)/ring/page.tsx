"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { workApi } from "@/features/work/api/work.api";
import type { RingSummary } from "@/features/work/types/work.types";

/** Entry to the ring workspace: go to the current user's ring, else offer a picker. */
export default function RingIndexPage() {
  const router = useRouter();
  const [rings, setRings] = useState<RingSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const held = await workApi.rings.held();
        if (!cancelled && held.length > 0) {
          router.replace(`/ring/${held[0].slug}`);
          return;
        }
      } catch {
        /* fall through to picker */
      }
      try {
        const all = await workApi.rings.list();
        if (!cancelled) setRings(all);
      } catch {
        if (!cancelled) setRings([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (rings === null)
    return <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] text-[var(--color-text-muted)]">Opening your workspace…</div>;

  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      <Container className="py-16">
        <h1 className="font-[family-name:var(--font-cinzel)] text-2xl tracking-[0.2em] uppercase text-[var(--color-text)]">
          Ring Workspaces
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          You don&apos;t hold a ring — pick one to view its workspace.
        </p>
        {rings.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--color-text-faint)]">No rings yet. An admin can create them under Portal → Rings.</p>
        ) : (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rings.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/ring/${r.slug}`}
                  className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-gold)]/50"
                >
                  <span className="h-10 w-10 shrink-0 rounded-full border" style={{ borderColor: r.accentColor || "#666", background: `${r.accentColor || "#666"}22` }} aria-hidden />
                  <span>
                    <span className="block font-medium text-[var(--color-text)]">{r.name}</span>
                    <span className="block text-xs text-[var(--color-text-faint)]">{r.holderName}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8">
          <Link href="/portal" className="text-sm text-[var(--color-gold)] hover:underline">← Back to portal</Link>
        </div>
      </Container>
    </div>
  );
}
