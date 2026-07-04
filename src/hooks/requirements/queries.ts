import { useQuery } from "@tanstack/react-query";

import { requirementsApi } from "@/services/requirements/requirementsApi";
import { REQUIREMENTS_QUERY_KEYS } from "@/constants/queryKeys";
import { pollWhileAnyStatusPending } from "@/lib/query-polling";

const POLL_INTERVAL_MS = 10_000;

export function useDocuments(projectId?: string) {
  return useQuery({
    queryKey: REQUIREMENTS_QUERY_KEYS.DOCUMENTS(projectId ?? ""),
    queryFn: () => requirementsApi.getDocuments(projectId!),
    enabled: Boolean(projectId),
    refetchInterval: pollWhileAnyStatusPending,
  });
}

export function useRequirements(projectId?: string, type?: string) {
  return useQuery({
    queryKey: REQUIREMENTS_QUERY_KEYS.LIST(projectId ?? "", type),
    queryFn: () => requirementsApi.getRequirements(projectId!, type),
    enabled: Boolean(projectId),
  });
}

/**
 * @param isGenerating Set to keep polling every 10s while an async story
 * generation is running, e.g. after `useGenerateStories().mutate()` succeeds.
 * Stops automatically once stories show up, even if still `true`.
 */
export function useStories(projectId?: string, isGenerating = false) {
  return useQuery({
    queryKey: REQUIREMENTS_QUERY_KEYS.STORIES(projectId ?? ""),
    queryFn: () => requirementsApi.getStories(projectId!),
    enabled: Boolean(projectId),
    refetchInterval: (query) =>
      isGenerating && (query.state.data?.length ?? 0) === 0
        ? POLL_INTERVAL_MS
        : false,
  });
}
