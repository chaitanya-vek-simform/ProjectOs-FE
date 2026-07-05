import * as React from "react";

import { useProjects } from "@/hooks/projects/queries";
import { useAuth } from "@/contexts/useAuth";

import type { Project } from "@/types/projects";

interface ProjectContextValue {
  activeProject: Project | undefined;
  projectId: string | undefined;
  projects: Project[];
  isLoading: boolean;
  setActiveProjectId: (projectId: string) => void;
}

const ProjectContext = React.createContext<ProjectContextValue | undefined>(
  undefined,
);

const ACTIVE_PROJECT_ID_KEY = "projectos.activeProjectId";

/**
 * ProjectContext — fetches the org's projects and exposes the selected one as the
 * "active project" for the whole app. Defaults to the first project until the
 * user picks another one via ProjectSwitcher; falls back to the first project
 * again if the selected id disappears from the list (e.g. after a refetch).
 */
function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { data: projects, isLoading } = useProjects(isAuthenticated);
  const [activeProjectId, setActiveProjectIdState] = React.useState<
    string | undefined
  >(() => localStorage.getItem(ACTIVE_PROJECT_ID_KEY) ?? undefined);

  const setActiveProjectId = React.useCallback((projectId: string) => {
    localStorage.setItem(ACTIVE_PROJECT_ID_KEY, projectId);
    setActiveProjectIdState(projectId);
  }, []);

  const activeProject =
    projects?.find((project) => project.id === activeProjectId) ??
    projects?.[0];

  const value = React.useMemo(
    () => ({
      activeProject,
      projectId: activeProject?.id,
      projects: projects ?? [],
      isLoading,
      setActiveProjectId,
    }),
    [activeProject, projects, isLoading, setActiveProjectId],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export { ProjectContext, ProjectProvider };
export type { ProjectContextValue };
