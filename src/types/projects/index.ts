/* -------------------------------------------------------------------------- */
/* API contract (server wire shapes — snake_case, bare responses)             */
/* -------------------------------------------------------------------------- */

/** A project record as returned by the projects endpoints. */
export interface Project {
  id: string;
  name: string;
  status: string;
  description: string | null;
  client_name: string | null;
  start_date: string | null;
  target_end_date: string | null;
  budget_usd: number | null;
  created_at: string;
  connect_erp?: boolean;
}

/** Body for creating a project (`POST /projects`). */
export interface CreateProjectDto {
  name: string;
  description?: string | null;
  client_name?: string | null;
  start_date?: string | null;
  target_end_date?: string | null;
  budget_usd?: number | null;
}

/** Body for updating a project (`PUT /projects/{id}`). All fields optional. */
export interface UpdateProjectDto {
  name?: string | null;
  description?: string | null;
  status?: string | null;
  client_name?: string | null;
  start_date?: string | null;
  target_end_date?: string | null;
  budget_usd?: number | null;
}

/** Aggregate metrics for a project (`GET /projects/{id}/dashboard`). */
export interface ProjectDashboard {
  project: Project;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  blocked_tasks: number;
  active_sprint: Record<string, unknown> | null;
  latest_risk_score: number | null;
  team_size: number;
  completion_percentage: number;
}

/* -------------------------------------------------------------------------- */
/* UI view-models (component-facing shapes, mapped from the API contract)     */
/* -------------------------------------------------------------------------- */

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  badgeTone?: string;
  badgeText?: string;
  progressValue?: number;
  caption?: string;
  alert?: string;
}

export interface DashboardChartPoint {
  label: string;
  ideal: number;
  actual: number | null;
}

export interface DashboardVelocityPoint {
  label: string;
  points: number;
}

export interface DashboardActivityItem {
  id: string;
  tone: "red" | "amber" | "indigo" | "emerald";
  titleStrong: string;
  titleRest: string;
  subtitle: string;
  timestamp: string;
}

export interface DashboardMilestone {
  id: string;
  label: string;
  badgeTone: string;
  badgeText: string;
  progressValue: number;
  date: string;
}
