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

/** A member suggested for a role inside `recommendations`. */
export interface SuggestedMember {
  id: string;
  name: string;
  skills: string[];
}

/** One role recommendation from the AI suggest endpoint. */
export interface SuggestRecommendation {
  role: string;
  count_needed: number;
  suggested_members: SuggestedMember[];
}

/** AI team suggestion (`POST /projects/{id}/resources/suggest`). */
export interface SuggestTeamResponse {
  total_story_points: number;
  estimated_sprints: number;
  recommendations: SuggestRecommendation[];
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

const AVATAR_TONES: AvatarTone[] = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-emerald-500",
];

interface UtilizationPresentation {
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
function toUtilizationPresentation(pct: number): UtilizationPresentation {
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
 * Merge the team roster with the utilization list (joined on member id ↔
 * user_id) into the Team Members table view model. Members without a matching
 * utilization row default to 0%.
 */
export function toTeamMembers(
  team: TeamMemberResponse[],
  utilization: UtilizationResponse[],
): TeamMember[] {
  const pctByUser = new Map(
    utilization.map((u) => [u.user_id, u.estimated_utilization_pct]),
  );
  return team.map((member, index) => {
    const pct = pctByUser.get(member.id) ?? 0;
    const presentation = toUtilizationPresentation(pct);
    return {
      id: member.id,
      name: member.name,
      role: member.role,
      skills: member.skills,
      ratePerDay: `$${member.hourly_rate}`,
      avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
      utilizationValue: presentation.value,
      utilizationFill: presentation.fill,
      utilizationLabel: `${pct}%`,
      utilizationLabelClass: presentation.labelClass,
      status: presentation.status,
    };
  });
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

/**
 * TEMPORARY: build Team Members rows from a freshly created selection so the
 * new members render immediately. Replace with a refetch of `useTeam` once the
 * Create Team endpoint is wired.
 */
export function toCreatedTeamMembers(
  selections: SelectedMember[],
): TeamMember[] {
  return selections.map((selection, index) => ({
    id: selection.member.id,
    name: selection.member.name,
    role: formatRoleLabel(selection.role),
    skills: selection.member.skills,
    ratePerDay: "—",
    avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
    utilizationValue: 0,
    utilizationFill: "bg-slate-300",
    utilizationLabel: "—",
    utilizationLabelClass: "text-slate-400",
    status: { tone: "neutral", label: RES.STATUS.AVAILABLE },
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
