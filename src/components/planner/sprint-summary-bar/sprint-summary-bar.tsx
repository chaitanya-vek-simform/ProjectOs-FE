import { ProgressBar } from "@/components/common/progress-bar/progress-bar";
import { StatusBadge } from "@/components/common/status-badge/status-badge";
import { LABELS } from "@/constants/labels";

import { toSprintSummary } from "@/components/planner/planner-mappers";

import type { SprintResponse } from "@/types/planner";

const SUMMARY = LABELS.PLANNER.SUMMARY;

interface MetricProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function Metric({ label, value, valueClassName }: MetricProps) {
  return (
    <div className="whitespace-nowrap">
      <span className="text-xs text-slate-500">{label} </span>
      <span
        className={valueClassName ?? "text-sm font-semibold text-slate-800"}
      >
        {value}
      </span>
    </div>
  );
}

interface SprintSummaryBarProps {
  sprint: SprintResponse | undefined;
}

/**
 * SprintSummaryBar — the indigo header strip summarizing the active sprint's
 * dates, point commitments, progress and schedule status. Renders a neutral
 * empty state when no sprint is selected.
 */
function SprintSummaryBar({ sprint }: SprintSummaryBarProps) {
  if (!sprint) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
        <p className="text-sm font-semibold text-slate-700">
          {SUMMARY.NO_SPRINT_TITLE}
        </p>
        <p className="text-xs text-slate-500">
          {SUMMARY.NO_SPRINT_DESCRIPTION}
        </p>
      </div>
    );
  }

  const summary = toSprintSummary(sprint);

  return (
    <div className="flex items-center gap-6 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3">
      <div className="whitespace-nowrap">
        <p className="text-sm font-semibold text-slate-800">{summary.name}</p>
        <p className="text-xs text-slate-500">{summary.dateRange}</p>
      </div>
      <div className="h-8 w-px bg-indigo-200" aria-hidden="true" />
      <Metric label={SUMMARY.COMMITTED_LABEL} value={summary.committed} />
      <Metric label={SUMMARY.COMPLETED_LABEL} value={summary.completed} />
      <Metric
        label={SUMMARY.REMAINING_LABEL}
        value={summary.remaining}
        valueClassName="text-sm font-semibold text-orange-600"
      />
      <ProgressBar value={summary.progress} className="h-3 flex-1" />
      <StatusBadge tone={summary.status.tone}>
        {summary.status.text}
      </StatusBadge>
    </div>
  );
}

export { SprintSummaryBar };
