"use client";

import { use } from "react";
import { RingLoader } from "@/features/work/components/RingLoader";
import { RingFileManager } from "@/features/work/components/RingFileManager";

export default function RingFilesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <RingLoader
      slug={slug}
      active="files"
      render={(ring) => (
        <div className="mx-auto max-w-3xl">
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--color-text)]">My Files</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{ring.name}</p>
          <div className="mt-6 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
            <RingFileManager ring={ring} />
          </div>
        </div>
      )}
    />
  );
}
