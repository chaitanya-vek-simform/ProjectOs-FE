import { useQuery } from "@tanstack/react-query";

import { riskApi } from "@/services/risk/riskApi";
import { RISK_QUERY_KEYS } from "@/constants/queryKeys";

/** Latest computed risk snapshot for a project. */
export function useLatestRisk(projectId?: string) {
  return useQuery({
    queryKey: RISK_QUERY_KEYS.LATEST(projectId ?? ""),
    queryFn: () => riskApi.getLatestRisk(projectId!),
    enabled: Boolean(projectId),
  });
}

/** Risk-score trend over time for a project. */
export function useRiskHistory(projectId?: string) {
  return useQuery({
    queryKey: RISK_QUERY_KEYS.HISTORY(projectId ?? ""),
    queryFn: () => riskApi.getRiskHistory(projectId!),
    enabled: Boolean(projectId),
  });
}
