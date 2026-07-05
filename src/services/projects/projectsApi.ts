import api from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

import type {
  CreateProjectDto,
  Project,
  ProjectDashboard,
  UpdateProjectDto,
} from "@/types/projects";

export const projectsApi = {
  getProjects: (): Promise<Project[]> =>
    api.get<Project[]>(ENDPOINTS.PROJECTS.LIST).then((r) => r.data),

  getProject: (projectId: string): Promise<Project> =>
    api.get<Project>(ENDPOINTS.PROJECTS.DETAIL(projectId)).then((r) => r.data),

  createProject: (data: CreateProjectDto): Promise<Project> =>
    api.post<Project>(ENDPOINTS.PROJECTS.LIST, data).then((r) => r.data),

  updateProject: (
    projectId: string,
    data: UpdateProjectDto,
  ): Promise<Project> =>
    api
      .put<Project>(ENDPOINTS.PROJECTS.DETAIL(projectId), data)
      .then((r) => r.data),

  getDashboard: (projectId: string): Promise<ProjectDashboard> =>
    api
      .get<ProjectDashboard>(ENDPOINTS.PROJECTS.DASHBOARD(projectId))
      .then((r) => r.data),

  connectERP: (
    projectId: string,
    enabled: boolean,
  ): Promise<{ enabled: boolean }> =>
    api
      .patch<{ enabled: boolean }>(ENDPOINTS.PROJECTS.CONNECT_ERP(projectId), {
        enabled,
      })
      .then((r) => r.data),
};
