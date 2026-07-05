/** Centralised React Query key factories. Never inline a query key array in a hook. */

export const AUTH_QUERY_KEYS = {
  ME: ["auth", "me"] as const,
};

export const PROJECTS_QUERY_KEYS = {
  LIST: ["projects"] as const,
  DETAIL: (projectId: string) => ["projects", projectId] as const,
  DASHBOARD: (projectId: string) =>
    ["projects", projectId, "dashboard"] as const,
};

export const REQUIREMENTS_QUERY_KEYS = {
  DOCUMENTS: (projectId: string) =>
    ["requirements", projectId, "documents"] as const,
  CLARIFICATIONS: (projectId: string, documentId: string) =>
    ["requirements", projectId, "clarifications", documentId] as const,
  TASK_STATUS: (taskId: string) =>
    ["requirements", "task-status", taskId] as const,
  LIST: (projectId: string, type?: string) =>
    ["requirements", projectId, "list", type ?? "all"] as const,
  STORIES: (projectId: string) =>
    ["requirements", projectId, "stories"] as const,
};

export const PROPOSAL_QUERY_KEYS = {
  DETAIL: (projectId: string) => ["proposal", projectId] as const,
};

export const PLANNER_QUERY_KEYS = {
  SPRINTS: (projectId: string) => ["planner", projectId, "sprints"] as const,
  TASKS: (projectId: string, sprintId?: string) =>
    ["planner", projectId, "tasks", sprintId ?? "all"] as const,
  TASK_STATUS: (taskId: string) => ["planner", "task-status", taskId] as const,
};

export const MEETINGS_QUERY_KEYS = {
  LIST: (projectId: string) => ["meetings", projectId] as const,
  DETAIL: (meetingId: string) => ["meetings", "detail", meetingId] as const,
};

export const RISK_QUERY_KEYS = {
  LATEST: (projectId: string) => ["risk", projectId, "latest"] as const,
  HISTORY: (projectId: string) => ["risk", projectId, "history"] as const,
};

export const RESOURCES_QUERY_KEYS = {
  TEAM: ["resources", "team"] as const,
  UTILIZATION: ["resources", "utilization"] as const,
};
