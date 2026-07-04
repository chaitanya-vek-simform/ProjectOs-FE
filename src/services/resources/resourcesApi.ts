import api from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

import type {
  SuggestTeamResponse,
  TeamMemberResponse,
  UtilizationResponse,
} from "@/types/resources";

export const resourcesApi = {
  getTeam: (): Promise<TeamMemberResponse[]> =>
    api.get<TeamMemberResponse[]>(ENDPOINTS.RESOURCES.TEAM).then((r) => r.data),

  getUtilization: (): Promise<UtilizationResponse[]> =>
    api
      .get<UtilizationResponse[]>(ENDPOINTS.RESOURCES.UTILIZATION)
      .then((r) => r.data),

  suggestTeam: (projectId: string): Promise<SuggestTeamResponse> =>
    api
      .post<SuggestTeamResponse>(ENDPOINTS.RESOURCES.SUGGEST(projectId))
      .then((r) => r.data),
};
