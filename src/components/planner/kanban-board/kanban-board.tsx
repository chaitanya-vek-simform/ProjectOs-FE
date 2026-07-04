import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LABELS } from "@/constants/labels";
import { useUpdateTask } from "@/hooks/planner/mutations";
import { useTasks } from "@/hooks/planner/queries";
import { getErrorMessage } from "@/lib/utils";

import { KanbanBoardView } from "@/components/planner/kanban-board/kanban-board-view";
import {
  COLUMN_TO_STATUS,
  toKanbanColumns,
} from "@/components/planner/planner-mappers";

const EMPTY = LABELS.PLANNER.EMPTY;

interface KanbanBoardProps {
  projectId: string;
  selectedSprintId?: string;
}

/**
 * KanbanBoard — container that fetches sprint tasks, groups them into columns
 * and persists cross-column moves via the update-task mutation. Delegates the
 * drag-and-drop UX to {@link KanbanBoardView}.
 */
function KanbanBoard({ projectId, selectedSprintId }: KanbanBoardProps) {
  const {
    data: tasks,
    isLoading,
    isError,
    error,
    refetch,
  } = useTasks(projectId, selectedSprintId);
  const { mutate: updateTask } = useUpdateTask(projectId);

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-center">
        <p className="text-sm font-medium text-red-500">
          {getErrorMessage(error, EMPTY.LOAD_ERROR)}
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          {EMPTY.RETRY}
        </Button>
      </div>
    );
  }

  const columns = toKanbanColumns(tasks ?? []);
  // Reseed the drag-and-drop view whenever the underlying task set changes.
  const viewKey = (tasks ?? [])
    .map((task) => `${task.id}:${task.status}`)
    .join("|");

  const handleTaskMoved = (taskId: string, targetColumnId: string) => {
    updateTask({ taskId, data: { status: COLUMN_TO_STATUS[targetColumnId] } });
  };

  return (
    <KanbanBoardView
      key={viewKey}
      initialColumns={columns}
      onTaskMoved={handleTaskMoved}
    />
  );
}

export { KanbanBoard };
