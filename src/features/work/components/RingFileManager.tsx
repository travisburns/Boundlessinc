"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconWaveform, IconEye, IconMonitor, IconFileText, IconFolder, IconTools, IconDoc, IconUpload,
  type IconProps,
} from "@/components/shared/Icons";
import { workApi } from "@/features/work/api/work.api";
import { ringProfile } from "@/features/work/workProfiles";
import { relativeTime } from "@/features/work/workFormat";
import type { Ring, RingFile, RingFileKind } from "@/features/work/types/work.types";

/**
 * Reusable upload + list for a ring's files. When `assignmentId` is set it scopes
 * to that assignment (Submit Work); otherwise it's the ring's whole library.
 */
export function RingFileManager({
  ring,
  assignmentId,
  compact = false,
}: {
  ring: Ring;
  assignmentId?: string;
  compact?: boolean;
}) {
  const profile = ringProfile(ring.domain);
  const accent = ring.accentColor || "#C2410C";
  const [files, setFiles] = useState<RingFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setFiles(await workApi.files.list(ring.id, assignmentId));
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [ring.id, assignmentId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const created = await workApi.files.upload(ring.id, file, assignmentId);
      setFiles((prev) => [created, ...prev]);
    } catch {
      setError("Upload failed. You may not have permission, or the file is too large (100 MB max).");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function download(f: RingFile) {
    try {
      const blob = await workApi.files.blob(f.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      setError("Couldn't download that file.");
    }
  }

  async function remove(f: RingFile) {
    try {
      await workApi.files.remove(f.id);
      setFiles((prev) => prev.filter((x) => x.id !== f.id));
    } catch {
      setError("Couldn't delete that file.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {!compact && <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">{profile.filesLabel}</h3>}
          <p className="text-xs text-[var(--color-text-faint)]">{profile.uploadHint}</p>
        </div>
        <label
          className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
          style={{ background: accent, opacity: busy ? 0.6 : 1 }}
        >
          <IconUpload size={16} />
          {busy ? "Uploading…" : assignmentId ? profile.submitLabel : "Upload"}
          <input ref={inputRef} type="file" accept={profile.accept} onChange={onPick} disabled={busy} className="hidden" />
        </label>
      </div>

      {error && <p className="mt-3 text-xs text-[var(--color-danger)]">{error}</p>}

      {loading ? (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">Loading…</p>
      ) : files.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-text-faint)]">No files yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-[var(--color-line)]">
          {files.map((f) => {
            const Icon = kindIcon(f.kind);
            return (
              <li key={f.id} className="flex items-center gap-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-line)]" style={{ color: accent, background: `${accent}18` }}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[var(--color-text)]">{f.fileName}</p>
                  <p className="text-xs text-[var(--color-text-faint)]">
                    {formatSize(f.sizeBytes)} · {f.uploadedBy} · {relativeTime(f.createdAtUtc)}
                  </p>
                </div>
                <button onClick={() => download(f)} className="text-xs text-[var(--color-gold)] hover:underline">Download</button>
                <button onClick={() => remove(f)} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-danger)]">Delete</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function kindIcon(kind: RingFileKind): (p: IconProps) => React.ReactNode {
  switch (kind) {
    case "Audio": return IconWaveform;
    case "Image": return IconEye;
    case "Video": return IconMonitor;
    case "Document": return IconFileText;
    case "Archive": return IconFolder;
    case "Project": return IconTools;
    default: return IconDoc;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
