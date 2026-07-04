import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LABELS } from "@/constants/labels";

import { TaskForm } from "./TaskForm";

import type { SprintResponse } from "@/types/planner";

const FORM_LABELS = LABELS.PLANNER.FORM;

interface TaskFormDialogProps {
  open: boolean;
  projectId: string;
  sprints: SprintResponse[];
  defaultSprintId?: string;
  onOpenChange: (open: boolean) => void;
}

/** Create-task dialog wrapping the {@link TaskForm}. */
function TaskFormDialog({
  open,
  projectId,
  sprints,
  defaultSprintId,
  onOpenChange,
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{FORM_LABELS.DIALOG_TITLE}</DialogTitle>
          <DialogDescription>
            {FORM_LABELS.DIALOG_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          projectId={projectId}
          sprints={sprints}
          defaultSprintId={defaultSprintId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export { TaskFormDialog };
