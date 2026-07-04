import { useQuery } from "@tanstack/react-query";

import { riskApi } from "@/services/risk/riskApi";
import { RISK_QUERY_KEYS } from "@/constants/queryKeys";

const POLL_INTERVAL_MS = 10_000;

/**
 * @param isComputing Pass the compute-risk mutation's `isPending` to poll
 * every 10s while an async recompute is running, e.g.
 * `useLatestRisk(projectId, computeRisk.isPending)`.
 */
export function useLatestRisk(projectId?: string, isComputing = false) {
  return useQuery({
    queryKey: RISK_QUERY_KEYS.LATEST(projectId ?? ""),
    queryFn: () => riskApi.getLatestRisk(projectId!),
    enabled: Boolean(projectId),
    refetchInterval: isComputing ? POLL_INTERVAL_MS : false,
  });
}

export function useRiskHistory(projectId?: string, isComputing = false) {
  return useQuery({
    queryKey: RISK_QUERY_KEYS.HISTORY(projectId ?? ""),
    queryFn: () => riskApi.getRiskHistory(projectId!),
    enabled: Boolean(projectId),
    refetchInterval: isComputing ? POLL_INTERVAL_MS : false,
  });
}
