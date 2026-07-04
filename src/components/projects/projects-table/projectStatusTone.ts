import type { StatusTone } from "@/types/common";

const STATUS_TONE_MAP: Record<string, StatusTone> = {
  active: "info",
  in_progress: "info",
  on_track: "low",
  completed: "low",
  done: "low",
  at_risk: "medium",
  delayed: "medium",
  blocked: "high",
  critical: "critical",
  cancelled: "neutral",
};

/** Maps a free-text project status to a StatusBadge tone, defaulting to neutral. */
export function getProjectStatusTone(status: string): StatusTone {
  return STATUS_TONE_MAP[status.toLowerCase().trim()] ?? "neutral";
}
