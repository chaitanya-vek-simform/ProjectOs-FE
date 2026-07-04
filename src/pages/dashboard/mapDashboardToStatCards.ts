import { LABELS } from "@/constants/labels";

import type { StatCard } from "@/types/dashboard";
import type { ProjectDashboard } from "@/types/projects";
import type { StatusTone } from "@/types/common";

const STATS = LABELS.DASHBOARD.STATS;

function getRiskTone(score: number): StatusTone {
  if (score < 33) return "low";
  if (score < 66) return "medium";
  if (score < 85) return "high";
  return "critical";
}

function getRiskBadgeText(score: number): string {
  if (score < 33) return STATS.RISK_BADGE_LOW;
  if (score < 66) return STATS.RISK_BADGE_MEDIUM;
  if (score < 85) return STATS.RISK_BADGE_HIGH;
  return STATS.RISK_BADGE_CRITICAL;
}

function buildRiskScoreCard(latestRiskScore: number | null): StatCard {
  if (latestRiskScore === null) {
    return {
      id: "risk-score",
      label: STATS.RISK_SCORE,
      value: STATS.RISK_NOT_AVAILABLE,
    };
  }

  return {
    id: "risk-score",
    label: STATS.RISK_SCORE,
    value: String(latestRiskScore),
    suffix: STATS.RISK_SUFFIX,
    badge: {
      tone: getRiskTone(latestRiskScore),
      text: getRiskBadgeText(latestRiskScore),
    },
  };
}

/** Maps the /projects/{id}/dashboard response into the 7 top-row stat cards. */
export function mapDashboardToStatCards(
  dashboard: ProjectDashboard,
): StatCard[] {
  const {
    total_tasks,
    completed_tasks,
    in_progress_tasks,
    blocked_tasks,
    latest_risk_score,
    team_size,
    completion_percentage,
  } = dashboard;

  const cards: StatCard[] = [
    buildRiskScoreCard(latest_risk_score),
    {
      id: "completion",
      label: STATS.COMPLETION,
      value: String(completion_percentage),
      suffix: STATS.COMPLETION_SUFFIX,
      progress: {
        value: completion_percentage,
        fillClassName: "bg-indigo-500",
      },
      caption: STATS.COMPLETION_CAPTION_TEMPLATE.replace(
        "{completed}",
        String(completed_tasks),
      ).replace("{total}", String(total_tasks)),
    },
    {
      id: "total-tasks",
      label: STATS.TOTAL_TASKS,
      value: String(total_tasks),
      suffix: STATS.TOTAL_TASKS_SUFFIX,
    },
    {
      id: "completed-tasks",
      label: STATS.COMPLETED_TASKS,
      value: String(completed_tasks),
      suffix: STATS.COMPLETED_TASKS_SUFFIX,
    },
    {
      id: "in-progress-tasks",
      label: STATS.IN_PROGRESS_TASKS,
      value: String(in_progress_tasks),
      suffix: STATS.IN_PROGRESS_TASKS_SUFFIX,
    },
    {
      id: "blocked-tasks",
      label: STATS.BLOCKED_TASKS,
      value: String(blocked_tasks),
      suffix: STATS.BLOCKED_TASKS_SUFFIX,
      alert:
        blocked_tasks > 0
          ? STATS.OPEN_TASKS_ALERT_TEMPLATE.replace(
              "{count}",
              String(blocked_tasks),
            )
          : undefined,
    },
    {
      id: "team-size",
      label: STATS.TEAM_SIZE,
      value: String(team_size),
      suffix: STATS.TEAM_SIZE_SUFFIX,
    },
  ];

  return cards;
}
