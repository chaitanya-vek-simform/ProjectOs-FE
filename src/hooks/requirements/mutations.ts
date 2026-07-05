import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { requirementsApi } from "@/services/requirements/requirementsApi";
import { LABELS } from "@/constants/labels";
import { REQUIREMENTS_QUERY_KEYS } from "@/constants/queryKeys";
import { getErrorMessage } from "@/lib/utils";

import type {
  ClarificationAnswersPayload,
  RequirementUpdate,
  UserStoryUpdate,
} from "@/types/requirements";

export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => requirementsApi.uploadDocument(projectId, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: REQUIREMENTS_QUERY_KEYS.DOCUMENTS(projectId),
      });
      toast.success(LABELS.REQUIREMENTS.API.UPLOAD_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, LABELS.REQUIREMENTS.API.UPLOAD_ERROR));
    },
  });
}

export function useProcessDocument(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) =>
      requirementsApi.processDocument(projectId, documentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: REQUIREMENTS_QUERY_KEYS.DOCUMENTS(projectId),
      });
      toast.success(LABELS.REQUIREMENTS.API.PROCESS_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(
        getErrorMessage(error, LABELS.REQUIREMENTS.API.PROCESS_ERROR),
      );
    },
  });
}

export function useSubmitClarifications(projectId: string, documentId: string) {
  return useMutation({
    mutationFn: (payload: ClarificationAnswersPayload) =>
      requirementsApi.submitClarifications(projectId, documentId, payload),
    onError: (error: Error) => {
      toast.error(
        getErrorMessage(error, LABELS.REQUIREMENTS.API.CLARIFICATION_ERROR),
      );
    },
  });
}

export function useSkipClarifications(projectId: string, documentId: string) {
  return useMutation({
    mutationFn: () => requirementsApi.skipClarifications(projectId, documentId),
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, LABELS.REQUIREMENTS.API.SKIP_ERROR));
    },
  });
}

export function useUpdateRequirement(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requirementId,
      data,
    }: {
      requirementId: string;
      data: RequirementUpdate;
    }) => requirementsApi.updateRequirement(requirementId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: REQUIREMENTS_QUERY_KEYS.LIST(projectId),
      });
      toast.success(LABELS.REQUIREMENTS.API.UPDATE_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, LABELS.REQUIREMENTS.API.UPDATE_ERROR));
    },
  });
}

export function useGenerateStories(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => requirementsApi.generateStories(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: REQUIREMENTS_QUERY_KEYS.STORIES(projectId),
      });
      toast.success(LABELS.REQUIREMENTS.API.GENERATE_STORIES_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(
        getErrorMessage(error, LABELS.REQUIREMENTS.API.GENERATE_STORIES_ERROR),
      );
    },
  });
}

export function useUpdateStory(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      storyId,
      data,
    }: {
      storyId: string;
      data: UserStoryUpdate;
    }) => requirementsApi.updateStory(storyId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: REQUIREMENTS_QUERY_KEYS.STORIES(projectId),
      });
      toast.success(LABELS.REQUIREMENTS.API.STORY_UPDATE_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(
        getErrorMessage(error, LABELS.REQUIREMENTS.API.STORY_UPDATE_ERROR),
      );
    },
  });
}
