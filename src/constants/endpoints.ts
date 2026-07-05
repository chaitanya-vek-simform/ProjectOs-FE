/** Centralised API endpoint paths. Never hardcode a URL string in a service file. */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  PROJECTS: {
    LIST: "/projects",
    DETAIL: (projectId: string) => `/projects/${projectId}`,
    DASHBOARD: (projectId: string) => `/projects/${projectId}/dashboard`,
  },
  REQUIREMENTS: {
    DOCUMENTS: (projectId: string) => `/projects/${projectId}/documents`,
    PROCESS_DOCUMENT: (projectId: string, documentId: string) =>
      `/projects/${projectId}/documents/${documentId}/process`,
    CLARIFICATIONS: (projectId: string, documentId: string) =>
      `/projects/${projectId}/documents/${documentId}/clarifications`,
    CLARIFICATION_ANSWERS: (projectId: string, documentId: string) =>
      `/projects/${projectId}/documents/${documentId}/clarifications/answers`,
    CLARIFICATION_SKIP: (projectId: string, documentId: string) =>
      `/projects/${projectId}/documents/${documentId}/clarifications/skip`,
    TASK_STATUS: (taskId: string) => `/tasks/${taskId}`,
    LIST: (projectId: string) => `/projects/${projectId}/requirements`,
    DETAIL: (requirementId: string) => `/requirements/${requirementId}`,
    GENERATE_STORIES: (projectId: string) =>
      `/projects/${projectId}/requirements/generate-stories`,
    STORIES: (projectId: string) => `/projects/${projectId}/stories`,
    STORY_DETAIL: (storyId: string) => `/stories/${storyId}`,
  },
  PROPOSAL: {
    GENERATE: (projectId: string) => `/projects/${projectId}/proposal/generate`,
    DETAIL: (projectId: string) => `/projects/${projectId}/proposal`,
    AI_EDIT: (projectId: string) => `/projects/${projectId}/proposal/ai-edit`,
    TASK_STATUS: (taskId: string) => `/tasks/${taskId}`,
  },
  PLANNER: {
    SPRINTS: (projectId: string) => `/projects/${projectId}/sprints`,
    GENERATE_SPRINTS: (projectId: string) =>
      `/projects/${projectId}/sprints/generate`,
    TASKS: (projectId: string) => `/projects/${projectId}/tasks`,
    TASK_DETAIL: (taskId: string) => `/tasks/${taskId}`,
  },
  MEETINGS: {
    LIST: (projectId: string) => `/projects/${projectId}/meetings`,
    DETAIL: (meetingId: string) => `/meetings/${meetingId}`,
    PROCESS: (meetingId: string) => `/meetings/${meetingId}/process`,
  },
  RISK: {
    COMPUTE: (projectId: string) => `/projects/${projectId}/risk/compute`,
    LATEST: (projectId: string) => `/projects/${projectId}/risk/latest`,
    HISTORY: (projectId: string) => `/projects/${projectId}/risk/history`,
    TASK: (taskId: string) => `/tasks/${taskId}`,
  },
  RESOURCES: {
    TEAM: "/resources/team",
    UTILIZATION: "/resources/utilization",
    SUGGEST: (projectId: string) => `/projects/${projectId}/resources/suggest`,
  },
  ASSISTANT: {
    /** Project-scoped streaming chat. Emits Server-Sent Events (sources → token* → done). */
    CHAT_STREAM: (projectId: string) => `/projects/${projectId}/chat/stream`,
    /** The caller's persisted chat thread for a project (GET to load, DELETE to clear). */
    CHAT_HISTORY: (projectId: string) => `/projects/${projectId}/chat/history`,
  },
} as const;
