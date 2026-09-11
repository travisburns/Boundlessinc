"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RingShell } from "@/features/work/components/RingShell";
import { workApi } from "@/features/work/api/work.api";
import type { Ring } from "@/features/work/types/work.types";

/** Loads a ring by slug and renders its workspace chrome around the given content. */
export function RingLoader({
  slug,
  active,
  render,
}: {
  slug: string;
  active?: string;
  render: (ring: Ring) => React.ReactNode;
}) {
  const [ring, setRing] = useState<Ring | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    workApi.rings
      .get(slug)
      .then((r) => {
        setRing(r);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [slug]);

  if (state === "loading")
    return <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] text-[var(--color-text-muted)]">Loading workspace…</div>;

  if (state === "error" || !ring)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-ink)] text-center">
        <p className="text-[var(--color-text)]">This ring workspace couldn&apos;t be found.</p>
        <Link href="/portal" className="text-sm text-[var(--color-gold)] hover:underline">← Back to portal</Link>
      </div>
    );

  return (
    <RingShell ring={ring} active={active}>
      {render(ring)}
    </RingShell>
  );
}
