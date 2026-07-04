import { useEffect, useState } from "react";
import { FolderKanban, Loader2 } from "lucide-react";

import { GenerateSprintDialog } from "@/components/planner/generate-sprint-dialog/generate-sprint-dialog";
import { KanbanBoard } from "@/components/planner/kanban-board/kanban-board";
import { PlannerControls } from "@/components/planner/planner-controls/planner-controls";
import { toSprintOption } from "@/components/planner/planner-mappers";
import { SprintSummaryBar } from "@/components/planner/sprint-summary-bar/sprint-summary-bar";
import { TaskFormDialog } from "@/components/planner/task-form-dialog/TaskFormDialog";
import { LABELS } from "@/constants/labels";
import { useProject } from "@/contexts/useProject";
import { useGenerateSprints } from "@/hooks/planner/mutations";
import { useSprints } from "@/hooks/planner/queries";
import { getErrorMessage } from "@/lib/utils";

import type { PlannerView, SprintResponse } from "@/types/planner";

const PLANNER = LABELS.PLANNER;

/** How long to keep polling sprints after generation kicks off (server processes it async). */
const GENERATION_POLL_WINDOW_MS = 120_000;

interface PlannerContentProps {
  projectId: string;
}

/** Data-wiring container for a resolved project: sprints, tasks and dialogs. */
function PlannerContent({ projectId }: PlannerContentProps) {
  const [view, setView] = useState<PlannerView>("kanban");
  const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(
    undefined,
  );
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isTaskFormDialogOpen, setIsTaskFormDialogOpen] = useState(false);
  const [isPollingForSprints, setIsPollingForSprints] = useState(false);

  const generateSprints = useGenerateSprints(projectId);
  const isGenerating = generateSprints.isPending || isPollingForSprints;
  const {
    data: sprints,
    isLoading,
    isError,
    error,
  } = useSprints(projectId, isGenerating);

  useEffect(() => {
    if (!isPollingForSprints) return;
    const timeoutId = globalThis.setTimeout(() => {
      setIsPollingForSprints(false);
    }, GENERATION_POLL_WINDOW_MS);
    return () => globalThis.clearTimeout(timeoutId);
  }, [isPollingForSprints]);

  const sprintList: SprintResponse[] = sprints ?? [];
  const activeSprint =
    sprintList.find((sprint) => sprint.id === selectedSprintId) ??
    sprintList[0];
  const sprintOptions = sprintList.map((sprint) =>
    toSprintOption(sprint, activeSprint?.id),
  );

  const handleGenerate = () => {
    generateSprints.mutate(undefined, {
      onSuccess: () => setIsPollingForSprints(true),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-red-500">
          {getErrorMessage(error, PLANNER.EMPTY.SPRINTS_LOAD_ERROR)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PlannerControls
        view={view}
        sprintOptions={sprintOptions}
        isGenerating={isGenerating}
        onViewChange={setView}
        onSelectSprint={setSelectedSprintId}
        onNewTask={() => setIsTaskFormDialogOpen(true)}
        onGenerate={() => setIsGenerateDialogOpen(true)}
      />
      <SprintSummaryBar sprint={activeSprint} />

      {view === "kanban" ? (
        <KanbanBoard
          projectId={projectId}
          selectedSprintId={activeSprint?.id}
        />
      ) : (
        <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
          {PLANNER.VIEW.GANTT_COMING_SOON}
        </div>
      )}

      <GenerateSprintDialog
        open={isGenerateDialogOpen}
        isGenerating={isGenerating}
        onConfirm={handleGenerate}
        onOpenChange={setIsGenerateDialogOpen}
      />
      <TaskFormDialog
        open={isTaskFormDialogOpen}
        projectId={projectId}
        sprints={sprintList}
        defaultSprintId={activeSprint?.id}
        onOpenChange={setIsTaskFormDialogOpen}
      />
    </div>
  );
}

/**
 * PlannerPage — the sprint planner route. Resolves the active project from
 * context, then delegates sprint/task wiring to {@link PlannerContent}.
 */
function PlannerPage() {
  const { projectId, isLoading } = useProject();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <FolderKanban className="h-8 w-8 text-slate-300" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-slate-900">
            {PLANNER.EMPTY.NO_PROJECT_TITLE}
          </p>
          <p className="text-sm text-slate-500">
            {PLANNER.EMPTY.NO_PROJECT_DESCRIPTION}
          </p>
        </div>
      </div>
    );
  }

  return <PlannerContent projectId={projectId} />;
}

export default PlannerPage;
