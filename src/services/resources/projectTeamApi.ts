import api from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

import type {
  ProjectTeamResponse,
  SavedTeamMember,
  TeamMemberInput,
  TeamMemberUpdate,
} from "@/types/resources";

export const projectTeamApi = {
  /** Fetch the persisted team for a project. */
  getTeam: (projectId: string): Promise<ProjectTeamResponse> =>
    api
      .get<ProjectTeamResponse>(ENDPOINTS.TEAM.ROOT(projectId))
      .then((r) => r.data),

  /** Save (replace) the entire project team. */
  saveTeam: (
    projectId: string,
    members: TeamMemberInput[],
  ): Promise<ProjectTeamResponse> =>
    api
      .post<ProjectTeamResponse>(ENDPOINTS.TEAM.ROOT(projectId), { members })
      .then((r) => r.data),

  /** Clear the saved project team. */
  clearTeam: (projectId: string): Promise<void> =>
    api.delete(ENDPOINTS.TEAM.ROOT(projectId)).then(() => undefined),

  /** Add a single member to the team. */
  addMember: (
    projectId: string,
    member: TeamMemberInput,
  ): Promise<SavedTeamMember> =>
    api
      .post<SavedTeamMember>(ENDPOINTS.TEAM.MEMBERS(projectId), member)
      .then((r) => r.data),

  /** Partially update a saved team member. */
  updateMember: (
    projectId: string,
    memberId: string,
    data: TeamMemberUpdate,
  ): Promise<SavedTeamMember> =>
    api
      .patch<SavedTeamMember>(ENDPOINTS.TEAM.MEMBER(projectId, memberId), data)
      .then((r) => r.data),

  /** Remove a member from the team. */
  removeMember: (projectId: string, memberId: string): Promise<void> =>
    api
      .delete(ENDPOINTS.TEAM.MEMBER(projectId, memberId))
      .then(() => undefined),
};
