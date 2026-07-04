import type { StatusTone } from "@/types/common";

/* -------------------------------------------------------------------------- */
/* API contract (server wire shapes — snake_case, bare responses)             */
/* -------------------------------------------------------------------------- */

/** Body for creating a sprint (`POST /projects/{id}/sprints`). */
export interface SprintCreate {
  name: string;
  goal?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  capacity_points?: number;
}

/** A sprint as returned by the sprints endpoints. */
export interface SprintResponse {
  id: string;
  project_id: string;
  sprint_number: number;
  name: string;
  goal: string | null;
  start_date: string | null;
  end_date: string | null;
  capacity_points: number;
  committed_points: number;
  completed_points: number;
  status: string;
}

/** Body for creating a task (`POST /projects/{id}/tasks`). */
export interface TaskCreate {
  title: string;
  description?: string | null;
  priority?: string;
  task_type?: string;
  estimated_hours?: number;
  story_id?: string | null;
  sprint_id?: string | null;
  assignee_id?: string | null;
  due_date?: string | null;
  suggested_role?: string | null;
}

/** A task as returned by the tasks endpoints. */
export interface TaskResponse {
  id: string;
  project_id: string;
  sprint_id: string | null;
  story_id: string | null;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  task_type: string;
  estimated_hours: number;
  actual_hours: number;
  due_date: string | null;
  suggested_role: string | null;
  created_at: string;
}

/** Body for updating a task (`PUT /tasks/{id}`). */
export interface TaskUpdate {
  title?: string | null;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  sprint_id?: string | null;
  assignee_id?: string | null;
  estimated_hours?: number | null;
  actual_hours?: number | null;
  due_date?: string | null;
}

/** Lifecycle state of an async AI task. */
export type TaskProgressStatus = "pending" | "running" | "completed" | "failed";

/** Poll result of `GET /tasks/{task_id}` for async AI operations. */
export interface TaskStatus {
  task_id: string;
  type: string;
  resource_id: string | null;
  project_id: string | null;
  status: TaskProgressStatus;
  progress: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

/* -------------------------------------------------------------------------- */
/* UI view-models (component-facing shapes, mapped from the API contract)     */
/* -------------------------------------------------------------------------- */

/** Which board view is currently active. */
export type PlannerView = "kanban" | "gantt";

/** Optional escalation/blocking context attached to a blocked task. */
export interface BlockedInfo {
  /** Short blocked-duration label (e.g. "52h"). */
  duration: string;
  /** Free-text reason / escalation note. */
  reason: string;
}

/** A single kanban task card. */
export interface KanbanTask {
  id: string;
  title: string;
  /** Combined points + assignee/date meta line (e.g. "13 pts · Sarah C."). */
  meta: string;
  /** Semantic tone + text for the status badge (absent for done cards). */
  badge?: { tone: StatusTone; text: string };
  /** In-progress completion percentage, 0–100. */
  progress?: number;
  /** Muted caption shown under an in-progress progress bar. */
  progressCaption?: string;
  /** Escalation context for blocked cards. */
  blockedInfo?: BlockedInfo;
}

/** Visual style variants a column can adopt. */
export type KanbanColumnVariant = "default" | "blocked";

/** Accent color applied to a column's header dot. */
export type KanbanDotTone = "slate" | "blue" | "purple" | "emerald" | "red";

/** A kanban board column with its tasks. */
export interface KanbanColumn {
  id: string;
  label: string;
  dotTone: KanbanDotTone;
  /** Whether the header dot pulses (used for In Progress). */
  dotPulse?: boolean;
  variant?: KanbanColumnVariant;
  /** Whether cards render in the compact "done" style (line-through + dimmed). */
  doneStyle?: boolean;
  tasks: KanbanTask[];
}

/** Header summary metrics for the active sprint. */
export interface SprintSummary {
  name: string;
  dateRange: string;
  committed: string;
  completed: string;
  remaining: string;
  progress: number;
  status: { tone: StatusTone; text: string };
}

/** A sprint option in the sprint selector group. */
export interface SprintOption {
  id: string;
  label: string;
  /** Whether the sprint is completed (shows a check + muted style). */
  done?: boolean;
  /** Whether the sprint is the active selection (indigo). */
  active?: boolean;
}
