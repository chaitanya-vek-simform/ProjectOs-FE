import { useQuery } from "@tanstack/react-query";

import { projectTeamApi } from "@/services/resources/projectTeamApi";
import { resourcesApi } from "@/services/resources/resourcesApi";
import {
  PROJECT_TEAM_QUERY_KEYS,
  RESOURCES_QUERY_KEYS,
} from "@/constants/queryKeys";

export function useTeam(enabled = true) {
  return useQuery({
    queryKey: RESOURCES_QUERY_KEYS.TEAM,
    queryFn: resourcesApi.getTeam,
    enabled,
  });
}

export function useUtilization(enabled = true) {
  return useQuery({
    queryKey: RESOURCES_QUERY_KEYS.UTILIZATION,
    queryFn: resourcesApi.getUtilization,
    enabled,
  });
}

/** The saved (persisted) team for a project. */
export function useProjectTeam(projectId: string | undefined) {
  return useQuery({
    queryKey: PROJECT_TEAM_QUERY_KEYS.DETAIL(projectId ?? ""),
    queryFn: () => projectTeamApi.getTeam(projectId ?? ""),
    enabled: Boolean(projectId),
  });
}
