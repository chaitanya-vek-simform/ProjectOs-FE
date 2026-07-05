import {
  AVATAR_TONES,
  formatRoleLabel,
  toUtilizationPresentation,
  type SavedTeamMember,
  type SelectedMember,
  type TeamMember,
  type TeamMemberInput,
  type TeamMemberSource,
} from "@/types/resources";

/** Coerce an optional value to `T | null` (the payload uses null, not undefined). */
function orNull<T>(value: T | undefined): T | null {
  return value ?? null;
}

function toRatings(
  ratings: SelectedMember["member"]["ratings"],
): Record<string, number> | null {
  if (!ratings) return null;
  return {
    overall: ratings.overall,
    ai: ratings.ai,
    communication: ratings.communication,
  };
}

/**
 * Map a dialog selection into the payload shape the save-team endpoint expects.
 * `source` reflects where the suggestion roster came from (SimERP vs local).
 */
export function toTeamMemberInput(
  selection: SelectedMember,
  source: TeamMemberSource = "internal",
): TeamMemberInput {
  const { role, member } = selection;
  return {
    member_ref: member.id,
    source,
    name: member.name,
    role: member.role ?? role,
    designation: orNull(member.designation),
    department: orNull(member.department),
    stack: orNull(member.stack),
    skills: member.skills,
    experience_years: orNull(member.experience_years),
    hourly_rate: orNull(member.hourly_rate),
    availability_pct: orNull(member.availability_pct),
    current_allocation_pct: orNull(member.current_allocation_pct),
    on_leave: orNull(member.on_leave),
    in_notice_period: orNull(member.in_notice_period),
    is_contractor: orNull(member.is_contractor),
    ratings: toRatings(member.ratings),
    match_score: orNull(member.match_score),
    rationale: orNull(member.rationale),
    avatar_url: orNull(member.avatar_url),
    allocation_pct: 100,
  };
}

/** Build the full save-team payload from dialog selections. */
export function toSaveTeamPayload(
  selections: SelectedMember[],
  source: TeamMemberSource = "internal",
): { members: TeamMemberInput[] } {
  return {
    members: selections.map((selection) =>
      toTeamMemberInput(selection, source),
    ),
  };
}

/** Map persisted team members into Team Members table rows. */
export function savedTeamToTableRows(members: SavedTeamMember[]): TeamMember[] {
  return members.map((member, index) => {
    const pct = member.allocation_pct ?? member.current_allocation_pct ?? 0;
    const presentation = toUtilizationPresentation(pct);
    return {
      id: member.id,
      name: member.name,
      role: formatRoleLabel(member.role),
      skills: member.skills,
      ratePerDay:
        typeof member.hourly_rate === "number" ? `$${member.hourly_rate}` : "—",
      avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
      utilizationValue: presentation.value,
      utilizationFill: presentation.fill,
      utilizationLabel: `${pct}%`,
      utilizationLabelClass: presentation.labelClass,
      status: presentation.status,
    };
  });
}
