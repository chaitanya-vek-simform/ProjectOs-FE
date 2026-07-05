import { LABELS } from "@/constants/labels";

import type { StatusTone } from "@/types/common";

const RES = LABELS.RESOURCES;

/* -------------------------------------------------------------------------- */
/* API contract (server wire shapes — snake_case, bare responses)             */
/* -------------------------------------------------------------------------- */

/** A single team member (`GET /resources/team`). */
export interface TeamMemberResponse {
  id: string;
  name: string;
  role: string;
  skills: string[];
  experience_years: number;
  hourly_rate: number;
}

/** A member's utilization summary (`GET /resources/utilization`). */
export interface UtilizationResponse {
  user_id: string;
  name: string;
  role: string;
  active_tasks: number;
  estimated_utilization_pct: number;
}

/** Multi-facet ratings for a suggested member. */
export interface SuggestedMemberRatings {
  overall: number;
  ai: number;
  communication: number;
}

/** A member suggested for a role inside `recommendations`. */
export interface SuggestedMember {
  id: string;
  name: string;
  skills: string[];
  role?: string;
  experience_years?: number;
  hourly_rate?: number;
  match_score?: number;
  rationale?: string;
  avatar_url?: string;
  designation?: string;
  department?: string;
  stack?: string;
  availability_pct?: number;
  current_allocation_pct?: number;
  on_leave?: boolean;
  in_notice_period?: boolean;
  is_contractor?: boolean;
  ratings?: SuggestedMemberRatings;
}

/** One role recommendation from the AI suggest endpoint. */
export interface SuggestRecommendation {
  role: string;
  count_needed: number;
  suggested_members: SuggestedMember[];
  gap?: string | null;
}

/** AI team suggestion (`POST /projects/{id}/resources/suggest`). */
export interface SuggestTeamResponse {
  total_story_points: number;
  estimated_sprints: number;
  method?: string;
  source?: string;
  summary?: string;
  recommendations: SuggestRecommendation[];
}

/* -------------------------------------------------------------------------- */
/* Project team persistence (`/projects/{id}/team`)                           */
/* -------------------------------------------------------------------------- */

/** Where a saved team member originated. */
export type TeamMemberSource = "internal" | "simerp";

/** Profile snapshot sent when saving/adding a member. */
export interface TeamMemberInput {
  member_ref: string;
  source: TeamMemberSource;
  name: string;
  role: string;
  email?: string | null;
  designation?: string | null;
  department?: string | null;
  stack?: string | null;
  skills: string[];
  experience_years?: number | null;
  hourly_rate?: number | null;
  availability_pct?: number | null;
  current_allocation_pct?: number | null;
  on_leave?: boolean | null;
  in_notice_period?: boolean | null;
  is_contractor?: boolean | null;
  ratings?: Record<string, number> | null;
  match_score?: number | null;
  rationale?: string | null;
  avatar_url?: string | null;
  allocation_pct?: number;
}

/** Partial update for a saved team member (`PATCH .../members/{id}`). */
export type TeamMemberUpdate = Partial<
  Omit<TeamMemberInput, "member_ref" | "source">
>;

/** A persisted team member as returned by the team endpoints. */
export interface SavedTeamMember extends TeamMemberInput {
  id: string;
  project_id: string;
  created_at: string;
}

/** The saved team for a project (`GET/POST /projects/{id}/team`). */
export interface ProjectTeamResponse {
  project_id: string;
  member_count: number;
  members: SavedTeamMember[];
}

/* -------------------------------------------------------------------------- */
/* View models (UI-facing)                                                    */
/* -------------------------------------------------------------------------- */

/** Tailwind background utility for a team-member avatar circle. */
export type AvatarTone =
  "bg-purple-500" | "bg-blue-500" | "bg-pink-500" | "bg-emerald-500";

/** A single team member row in the Team Members table. */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  ratePerDay: string;
  avatarTone: AvatarTone;
  /** Progress-bar fill value, clamped 0–100. */
  utilizationValue: number;
  /** Tailwind background utility for the progress fill. */
  utilizationFill: string;
  /** Display text for the utilization percentage. */
  utilizationLabel: string;
  /** Tailwind text-color utility for the utilization label. */
  utilizationLabelClass: string;
  status: {
    tone: StatusTone;
    label: string;
  };
}

/** A member picked in the AI-suggestion dialog, tagged with the role it fills. */
export interface SelectedMember {
  role: string;
  member: SuggestedMember;
}

/** A single heatmap cell value: a numeric utilization %, on-leave, or empty. */
export type HeatmapCellValue = number | null | "Leave";

/** A row in the cross-sprint utilization heatmap. */
export interface HeatmapRow {
  id: string;
  member: string;
  /** One cell per week (Week 1..Week N). */
  cells: HeatmapCellValue[];
}

/* -------------------------------------------------------------------------- */
/* Transforms (wire shape → view model)                                       */
/* -------------------------------------------------------------------------- */

export const AVATAR_TONES: AvatarTone[] = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-emerald-500",
];

export interface UtilizationPresentation {
  value: number;
  fill: string;
  labelClass: string;
  status: { tone: StatusTone; label: string };
}

/**
 * Derive utilization visuals and status from a single percentage. No API
 * returns an explicit status, so it is inferred from the utilization band:
 * >100% overloaded, 80–100% near capacity, 1–79% available, 0% blocked.
 */
export function toUtilizationPresentation(
  pct: number,
): UtilizationPresentation {
  if (pct > 100) {
    return {
      value: 100,
      fill: "bg-red-500",
      labelClass: "text-red-500",
      status: { tone: "critical", label: RES.STATUS.OVERLOADED },
    };
  }
  if (pct <= 0) {
    return {
      value: 0,
      fill: "bg-red-400",
      labelClass: "text-amber-500",
      status: { tone: "high", label: RES.STATUS.BLOCKED },
    };
  }
  if (pct >= 80) {
    return {
      value: pct,
      fill: "bg-amber-400",
      labelClass: "text-amber-500",
      status: { tone: "medium", label: RES.STATUS.NEAR_CAPACITY },
    };
  }
  return {
    value: pct,
    fill: "bg-emerald-400",
    labelClass: "text-emerald-500",
    status: { tone: "low", label: RES.STATUS.AVAILABLE },
  };
}

/**
 * Build heatmap rows from the utilization list. No weekly series is available,
 * so the real aggregate utilization occupies the first week column and the
 * remaining weeks render as empty cells.
 */
export function toHeatmapRows(
  utilization: UtilizationResponse[],
  weekCount: number,
): HeatmapRow[] {
  return utilization.map((u) => ({
    id: u.user_id,
    member: u.name,
    cells: Array.from({ length: weekCount }, (_, index): HeatmapCellValue =>
      index === 0 ? u.estimated_utilization_pct : null,
    ),
  }));
}

/** Humanise a snake_case role key (e.g. "tech_lead" → "Tech Lead"). */
export function formatRoleLabel(role: string): string {
  return role
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
