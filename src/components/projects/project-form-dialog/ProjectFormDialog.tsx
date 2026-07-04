import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LABELS } from "@/constants/labels";

import { ProjectForm } from "./ProjectForm";

import type { Project } from "@/types/projects";

const DIALOG_LABELS = LABELS.PROJECTS.DIALOG;

interface ProjectFormDialogProps {
  /** Pass a Project to edit it; omit (or pass `open` alone) to create a new one. */
  open: boolean;
  project?: Project;
  onOpenChange: (open: boolean) => void;
}

/** Shared create/edit dialog for projects — one component, one place to change the flow. */
function ProjectFormDialog({
  open,
  project,
  onOpenChange,
}: ProjectFormDialogProps) {
  const isEditMode = project !== undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? DIALOG_LABELS.EDIT_TITLE : DIALOG_LABELS.CREATE_TITLE}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? DIALOG_LABELS.EDIT_DESCRIPTION
              : DIALOG_LABELS.CREATE_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

export { ProjectFormDialog };
