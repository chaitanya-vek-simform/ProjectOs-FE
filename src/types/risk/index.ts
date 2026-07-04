import { format, isValid, parseISO } from "date-fns";

import { LABELS } from "@/constants/labels";
import { RISK_FACTOR_META, RISK_MAX_SCORE } from "@/constants/risk/factors";

import type { StatusTone } from "@/types/common";

const L = LABELS.RISK;

/* -------------------------------------------------------------------------- */
/* API contract (server wire shapes — snake_case, bare responses)             */
/* -------------------------------------------------------------------------- */

/** A single AI-generated mitigation entry inside `recommendations`. */
export interface RiskRecommendation {
  action: string;
  priority: string;
  owner_role: string;
  expected_impact: string;
}

/** A computed risk snapshot (`GET /projects/{id}/risk/latest`). */
export interface RiskSnapshotResponse {
  id: string;
  project_id: string;
  sprint_id: string | null;
  risk_score: number;
  risk_level: string;
  risk_factors: Record<string, unknown>;
  recommendations: unknown[];
  llm_explanation: string | null;
  computed_at: string;
}

/** Risk trend over time (`GET /projects/{id}/risk/history`). */
export interface RiskHistoryResponse {
  snapshots: RiskSnapshotResponse[];
  trend: string;
  average_score: number;
}

/** Async task handle returned by `POST /projects/{id}/risk/compute`. */
export interface RiskComputeTaskResponse {
  task_id: string;
  type: string;
  status: string;
  project_id: string;
  detail: string;
}

/** Status of a background task (`GET /tasks/{task_id}`). */
export interface RiskTaskStatusResponse {
  task_id?: string;
  id?: string;
  type?: string;
  status: string;
  detail?: string | null;
}

/* -------------------------------------------------------------------------- */
/* UI view-models (component-facing shapes, mapped from the API contract)      */
/* -------------------------------------------------------------------------- */

type FactorTone = "orange" | "red" | "amber" | "emerald";

/** A single scored contributor to the overall risk score. */
export type RiskFactor = {
  id: string;
  label: string;
  score: string;
  scoreTone: FactorTone;
  progressValue: number;
  fillClassName: string;
};

/** A prioritised mitigation the team should take. */
export type RecommendedAction = {
  id: string;
  order: number;
  title: string;
  detail: string;
  priorityLabel: string | null;
  ownerLabel: string | null;
  circleClassName: string;
  boxClassName: string;
};

/** A single point on the risk-score-over-time trend. */
export type RiskHistoryPoint = {
  label: string;
  score: number;
};

/** Threshold boundaries for the semicircular risk gauge. */
export type RiskGaugeConfig = {
  value: number;
  max: number;
  tone: StatusTone;
  levelLabel: string;
  computedLabel: string | null;
};

/* -------------------------------------------------------------------------- */
/* Narrowing helpers                                                           */
/* -------------------------------------------------------------------------- */

/** Narrow an unknown value to a non-empty trimmed string, else null. */
function toText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

/** Narrow an unknown value to a finite number, else 0. */
function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** Treat an unknown array entry as a keyed record for best-effort field lookup. */
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

/** Title-case a snake_case / space-separated token (e.g. "tech_lead" → "Tech Lead"). */
function humanize(value: string): string {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/* -------------------------------------------------------------------------- */
/* Mappers — API wire shapes → UI-facing shapes                               */
/* -------------------------------------------------------------------------- */

const LEVEL_TONE: Record<string, StatusTone> = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
};

const LEVEL_LABEL: Record<string, string> = {
  low: L.LEVEL.LOW,
  medium: L.LEVEL.MEDIUM,
  high: L.LEVEL.HIGH,
  critical: L.LEVEL.CRITICAL,
};

/** Maps a risk level string into a `StatusBadge` tone. */
export function riskLevelToTone(level: string): StatusTone {
  return LEVEL_TONE[level?.toLowerCase()] ?? "neutral";
}

/** Human-readable label for a risk level, falling back to the raw value. */
export function riskLevelToLabel(level: string): string {
  return LEVEL_LABEL[level?.toLowerCase()] ?? level?.toUpperCase();
}

const FILL_CLASS: Record<FactorTone, string> = {
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
  orange: "bg-orange-500",
  red: "bg-red-500",
};

/** Tailwind text-color class for a factor score, keyed by tone. */
export const FACTOR_SCORE_CLASS: Record<FactorTone, string> = {
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  orange: "text-orange-500",
  red: "text-red-500",
};

/** Escalate the tone as a factor consumes more of its cap. */
function factorTone(ratio: number): FactorTone {
  if (ratio <= 0) return "emerald";
  if (ratio < 0.5) return "amber";
  if (ratio < 0.85) return "orange";
  return "red";
}

/** Format an ISO timestamp as "dd MMM yyyy · HH:mm", or null when invalid. */
export function formatComputedAt(
  iso: string | null | undefined,
): string | null {
  if (!iso) return null;
  const date = parseISO(iso);
  return isValid(date) ? format(date, "dd MMM yyyy · HH:mm") : null;
}

/** Format an ISO timestamp as a short axis label "dd MMM", or "" when invalid. */
function formatAxisDate(iso: string): string {
  const date = parseISO(iso);
  return isValid(date) ? format(date, "dd MMM") : "";
}

/** Maps a snapshot into the gauge configuration (value, tone, level, timestamp). */
export function toGaugeConfig(snapshot: RiskSnapshotResponse): RiskGaugeConfig {
  return {
    value: toNumber(snapshot.risk_score),
    max: RISK_MAX_SCORE,
    tone: riskLevelToTone(snapshot.risk_level),
    levelLabel: riskLevelToLabel(snapshot.risk_level),
    computedLabel: formatComputedAt(snapshot.computed_at),
  };
}

/** Maps a snapshot's `risk_factors` map into ordered, scored breakdown rows. */
export function toRiskFactors(snapshot: RiskSnapshotResponse): RiskFactor[] {
  const factors = snapshot.risk_factors ?? {};
  return RISK_FACTOR_META.map((meta) => {
    const value = toNumber(factors[meta.key]);
    const ratio = meta.max > 0 ? value / meta.max : 0;
    const tone = factorTone(ratio);
    return {
      id: meta.key,
      label: meta.label,
      score: L.DYNAMIC.SCORE(value, meta.max),
      scoreTone: tone,
      progressValue: Math.round(Math.min(1, ratio) * 100),
      fillClassName: FILL_CLASS[tone],
    };
  });
}

const PRIORITY_WEIGHT: Record<string, number> = {
  immediate: 0,
  this_sprint: 1,
  this_week: 2,
};

const PRIORITY_LABEL: Record<string, string> = {
  immediate: L.ACTIONS.PRIORITY.IMMEDIATE,
  this_sprint: L.ACTIONS.PRIORITY.THIS_SPRINT,
  this_week: L.ACTIONS.PRIORITY.THIS_WEEK,
};

const OWNER_LABEL: Record<string, string> = {
  project_manager: L.ACTIONS.OWNER.PROJECT_MANAGER,
  product_owner: L.ACTIONS.OWNER.PRODUCT_OWNER,
  tech_lead: L.ACTIONS.OWNER.TECH_LEAD,
  scrum_master: L.ACTIONS.OWNER.SCRUM_MASTER,
};

/** Circle-badge and box tint per priority, most urgent first. */
const ACTION_STYLE: Record<string, { circle: string; box: string }> = {
  immediate: { circle: "bg-red-500", box: "border-red-100 bg-red-50" },
  this_sprint: {
    circle: "bg-orange-500",
    box: "border-orange-100 bg-orange-50",
  },
  this_week: { circle: "bg-amber-500", box: "border-amber-100 bg-amber-50" },
  default: { circle: "bg-indigo-500", box: "border-indigo-100 bg-indigo-50" },
};

/** Maps a snapshot's `recommendations` into ordered, styled action cards. */
export function toRecommendedActions(
  snapshot: RiskSnapshotResponse,
): RecommendedAction[] {
  return snapshot.recommendations
    .map((raw, index) => {
      const record = asRecord(raw);
      const priority = (toText(record.priority) ?? "").toLowerCase();
      const owner = (toText(record.owner_role) ?? "").toLowerCase();
      return { record, priority, owner, index };
    })
    .sort(
      (a, b) =>
        (PRIORITY_WEIGHT[a.priority] ?? 99) -
          (PRIORITY_WEIGHT[b.priority] ?? 99) || a.index - b.index,
    )
    .map(({ record, priority, owner, index }, order) => {
      const style = ACTION_STYLE[priority] ?? ACTION_STYLE.default;
      return {
        id: toText(record.id) ?? String(index),
        order: order + 1,
        title: toText(record.action) ?? "",
        detail: toText(record.expected_impact) ?? "",
        priorityLabel: priority
          ? (PRIORITY_LABEL[priority] ?? humanize(priority))
          : null,
        ownerLabel: owner ? (OWNER_LABEL[owner] ?? humanize(owner)) : null,
        circleClassName: style.circle,
        boxClassName: style.box,
      };
    });
}

/** Splits the LLM explanation into display paragraphs (blank-line delimited). */
export function toAnalysisParagraphs(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Maps history snapshots into chronological chart points. */
export function toRiskHistoryPoints(
  history: RiskHistoryResponse,
): RiskHistoryPoint[] {
  return [...history.snapshots]
    .sort((a, b) => a.computed_at.localeCompare(b.computed_at))
    .map((snapshot) => ({
      label: formatAxisDate(snapshot.computed_at),
      score: toNumber(snapshot.risk_score),
    }));
}

const TREND_LABEL: Record<string, string> = {
  improving: L.HISTORY.TREND.IMPROVING,
  stable: L.HISTORY.TREND.STABLE,
  worsening: L.HISTORY.TREND.WORSENING,
};

/** Human-readable label for a history trend, falling back to the raw value. */
export function trendToLabel(trend: string): string {
  return TREND_LABEL[trend?.toLowerCase()] ?? trend;
}
