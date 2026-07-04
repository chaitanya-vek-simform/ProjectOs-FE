import { LABELS } from "@/constants/labels";

const FACTORS = LABELS.RISK.FACTORS;

/** Static metadata for a single risk-factor row: its wire key, label and cap. */
export interface RiskFactorMeta {
  /** snake_case key in `RiskSnapshotResponse.risk_factors`. */
  key: string;
  /** Human-readable label shown in the breakdown. */
  label: string;
  /** Maximum score this factor can contribute (caps sum to `RISK_MAX_SCORE`). */
  max: number;
}

/**
 * The five scored contributors to the overall risk score, in display order.
 * The `max` caps mirror the backend's scoring model (20 + 25 + 20 + 20 + 15 = 100).
 */
export const RISK_FACTOR_META: RiskFactorMeta[] = [
  { key: "overallocation", label: FACTORS.OVERALLOCATION, max: 20 },
  { key: "velocity_drop", label: FACTORS.VELOCITY_DROP, max: 25 },
  { key: "blocked_tasks", label: FACTORS.BLOCKED_TASKS, max: 20 },
  { key: "milestone_drift", label: FACTORS.MILESTONE_DRIFT, max: 20 },
  { key: "scope_creep", label: FACTORS.SCOPE_CREEP, max: 15 },
  { key: "meeting_risk", label: FACTORS.MEETING_RISK, max: 10 },
];

/** Total achievable risk score across all factors. */
export const RISK_MAX_SCORE = 100;
