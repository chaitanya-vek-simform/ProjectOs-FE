import type { Query } from "@tanstack/react-query";

const POLL_INTERVAL_MS = 10_000;

const TERMINAL_STATUSES = new Set([
  "processed",
  "completed",
  "failed",
  "approved",
  "done",
]);

function isPending(status: string | undefined): boolean {
  if (!status) return false;
  return !TERMINAL_STATUSES.has(status.toLowerCase());
}

/**
 * `refetchInterval` for a single async resource with a `status` field — polls
 * every 10s while `status` is non-terminal (e.g. "uploaded" | "processing"),
 * stops once it settles ("processed" | "failed" | ...).
 */
export function pollWhileStatusPending<T extends { status: string }>(
  query: Query<T>,
): number | false {
  return isPending(query.state.data?.status) ? POLL_INTERVAL_MS : false;
}

/**
 * `refetchInterval` for a list of async resources — polls every 10s while any
 * item's `status` is non-terminal, so an in-progress upload/process job is
 * reflected without a manual refresh.
 */
export function pollWhileAnyStatusPending<T extends { status: string }>(
  query: Query<T[]>,
): number | false {
  const items = query.state.data ?? [];
  return items.some((item) => isPending(item.status))
    ? POLL_INTERVAL_MS
    : false;
}
