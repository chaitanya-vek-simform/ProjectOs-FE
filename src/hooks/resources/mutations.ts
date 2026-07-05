import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { projectTeamApi } from "@/services/resources/projectTeamApi";
import { resourcesApi } from "@/services/resources/resourcesApi";
import { LABELS } from "@/constants/labels";
import { PROJECT_TEAM_QUERY_KEYS } from "@/constants/queryKeys";
import { getErrorMessage } from "@/lib/utils";

import type { TeamMemberInput, TeamMemberUpdate } from "@/types/resources";

const API = LABELS.RESOURCES.API;

/** Triggers AI team suggestion for a project. */
export function useSuggestTeam() {
  return useMutation({
    mutationFn: (projectId: string) => resourcesApi.suggestTeam(projectId),
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, API.SUGGEST_ERROR));
    },
  });
}

/** Saves (replaces) the whole persisted team for a project. */
export function useSaveTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      members,
    }: {
      projectId: string;
      members: TeamMemberInput[];
    }) => projectTeamApi.saveTeam(projectId, members),
    onSuccess: (_result, { projectId }) => {
      void queryClient.invalidateQueries({
        queryKey: PROJECT_TEAM_QUERY_KEYS.DETAIL(projectId),
      });
      toast.success(API.SAVE_TEAM_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, API.SAVE_TEAM_ERROR));
    },
  });
}

/** Clears the persisted team for a project. */
export function useClearTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => projectTeamApi.clearTeam(projectId),
    onSuccess: (_result, projectId) => {
      void queryClient.invalidateQueries({
        queryKey: PROJECT_TEAM_QUERY_KEYS.DETAIL(projectId),
      });
      toast.success(API.CLEAR_TEAM_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, API.CLEAR_TEAM_ERROR));
    },
  });
}

/** Adds a single member to the persisted team. */
export function useAddTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      member,
    }: {
      projectId: string;
      member: TeamMemberInput;
    }) => projectTeamApi.addMember(projectId, member),
    onSuccess: (_result, { projectId }) => {
      void queryClient.invalidateQueries({
        queryKey: PROJECT_TEAM_QUERY_KEYS.DETAIL(projectId),
      });
      toast.success(API.ADD_MEMBER_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, API.ADD_MEMBER_ERROR));
    },
  });
}

/** Partially updates a saved team member. */
export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      data,
    }: {
      projectId: string;
      memberId: string;
      data: TeamMemberUpdate;
    }) => projectTeamApi.updateMember(projectId, memberId, data),
    onSuccess: (_result, { projectId }) => {
      void queryClient.invalidateQueries({
        queryKey: PROJECT_TEAM_QUERY_KEYS.DETAIL(projectId),
      });
      toast.success(API.UPDATE_MEMBER_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, API.UPDATE_MEMBER_ERROR));
    },
  });
}

/** Removes a member from the persisted team. */
export function useRemoveTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
    }: {
      projectId: string;
      memberId: string;
    }) => projectTeamApi.removeMember(projectId, memberId),
    onSuccess: (_result, { projectId }) => {
      void queryClient.invalidateQueries({
        queryKey: PROJECT_TEAM_QUERY_KEYS.DETAIL(projectId),
      });
      toast.success(API.REMOVE_MEMBER_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, API.REMOVE_MEMBER_ERROR));
    },
  });
}
