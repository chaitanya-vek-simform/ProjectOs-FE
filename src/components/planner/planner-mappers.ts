import { LABELS } from "@/constants/labels";
import { formatDate } from "@/lib/utils";

import type { StatusTone } from "@/types/common";
import type {
  KanbanColumn,
  KanbanTask,
  SprintOption,
  SprintResponse,
  SprintSummary,
  TaskResponse,
} from "@/types/planner";

const PLANNER = LABELS.PLANNER;

/* -------------------------------------------------------------------------- */
/* Column definitions + task-status → column mapping                          */
/* -------------------------------------------------------------------------- */

/** Order + presentation of the five kanban columns (task-less templates). */
const COLUMN_TEMPLATES: readonly Omit<KanbanColumn, "tasks">[] = [
  { id: "todo", label: PLANNER.COLUMNS.TODO, dotTone: "slate" },
  {
    id: "in-progress",
    label: PLANNER.COLUMNS.IN_PROGRESS,
    dotTone: "blue",
    dotPulse: true,
  },
  { id: "in-review", label: PLANNER.COLUMNS.IN_REVIEW, dotTone: "purple" },
  {
    id: "done",
    label: PLANNER.COLUMNS.DONE,
    dotTone: "emerald",
    doneStyle: true,
  },
  {
    id: "blocked",
    label: PLANNER.COLUMNS.BLOCKED,
    dotTone: "red",
    variant: "blocked",
  },
];

/** Maps a backend task status string to a kanban column id (fallback: todo). */
const STATUS_TO_COLUMN: Record<string, KanbanColumn["id"]> = {
  todo: "todo",
  backlog: "todo",
  open: "todo",
  in_progress: "in-progress",
  "in-progress": "in-progress",
  in_review: "in-review",
  "in-review": "in-review",
  review: "in-review",
  done: "done",
  completed: "done",
  closed: "done",
  blocked: "blocked",
};

/** Maps a kanban column id back to the canonical backend status string. */
export const COLUMN_TO_STATUS: Record<KanbanColumn["id"], string> = {
  todo: "todo",
  "in-progress": "in_progress",
  "in-review": "in_review",
  done: "done",
  blocked: "blocked",
};

function statusToColumnId(status: string): KanbanColumn["id"] {
  return STATUS_TO_COLUMN[status.toLowerCase().trim()] ?? "todo";
}

/* -------------------------------------------------------------------------- */
/* Priority → badge tone                                                      */
/* -------------------------------------------------------------------------- */

const PRIORITY_BADGE: Record<string, { tone: StatusTone; text: string }> = {
  low: { tone: "low", text: PLANNER.BADGES.LOW },
  medium: { tone: "medium", text: PLANNER.BADGES.MEDIUM },
  high: { tone: "high", text: PLANNER.BADGES.HIGH },
  critical: { tone: "critical", text: PLANNER.BADGES.CRITICAL },
};

function priorityBadge(
  priority: string,
): { tone: StatusTone; text: string } | undefined {
  return PRIORITY_BADGE[priority.toLowerCase().trim()];
}

/* -------------------------------------------------------------------------- */
/* Sprint status → tone + display text                                        */
/* -------------------------------------------------------------------------- */

const SPRINT_STATUS: Record<string, { tone: StatusTone; text: string }> = {
  planned: { tone: "neutral", text: PLANNER.STATUS.PLANNED },
  active: { tone: "info", text: PLANNER.STATUS.ACTIVE },
  in_progress: { tone: "info", text: PLANNER.STATUS.ACTIVE },
  on_track: { tone: "low", text: PLANNER.STATUS.ON_TRACK },
  completed: { tone: "low", text: PLANNER.STATUS.COMPLETED },
  done: { tone: "low", text: PLANNER.STATUS.COMPLETED },
  at_risk: { tone: "medium", text: PLANNER.STATUS.AT_RISK },
  behind: { tone: "high", text: PLANNER.STATUS.BEHIND },
  behind_schedule: { tone: "high", text: PLANNER.STATUS.BEHIND },
};

function sprintStatus(status: string): { tone: StatusTone; text: string } {
  return (
    SPRINT_STATUS[status.toLowerCase().trim()] ?? {
      tone: "neutral",
      text: status,
    }
  );
}

/** Whether a sprint status represents a completed sprint. */
function isSprintDone(status: string): boolean {
  const normalized = status.toLowerCase().trim();
  return normalized === "completed" || normalized === "done";
}

/* -------------------------------------------------------------------------- */
/* View-model mappers                                                          */
/* -------------------------------------------------------------------------- */

/** Maps a sprint to a selector option, marking `active` when it matches `selectedId`. */
export function toSprintOption(
  sprint: SprintResponse,
  selectedId?: string,
): SprintOption {
  return {
    id: sprint.id,
    label: `${PLANNER.CONTROLS.SPRINT_PREFIX} ${sprint.sprint_number}: ${sprint.name}`,
    done: isSprintDone(sprint.status),
    active: sprint.id === selectedId,
  };
}

/** Derives the summary-bar view-model from a sprint. */
export function toSprintSummary(sprint: SprintResponse): SprintSummary {
  const committed = sprint.committed_points;
  const completed = sprint.completed_points;
  const remaining = committed - completed;
  const progress =
    committed > 0 ? Math.round((completed / committed) * 100) : 0;
  const start = formatDate(sprint.start_date);
  const end = formatDate(sprint.end_date);
  const dateRange =
    start && end
      ? `${start} – ${end}`
      : (start ?? end ?? PLANNER.SUMMARY.NO_DATES);
  const suffix = PLANNER.SUMMARY.POINTS_SUFFIX;

  return {
    name: sprint.name,
    dateRange,
    committed: `${committed} ${suffix}`,
    completed: `${completed} ${suffix}`,
    remaining: `${remaining} ${suffix}`,
    progress,
    status: sprintStatus(sprint.status),
  };
}

function assigneeMeta(task: TaskResponse): string {
  return `${task.estimated_hours}h · ${task.assignee_id ?? "Unassigned"}`;
}

/** Maps a task to a kanban card view-model. */
function toKanbanTask(task: TaskResponse): KanbanTask {
  return {
    id: task.id,
    title: task.title,
    meta: assigneeMeta(task),
    badge: priorityBadge(task.priority),
  };
}

/** Groups tasks into the five kanban columns keyed by their mapped status. */
export function toKanbanColumns(tasks: TaskResponse[]): KanbanColumn[] {
  const grouped = new Map<KanbanColumn["id"], KanbanTask[]>();
  for (const template of COLUMN_TEMPLATES) {
    grouped.set(template.id, []);
  }
  for (const task of tasks) {
    grouped.get(statusToColumnId(task.status))?.push(toKanbanTask(task));
  }
  return COLUMN_TEMPLATES.map((template) => ({
    ...template,
    tasks: grouped.get(template.id) ?? [],
  }));
}
