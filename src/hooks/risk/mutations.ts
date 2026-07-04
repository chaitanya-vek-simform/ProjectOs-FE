import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { riskApi } from "@/services/risk/riskApi";
import { LABELS } from "@/constants/labels";
import { RISK_QUERY_KEYS } from "@/constants/queryKeys";
import { getErrorMessage } from "@/lib/utils";

const RISK_API = LABELS.RISK.API;

const POLL_INTERVAL_MS = 3_000;
const MAX_POLL_DURATION_MS = 120_000;

const TERMINAL_STATUSES = new Set([
  "completed",
  "processed",
  "done",
  "success",
  "failed",
  "error",
  "cancelled",
]);
const FAILURE_STATUSES = new Set(["failed", "error", "cancelled"]);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Orchestrates an async risk recomputation: fires `POST .../risk/compute`, polls
 * the returned task until it settles, then invalidates the latest snapshot and
 * history. Expose `recompute` + `isRecomputing` to a component.
 */
export function useRecomputeRisk(projectId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const task = await riskApi.computeRisk(projectId!);
      let status = task.status?.toLowerCase() ?? "";
      const deadline = Date.now() + MAX_POLL_DURATION_MS;

      while (
        task.task_id &&
        !TERMINAL_STATUSES.has(status) &&
        Date.now() < deadline
      ) {
        await delay(POLL_INTERVAL_MS);
        const current = await riskApi.getTaskStatus(task.task_id);
        status = current.status?.toLowerCase() ?? "";
      }

      if (FAILURE_STATUSES.has(status)) {
        throw new Error(RISK_API.COMPUTE_ERROR);
      }
    },
    onMutate: () => {
      toast.info(RISK_API.COMPUTE_STARTED);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: RISK_QUERY_KEYS.LATEST(projectId!),
      });
      void queryClient.invalidateQueries({
        queryKey: RISK_QUERY_KEYS.HISTORY(projectId!),
      });
      toast.success(RISK_API.COMPUTE_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, RISK_API.COMPUTE_ERROR));
    },
  });

  return {
    recompute: () => {
      if (projectId && !mutation.isPending) mutation.mutate();
    },
    isRecomputing: mutation.isPending,
  };
}
