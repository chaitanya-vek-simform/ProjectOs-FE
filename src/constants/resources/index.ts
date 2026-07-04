import type { SuggestedMember } from "@/types/resources";

/** Number of sprint weeks shown in the cross-sprint utilization heatmap. */
export const HEATMAP_WEEK_COUNT = 6;

/**
 * TEMPORARY: static candidates shown when the AI suggest endpoint returns an
 * empty `suggested_members` list, so the selection UI can be exercised.
 * Remove once the backend returns real candidates.
 */
const STATIC_MEMBER_SEED: Array<Omit<SuggestedMember, "id">> = [
  { name: "Sarah Chen", skills: ["Python", "Maps API", "WebSocket"] },
  { name: "Raj Mehta", skills: ["FastAPI", "PostgreSQL"] },
  { name: "Amy Kim", skills: ["React", "React Native"] },
  { name: "Mike Torres", skills: ["FastAPI", "Redis"] },
];

/** Role-scoped static suggested members (IDs namespaced per role to stay unique). */
export function getFallbackSuggestedMembers(role: string): SuggestedMember[] {
  return STATIC_MEMBER_SEED.map((member, index) => ({
    id: `${role}-static-${index + 1}`,
    name: member.name,
    skills: member.skills,
  }));
}
