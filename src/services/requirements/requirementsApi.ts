import api from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

import type {
  ClarificationAnswersPayload,
  ClarificationsResponse,
  DocumentResponse,
  DocumentTaskResponse,
  DocumentTaskStatus,
  RequirementResponse,
  RequirementUpdate,
  UserStoryResponse,
  UserStoryUpdate,
} from "@/types/requirements";

export const requirementsApi = {
  /* Documents */
  uploadDocument: (
    projectId: string,
    file: File,
  ): Promise<DocumentTaskResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post<DocumentTaskResponse>(
        ENDPOINTS.REQUIREMENTS.DOCUMENTS(projectId),
        formData,
      )
      .then((r) => r.data);
  },

  getDocuments: (projectId: string): Promise<DocumentResponse[]> =>
    api
      .get<DocumentResponse[]>(ENDPOINTS.REQUIREMENTS.DOCUMENTS(projectId))
      .then((r) => r.data),

  processDocument: (
    projectId: string,
    documentId: string,
  ): Promise<DocumentResponse> =>
    api
      .post<DocumentResponse>(
        ENDPOINTS.REQUIREMENTS.PROCESS_DOCUMENT(projectId, documentId),
      )
      .then((r) => r.data),

  /* Clarifications */
  getClarifications: (
    projectId: string,
    documentId: string,
  ): Promise<ClarificationsResponse> =>
    api
      .get<ClarificationsResponse>(
        ENDPOINTS.REQUIREMENTS.CLARIFICATIONS(projectId, documentId),
      )
      .then((r) => r.data),

  submitClarifications: (
    projectId: string,
    documentId: string,
    payload: ClarificationAnswersPayload,
  ): Promise<DocumentTaskResponse> =>
    api
      .post<DocumentTaskResponse>(
        ENDPOINTS.REQUIREMENTS.CLARIFICATION_ANSWERS(projectId, documentId),
        payload,
      )
      .then((r) => r.data),

  skipClarifications: (
    projectId: string,
    documentId: string,
  ): Promise<DocumentTaskResponse> =>
    api
      .post<DocumentTaskResponse>(
        ENDPOINTS.REQUIREMENTS.CLARIFICATION_SKIP(projectId, documentId),
      )
      .then((r) => r.data),

  /** Poll an async document task by id (`GET /tasks/{task_id}`). */
  getTaskStatus: (taskId: string): Promise<DocumentTaskStatus> =>
    api
      .get<DocumentTaskStatus>(ENDPOINTS.REQUIREMENTS.TASK_STATUS(taskId))
      .then((r) => r.data),

  /* Requirements */
  getRequirements: (
    projectId: string,
    type?: string,
  ): Promise<RequirementResponse[]> =>
    api
      .get<RequirementResponse[]>(ENDPOINTS.REQUIREMENTS.LIST(projectId), {
        params: type ? { type } : undefined,
      })
      .then((r) => r.data),

  updateRequirement: (
    requirementId: string,
    data: RequirementUpdate,
  ): Promise<RequirementResponse> =>
    api
      .put<RequirementResponse>(
        ENDPOINTS.REQUIREMENTS.DETAIL(requirementId),
        data,
      )
      .then((r) => r.data),

  /* User stories */
  generateStories: (projectId: string): Promise<unknown> =>
    api
      .post<unknown>(ENDPOINTS.REQUIREMENTS.GENERATE_STORIES(projectId))
      .then((r) => r.data),

  getStories: (projectId: string): Promise<UserStoryResponse[]> =>
    api
      .get<UserStoryResponse[]>(ENDPOINTS.REQUIREMENTS.STORIES(projectId))
      .then((r) => r.data),

  updateStory: (
    storyId: string,
    data: UserStoryUpdate,
  ): Promise<UserStoryResponse> =>
    api
      .put<UserStoryResponse>(
        ENDPOINTS.REQUIREMENTS.STORY_DETAIL(storyId),
        data,
      )
      .then((r) => r.data),
};
