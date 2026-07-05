import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { proposalApi } from "@/services/proposal/proposalApi";
import { LABELS } from "@/constants/labels";
import { PROPOSAL_QUERY_KEYS } from "@/constants/queryKeys";
import { getErrorMessage } from "@/lib/utils";

import type { ProposalUpdate } from "@/types/proposal";

/**
 * Triggers async AI proposal generation and returns the task handle. The caller
 * polls the task (`useProposalTask`) and only refetches the proposal once the
 * task reports `completed` — so we deliberately do NOT invalidate the proposal
 * here (that would fetch a not-yet-generated proposal).
 */
export function useGenerateProposal() {
  return useMutation({
    mutationFn: (projectId: string) => proposalApi.generateProposal(projectId),
    onSuccess: () => {
      toast.success(LABELS.PROPOSAL.API.GENERATE_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, LABELS.PROPOSAL.API.GENERATE_ERROR));
    },
  });
}

export function useUpdateProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: ProposalUpdate;
    }) => proposalApi.updateProposal(projectId, data),
    onSuccess: (_result, { projectId }) => {
      void queryClient.invalidateQueries({
        queryKey: PROPOSAL_QUERY_KEYS.DETAIL(projectId),
      });
      toast.success(LABELS.PROPOSAL.API.UPDATE_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, LABELS.PROPOSAL.API.UPDATE_ERROR));
    },
  });
}

/**
 * Requests an AI-generated edit of the proposal. Returns the diff so the caller
 * can preview `proposed` before committing it via {@link useUpdateProposal} — so
 * this neither toasts on success nor invalidates the cached proposal.
 */
export function useAiEditProposal() {
  return useMutation({
    mutationFn: ({
      projectId,
      instruction,
    }: {
      projectId: string;
      instruction: string;
    }) => proposalApi.aiEdit(projectId, { instruction }),
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, LABELS.PROPOSAL.API.AI_EDIT_ERROR));
    },
  });
}
