import type {
  ArchitectureOverview,
  CostBreakdownItem,
  Proposal,
  ProposalRisk,
  ProposalUpdate,
  TeamMember,
  TimelinePhase,
} from "./index";

/* -------------------------------------------------------------------------- */
/* Serializers — UI-facing shapes → API wire shapes (for PUT requests)        */
/* -------------------------------------------------------------------------- */

/** Serializes an `ArchitectureOverview` back into the wire `architecture` shape. */
export function fromArchitectureOverview(
  architecture: ArchitectureOverview,
): Record<string, unknown> {
  return {
    rationale: architecture.rationale,
    components: architecture.components.map((component) => ({
      name: component.name,
      purpose: component.purpose,
      technology: component.technology,
    })),
    diagram_mermaid: architecture.diagramMermaid,
  };
}

/** Serializes team members back into the wire `team_composition` shape. */
export function fromTeamComposition(team: TeamMember[]): unknown[] {
  return team.map((member) => ({
    role: member.role,
    count: member.count ?? null,
    skills: member.skills,
    rationale: member.rationale ?? null,
  }));
}

/** Serializes timeline phases back into the wire `timeline` shape. */
export function fromTimeline(phases: TimelinePhase[]): unknown[] {
  return phases.map((phase) => ({
    phase: phase.phase,
    duration_weeks: phase.durationWeeks,
    deliverables: phase.deliverables,
  }));
}

/** Serializes cost breakdown rows back into the wire `cost_breakdown` shape. */
export function fromCostBreakdown(entries: CostBreakdownItem[]): unknown[] {
  return entries.map((entry) => ({
    role: entry.role,
    module: entry.module,
    days: entry.days,
    rate_usd: entry.rateUsd,
    cost_usd: entry.costUsd,
  }));
}

/** Serializes risks back into the wire `risks` shape. */
export function fromProposalRisks(risks: ProposalRisk[]): unknown[] {
  return risks.map((risk) => ({
    risk: risk.risk,
    impact: risk.impact,
    probability: risk.probability,
    mitigation: risk.mitigation,
  }));
}

/** Editable draft of every section, held locally while the document is in edit mode. */
export interface ProposalDraft {
  executiveSummary: string;
  technicalApproach: string;
  architecture: ArchitectureOverview;
  teamComposition: TeamMember[];
  timeline: TimelinePhase[];
  costBreakdown: CostBreakdownItem[];
  risks: ProposalRisk[];
}

/** Seeds an editable draft from the current proposal. */
export function toProposalDraft(proposal: Proposal): ProposalDraft {
  return {
    executiveSummary: proposal.executiveSummaryParagraphs.join("\n\n"),
    technicalApproach: proposal.technicalApproachParagraphs.join("\n\n"),
    architecture: proposal.architecture ?? {
      rationale: "",
      components: [],
      diagramMermaid: "",
    },
    teamComposition: proposal.teamComposition,
    timeline: proposal.timeline,
    costBreakdown: proposal.costBreakdown,
    risks: proposal.risks,
  };
}

/** Serializes a full draft into the `PUT /proposal` request body. */
export function fromProposalDraft(draft: ProposalDraft): ProposalUpdate {
  return {
    executive_summary: draft.executiveSummary,
    technical_approach: draft.technicalApproach,
    architecture: fromArchitectureOverview(draft.architecture),
    team_composition: fromTeamComposition(draft.teamComposition),
    timeline: fromTimeline(draft.timeline),
    cost_breakdown: fromCostBreakdown(draft.costBreakdown),
    risks: fromProposalRisks(draft.risks),
  };
}
