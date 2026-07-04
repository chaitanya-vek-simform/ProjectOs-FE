import { useQuery } from "@tanstack/react-query";

import { plannerApi } from "@/services/planner/plannerApi";
import { PLANNER_QUERY_KEYS } from "@/constants/queryKeys";

const POLL_INTERVAL_MS = 10_000;

/**
 * @param isGenerating Pass the generate-sprints mutation's `isPending` to
 * poll every 10s while an async AI sprint plan is being generated, e.g.
 * `useSprints(projectId, generateSprints.isPending)`.
 */
export function useSprints(projectId?: string, isGenerating = false) {
  return useQuery({
    queryKey: PLANNER_QUERY_KEYS.SPRINTS(projectId ?? ""),
    queryFn: () => plannerApi.getSprints(projectId!),
    enabled: Boolean(projectId),
    refetchInterval: isGenerating ? POLL_INTERVAL_MS : false,
  });
}

export function useTasks(projectId?: string, sprintId?: string) {
  return useQuery({
    queryKey: PLANNER_QUERY_KEYS.TASKS(projectId ?? "", sprintId),
    queryFn: () => plannerApi.getTasks(projectId!, sprintId),
    enabled: Boolean(projectId),
  });
}

/**
 * Polls an async AI task until it reaches a terminal state. Pass `enabled`
 * to start/stop polling; refetches every 4s while pending/running.
 */
export function useTaskStatus(taskId?: string, enabled = true) {
  return useQuery({
    queryKey: PLANNER_QUERY_KEYS.TASK_STATUS(taskId ?? ""),
    queryFn: () => plannerApi.getTaskStatus(taskId!),
    enabled: Boolean(taskId) && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 4000;
    },
  });
}
