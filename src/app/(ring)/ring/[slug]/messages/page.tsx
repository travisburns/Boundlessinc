"use client";

import { use } from "react";
import { RingLoader } from "@/features/work/components/RingLoader";
import { IconChat } from "@/components/shared/Icons";

export default function RingMessagesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <RingLoader
      slug={slug}
      active="messages"
      render={(ring) => {
        const accent = ring.accentColor || "#C2410C";
        return (
          <div className="mx-auto max-w-2xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--color-text)]">Messages</h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Conversations within {ring.name}.</p>
            <div className="mt-8 flex flex-col items-center rounded-[var(--radius)] border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border" style={{ borderColor: `${accent}55`, color: accent }}>
                <IconChat size={26} />
              </span>
              <p className="mt-5 text-[var(--color-text)]">No messages yet.</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Ring-to-ring messaging arrives here. For now, coordinate through assignment updates.
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
