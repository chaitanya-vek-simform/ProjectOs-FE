import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { LABELS } from "@/constants/labels";
import { REQUIREMENTS_QUERY_KEYS } from "@/constants/queryKeys";
import { useClarifications, useTaskStatus } from "@/hooks/requirements/queries";
import {
  useSkipClarifications,
  useSubmitClarifications,
} from "@/hooks/requirements/mutations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ClarificationStep } from "./ClarificationStep";
import { FlowStatusView } from "./FlowStatusView";
import { StepIndicator } from "./StepIndicator";

import type { DocumentTaskResponse } from "@/types/requirements";

const L = LABELS.REQUIREMENTS.UPLOAD_FLOW;
const STATE_L = LABELS.REQUIREMENTS.STATE;

type FlowStep = "analyzing" | "questions" | "processing" | "done" | "error";

const STEP_LABELS = [L.STEP_ANALYZE, L.STEP_QUESTIONS, L.STEP_PROCESS];
const STEP_INDEX: Record<FlowStep, number> = {
  analyzing: 0,
  questions: 1,
  processing: 2,
  done: 3,
  error: 0,
};

interface TaskPoll {
  isError: boolean;
  data?: { status: string };
}

/** Derives the current flow step from the analysis/processing poll states. */
function deriveStep(
  processingStarted: boolean,
  analysis: TaskPoll,
  processing: TaskPoll,
): FlowStep {
  if (processingStarted) {
    if (processing.isError || processing.data?.status === "failed") {
      return "error";
    }
    if (processing.data?.status === "completed") return "done";
    return "processing";
  }
  if (analysis.isError || analysis.data?.status === "failed") return "error";
  if (analysis.data?.status === "completed") return "questions";
  return "analyzing";
}

interface DocumentUploadFlowDialogProps {
  open: boolean;
  projectId: string;
  task: DocumentTaskResponse;
  onOpenChange: (open: boolean) => void;
}

/**
 * Multi-step dialog: analyze → clarification Q&A → process → done.
 *
 * Polling uses declarative React Query (`useTaskStatus`) keyed by task id, and
 * the step is *derived* from query/mutation state — no `mutate` callbacks or
 * `setState`-in-effect, so it survives StrictMode's mount/remount cycle.
 */
function DocumentUploadFlowDialog({
  open,
  projectId,
  task,
  onOpenChange,
}: DocumentUploadFlowDialogProps) {
  const queryClient = useQueryClient();
  const documentId = task.document_id;

  const submit = useSubmitClarifications(projectId, documentId);
  const skip = useSkipClarifications(projectId, documentId);

  const processingTaskId = (submit.data ?? skip.data)?.task_id;
  const processingStarted = Boolean(processingTaskId);

  const analysis = useTaskStatus(task.task_id, !processingStarted);
  const processing = useTaskStatus(processingTaskId, processingStarted);

  const step = deriveStep(processingStarted, analysis, processing);

  const clarifications = useClarifications(
    projectId,
    documentId,
    step === "questions",
  );

  // Refresh the documents / requirements lists once processing completes.
  const invalidatedRef = useRef(false);
  useEffect(() => {
    if (step !== "done" || invalidatedRef.current) return;
    invalidatedRef.current = true;
    void queryClient.invalidateQueries({
      queryKey: REQUIREMENTS_QUERY_KEYS.DOCUMENTS(projectId),
    });
    void queryClient.invalidateQueries({
      queryKey: REQUIREMENTS_QUERY_KEYS.LIST(projectId),
    });
  }, [step, projectId, queryClient]);

  const close = () => onOpenChange(false);
  const questions = clarifications.data?.questions ?? [];

  const renderQuestionsStep = () => {
    if (clarifications.isLoading) {
      return (
        <FlowStatusView
          variant="loading"
          title={L.QUESTIONS_TITLE}
          description={STATE_L.LOADING}
        />
      );
    }
    if (clarifications.isError) {
      return (
        <FlowStatusView
          variant="error"
          title={L.QUESTIONS_TITLE}
          description={L.QUESTIONS_ERROR}
          action={{ label: L.CLOSE, onClick: close }}
        />
      );
    }
    if (questions.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="text-sm text-slate-500">{L.QUESTIONS_EMPTY}</p>
          <Button
            type="button"
            onClick={() => skip.mutate()}
            disabled={skip.isPending}
          >
            {L.CONTINUE}
          </Button>
        </div>
      );
    }
    return (
      <ClarificationStep
        questions={questions}
        isSubmitting={submit.isPending}
        isSkipping={skip.isPending}
        onSubmit={(payload) => submit.mutate(payload)}
        onSkip={() => skip.mutate()}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{task.filename ?? L.DIALOG_TITLE}</DialogTitle>
          <DialogDescription>{L.QUESTIONS_DESC}</DialogDescription>
        </DialogHeader>

        {step !== "error" && (
          <StepIndicator steps={STEP_LABELS} activeIndex={STEP_INDEX[step]} />
        )}

        {step === "analyzing" && (
          <FlowStatusView
            variant="loading"
            title={L.ANALYZING_TITLE}
            description={L.ANALYZING_DESC}
          />
        )}
        {step === "questions" && renderQuestionsStep()}
        {step === "processing" && (
          <FlowStatusView
            variant="loading"
            title={L.PROCESSING_TITLE}
            description={L.PROCESSING_DESC}
          />
        )}
        {step === "done" && (
          <FlowStatusView
            variant="done"
            title={L.DONE_TITLE}
            description={L.DONE_DESC}
            action={{ label: L.DONE_BUTTON, onClick: close }}
          />
        )}
        {step === "error" && (
          <FlowStatusView
            variant="error"
            title={L.ERROR_TITLE}
            description={L.ERROR_DESC}
            action={{ label: L.CLOSE, onClick: close }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export { DocumentUploadFlowDialog };
