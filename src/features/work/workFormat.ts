import type { AssignmentPriority, AssignmentStatus } from "@/features/work/types/work.types";

export const STATUS_LABEL: Record<AssignmentStatus, string> = {
  Draft: "Draft",
  Assigned: "Assigned",
  InProgress: "In Progress",
  Blocked: "Blocked",
  Review: "In Review",
  Complete: "Complete",
  Archived: "Archived",
};

/** Tailwind-ish inline color per status (text + subtle bg via alpha). */
export function statusColor(status: AssignmentStatus): string {
  switch (status) {
    case "InProgress": return "#3B82F6";
    case "Review": return "#8B5CF6";
    case "Complete": return "#22C55E";
    case "Blocked": return "#EF4444";
    case "Assigned": return "#3B82F6";
    default: return "#9CA3AF";
  }
}

export function priorityColor(p: AssignmentPriority): string {
  switch (p) {
    case "Critical": return "#DC2626";
    case "High": return "#DC2626";
    case "Normal": return "#B45309";
    default: return "#6B7280";
  }
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function shortDate(iso?: string | null): { mon: string; day: string } | null {
  if (!iso) return null;
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    mon: d.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
    day: String(d.getDate()),
  };
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
