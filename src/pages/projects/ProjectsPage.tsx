import { useState } from "react";
import { FolderKanban, Loader2, Plus } from "lucide-react";

import { ProjectFormDialog } from "@/components/projects/project-form-dialog/ProjectFormDialog";
import { ProjectsTable } from "@/components/projects/projects-table/ProjectsTable";
import { Button } from "@/components/ui/button";
import { LABELS } from "@/constants/labels";
import { useProjects } from "@/hooks/projects/queries";
import { getErrorMessage } from "@/lib/utils";

import type { Project } from "@/types/projects";

const LIST_LABELS = LABELS.PROJECTS.LIST;

function ProjectsListContent({
  onCreateClick,
  onEditClick,
}: {
  readonly onCreateClick: () => void;
  readonly onEditClick: (project: Project) => void;
}) {
  const { data: projects, isLoading, isError, error } = useProjects();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-medium text-red-500">
          {getErrorMessage(error, LIST_LABELS.LOAD_ERROR)}
        </p>
      </div>
    );
  }

  if (projects && projects.length > 0) {
    return <ProjectsTable projects={projects} onEdit={onEditClick} />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <FolderKanban className="h-8 w-8 text-slate-300" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-slate-900">
          {LIST_LABELS.EMPTY_TITLE}
        </p>
        <p className="text-sm text-slate-500">
          {LIST_LABELS.EMPTY_DESCRIPTION}
        </p>
      </div>
      <Button variant="outline" onClick={onCreateClick}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        {LIST_LABELS.CREATE_BUTTON}
      </Button>
    </div>
  );
}

function ProjectsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined,
  );

  const openCreateDialog = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {LIST_LABELS.PAGE_TITLE}
          </h1>
          <p className="text-sm text-slate-500">{LIST_LABELS.PAGE_SUBTITLE}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {LIST_LABELS.CREATE_BUTTON}
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <ProjectsListContent
          onCreateClick={openCreateDialog}
          onEditClick={openEditDialog}
        />
      </div>

      <ProjectFormDialog
        open={isFormOpen}
        project={editingProject}
        onOpenChange={setIsFormOpen}
      />
    </div>
  );
}

export default ProjectsPage;
