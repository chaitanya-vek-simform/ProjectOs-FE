import { LABELS } from "@/constants/labels";

import type { StatusTone } from "@/types/common";

/* -------------------------------------------------------------------------- */
/* API contract (server wire shapes — snake_case, bare responses)             */
/* -------------------------------------------------------------------------- */

/** The editable content of a proposal — shared by the full response and the AI-edit diff. */
export interface ProposalContent {
  executive_summary: string | null;
  technical_approach: string | null;
  architecture: Record<string, unknown>;
  team_composition: unknown[];
  timeline: unknown[];
  cost_breakdown: unknown[];
  risks: unknown[];
  total_cost_usd: number | null;
  total_days: number | null;
}

/** A generated proposal as returned by `GET /projects/{id}/proposal`. */
export interface ProposalResponse extends ProposalContent {
  id: string;
  project_id: string;
  status: string;
}

/** The async generation job created by `POST /projects/{id}/proposal/generate`. */
export interface ProposalGenerationTask {
  task_id: string;
  type: string;
  status: string;
  proposal_id: string;
  project_id: string;
}

/** Lifecycle state of an async proposal-generation task. */
export type ProposalTaskProgress =
  "pending" | "running" | "completed" | "failed";

/** Poll result of `GET /tasks/{task_id}` for proposal generation. */
export interface ProposalTaskStatus {
  task_id: string;
  type: string;
  resource_id: string | null;
  project_id: string | null;
  status: ProposalTaskProgress;
  progress: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

/** Body for updating a proposal (`PUT /projects/{id}/proposal`). */
export interface ProposalUpdate {
  executive_summary?: string | null;
  technical_approach?: string | null;
  architecture?: Record<string, unknown> | null;
  team_composition?: unknown[] | null;
  timeline?: unknown[] | null;
  cost_breakdown?: unknown[] | null;
  risks?: unknown[] | null;
  status?: string | null;
}

/** Body for `POST /projects/{id}/proposal/ai-edit`. */
export interface AiEditProposalDto {
  instruction: string;
}

/** Diff returned by the AI-edit endpoint — `proposed` is the AI-updated content. */
export interface ProposalAiEditResponse {
  artifact_type: string;
  artifact_id: string;
  change_summary: string;
  current: ProposalContent;
  proposed: ProposalContent;
}

/* -------------------------------------------------------------------------- */
/* UI-facing shapes                                                            */
/* -------------------------------------------------------------------------- */

/** A single component in the proposed architecture. */
export interface ArchitectureComponent {
  name: string;
  purpose: string;
  technology: string;
}

/** The proposed architecture: the reasoning behind it and its components. */
export interface ArchitectureOverview {
  rationale: string;
  components: ArchitectureComponent[];
}

/** A single role in the proposed team composition. */
export interface TeamMember {
  role: string;
  count?: number;
  skills: string[];
  rationale?: string;
}

/** A single line item in the effort & cost estimate. */
export interface CostBreakdownItem {
  role: string;
  module: string;
  days: number;
  rateUsd: number;
  costUsd: number;
}

/** A single phase of the delivery timeline. */
export interface TimelinePhase {
  phase: string;
  durationWeeks: number;
  deliverables: string[];
}

/** A single identified project risk. */
export interface ProposalRisk {
  risk: string;
  impact: string;
  probability: string;
  mitigation: string;
}

/** A generated technical proposal document, mapped for display. */
export interface Proposal {
  id: string;
  projectId: string;
  status: string;
  statusLabel: string;
  statusTone: StatusTone;
  executiveSummaryParagraphs: string[];
  technicalApproachParagraphs: string[];
  architecture: ArchitectureOverview | null;
  teamComposition: TeamMember[];
  timeline: TimelinePhase[];
  costBreakdown: CostBreakdownItem[];
  risks: ProposalRisk[];
  totalCostLabel: string;
  totalDaysLabel: string;
}

/* -------------------------------------------------------------------------- */
/* Mappers — API wire shapes → UI-facing shapes                               */
/* -------------------------------------------------------------------------- */

const L = LABELS.PROPOSAL;

const STATUS_META: Record<string, { label: string; tone: StatusTone }> = {
  draft: { label: L.STATUS.DRAFT, tone: "neutral" },
  pending: { label: L.STATUS.GENERATING, tone: "medium" },
  generating: { label: L.STATUS.GENERATING, tone: "medium" },
  completed: { label: L.STATUS.COMPLETED, tone: "low" },
  approved: { label: L.STATUS.APPROVED, tone: "low" },
  failed: { label: L.STATUS.FAILED, tone: "critical" },
};

/** Statuses that mean generation is still in progress on the backend. */
const IN_PROGRESS_STATUSES = new Set(["pending", "generating"]);

/** Whether a `ProposalResponse.status` (or generation task status) means "still working". */
export function isProposalInProgress(status: string): boolean {
  return IN_PROGRESS_STATUSES.has(status.toLowerCase());
}

/** Splits a free-text field into non-empty paragraphs. */
function toParagraphs(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringField(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Best-effort parse of the untyped `architecture` field into rationale + components. */
function toArchitectureOverview(
  architecture: Record<string, unknown>,
): ArchitectureOverview | null {
  const rationale = toStringField(architecture.rationale);
  const rawComponents = Array.isArray(architecture.components)
    ? architecture.components
    : [];
  const components: ArchitectureComponent[] = rawComponents
    .filter(isRecord)
    .map((component) => ({
      name: toStringField(component.name),
      purpose: toStringField(component.purpose),
      technology: toStringField(component.technology),
    }));

  if (!rationale && components.length === 0) return null;
  return { rationale, components };
}

/** Best-effort parse of an untyped `team_composition` entry. */
function toTeamMember(entry: unknown): TeamMember | null {
  if (!isRecord(entry)) return null;
  const role = toStringField(entry.role);
  if (!role) return null;

  return {
    role,
    count: typeof entry.count === "number" ? entry.count : undefined,
    skills: Array.isArray(entry.skills)
      ? entry.skills.filter(
          (skill): skill is string => typeof skill === "string",
        )
      : [],
    rationale: toStringField(entry.rationale) || undefined,
  };
}

function toTitleCase(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toNumberField(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

/** Maps a severity-ish string (impact, priority, probability) to a badge tone. */
export function severityToTone(value: string): StatusTone {
  switch (value.toLowerCase()) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "neutral";
  }
}

/** Best-effort parse of an untyped `cost_breakdown` entry. */
function toCostBreakdownItem(entry: unknown): CostBreakdownItem | null {
  if (!isRecord(entry)) return null;
  const role = toStringField(entry.role);
  if (!role) return null;

  return {
    role,
    module: toStringField(entry.module),
    days: toNumberField(entry.days),
    rateUsd: toNumberField(entry.rate_usd),
    costUsd: toNumberField(entry.cost_usd),
  };
}

/** Best-effort parse of an untyped `timeline` entry. */
function toTimelinePhase(entry: unknown): TimelinePhase | null {
  if (!isRecord(entry)) return null;
  const phase = toStringField(entry.phase);
  if (!phase) return null;

  return {
    phase,
    durationWeeks: toNumberField(entry.duration_weeks),
    deliverables: Array.isArray(entry.deliverables)
      ? entry.deliverables.filter(
          (deliverable): deliverable is string =>
            typeof deliverable === "string",
        )
      : [],
  };
}

/** Best-effort parse of an untyped `risks` entry. */
function toProposalRisk(entry: unknown): ProposalRisk | null {
  if (!isRecord(entry)) return null;
  const risk = toStringField(entry.risk);
  if (!risk) return null;

  return {
    risk,
    impact: toStringField(entry.impact),
    probability: toStringField(entry.probability),
    mitigation: toStringField(entry.mitigation),
  };
}

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Maps a `ProposalResponse` from the API into the document UI shape. */
export function toProposal(response: ProposalResponse): Proposal {
  const statusKey = response.status.toLowerCase();
  const statusMeta: { label: string; tone: StatusTone } = STATUS_META[
    statusKey
  ] ?? {
    label: toTitleCase(statusKey || response.status),
    tone: "neutral",
  };

  const costBreakdown = response.cost_breakdown
    .map(toCostBreakdownItem)
    .filter((item): item is CostBreakdownItem => item !== null);

  // Derive the engagement total from the breakdown rows so it always matches the
  // per-role days shown in the table, rather than trusting `response.total_days`.
  const totalDays = costBreakdown.reduce((sum, item) => sum + item.days, 0);

  return {
    id: response.id,
    projectId: response.project_id,
    status: response.status,
    statusLabel: statusMeta.label,
    statusTone: statusMeta.tone,
    executiveSummaryParagraphs: toParagraphs(response.executive_summary),
    technicalApproachParagraphs: toParagraphs(response.technical_approach),
    architecture: toArchitectureOverview(response.architecture),
    teamComposition: response.team_composition
      .map(toTeamMember)
      .filter((member): member is TeamMember => member !== null),
    timeline: response.timeline
      .map(toTimelinePhase)
      .filter((phase): phase is TimelinePhase => phase !== null),
    costBreakdown,
    risks: response.risks
      .map(toProposalRisk)
      .filter((risk): risk is ProposalRisk => risk !== null),
    totalCostLabel:
      response.total_cost_usd !== null
        ? USD_FORMATTER.format(response.total_cost_usd)
        : L.COST_BREAKDOWN.PENDING,
    totalDaysLabel:
      costBreakdown.length > 0
        ? L.COST_BREAKDOWN.TOTAL_DAYS_VALUE(totalDays)
        : L.COST_BREAKDOWN.PENDING,
  };
}

/** Maps AI-edit content into the `PUT /proposal` body (content fields only). */
export function toProposalUpdate(content: ProposalContent): ProposalUpdate {
  return {
    executive_summary: content.executive_summary,
    technical_approach: content.technical_approach,
    architecture: content.architecture,
    team_composition: content.team_composition,
    timeline: content.timeline,
    cost_breakdown: content.cost_breakdown,
    risks: content.risks,
  };
}

/**
 * Builds a `Proposal` view-model from bare AI-edit content for previewing. The
 * placeholder id/project_id/status aren't rendered by `ProposalDocument`.
 */
export function toProposalPreview(content: ProposalContent): Proposal {
  return toProposal({ ...content, id: "", project_id: "", status: "draft" });
}
