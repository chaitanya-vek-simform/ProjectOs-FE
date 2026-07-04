import { useQuery } from "@tanstack/react-query";

import { proposalApi } from "@/services/proposal/proposalApi";
import { PROPOSAL_QUERY_KEYS } from "@/constants/queryKeys";

const POLL_INTERVAL_MS = 10_000;

/**
 * @param isGenerating Pass the generate-proposal mutation's `isPending` (or any
 * other "job in flight" flag) to poll every 10s while an async generation is
 * running, e.g. `useProposal(projectId, generateProposal.isPending)`.
 */
export function useProposal(projectId?: string, isGenerating = false) {
  return useQuery({
    queryKey: PROPOSAL_QUERY_KEYS.DETAIL(projectId ?? ""),
    queryFn: () => proposalApi.getProposal(projectId!),
    enabled: Boolean(projectId),
    refetchInterval: isGenerating ? POLL_INTERVAL_MS : false,
  });
}
