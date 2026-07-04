import { useState } from "react";

import { KanbanColumn } from "@/components/planner/kanban-column/kanban-column";

import type { KanbanColumn as KanbanColumnType } from "@/types/planner";

interface DraggedTask {
  taskId: string;
  columnId: string;
}

interface DropPosition {
  columnId: string;
  index: number;
}

interface KanbanBoardViewProps {
  initialColumns: KanbanColumnType[];
  /** Called when a task is dropped into a different column. */
  onTaskMoved: (taskId: string, targetColumnId: string) => void;
}

/**
 * KanbanBoardView — presentational, drag-and-drop-enabled row of columns.
 * Holds optimistic local ordering seeded from `initialColumns`; remount with a
 * `key` to reseed when server data changes. Reconciliation of persisted status
 * is delegated to `onTaskMoved`.
 */
function KanbanBoardView({
  initialColumns,
  onTaskMoved,
}: KanbanBoardViewProps) {
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);

  const handleTaskDragStart = (taskId: string, columnId: string) => {
    setDraggedTask({ taskId, columnId });
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumnId(null);
    setDropPosition(null);
  };

  const handleColumnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { dataTransfer } = e;
    dataTransfer.dropEffect = "move";
  };

  const handleColumnDragEnter = (columnId: string) => {
    if (draggedTask) {
      setDragOverColumnId(columnId);
    }
  };

  const handleTaskDragOverCard = (columnId: string, taskIndex: number) => {
    setDropPosition({ columnId, index: taskIndex });
  };

  const handleColumnDrop = (targetColumnId: string) => {
    if (!draggedTask || !dropPosition) return;

    const { taskId, columnId: sourceColumnId } = draggedTask;
    const insertIndex = dropPosition.index;

    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => ({
        ...col,
        tasks: [...col.tasks],
      }));
      const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
      const targetColumn = newColumns.find((col) => col.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return prevColumns;

      const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prevColumns;

      const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);

      let finalIndex = insertIndex;
      if (sourceColumnId === targetColumnId && insertIndex > taskIndex) {
        finalIndex = insertIndex - 1;
      }

      targetColumn.tasks.splice(finalIndex, 0, movedTask);

      return newColumns;
    });

    if (sourceColumnId !== targetColumnId) {
      onTaskMoved(taskId, targetColumnId);
    }

    handleTaskDragEnd();
  };

  return (
    <div className="flex min-h-[420px] gap-3 overflow-x-auto pb-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          onDragOver={handleColumnDragOver}
          onDragEnter={() => handleColumnDragEnter(column.id)}
          onDrop={() => handleColumnDrop(column.id)}
          isDragOver={dragOverColumnId === column.id}
          dropPosition={
            dragOverColumnId === column.id ? dropPosition?.index : undefined
          }
          onTaskDragStart={handleTaskDragStart}
          onTaskDragEnd={handleTaskDragEnd}
          onTaskDragOverCard={handleTaskDragOverCard}
        />
      ))}
    </div>
  );
}

export { KanbanBoardView };
