import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LABELS } from "@/constants/labels";

const DIALOG = LABELS.PLANNER.GENERATE_DIALOG;

interface GenerateSprintDialogProps {
  open: boolean;
  /** True while the async generation kickoff / sprint polling is in flight. */
  isGenerating: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

/**
 * GenerateSprintDialog — confirm + progress modal for the AI sprint-plan
 * generation. Shows a start prompt, then a single spinner while generation is
 * in flight. Closing does not cancel the backend job.
 */
function GenerateSprintDialog({
  open,
  isGenerating,
  onConfirm,
  onOpenChange,
}: GenerateSprintDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isGenerating}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              {isGenerating ? (
                <Loader2
                  className="h-5 w-5 animate-spin text-indigo-600"
                  aria-hidden="true"
                />
              ) : (
                <Sparkles
                  className="h-5 w-5 text-indigo-600"
                  aria-hidden="true"
                />
              )}
            </span>
            <div>
              <DialogTitle>{DIALOG.TITLE}</DialogTitle>
              <p className="text-sm text-slate-500">{DIALOG.SUBTITLE}</p>
            </div>
          </div>
        </DialogHeader>

        <p className="py-2 text-sm text-slate-600">
          {isGenerating ? DIALOG.PENDING : DIALOG.DESCRIPTION}
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {DIALOG.CLOSE}
          </Button>
          {!isGenerating && (
            <Button
              onClick={onConfirm}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Sparkles aria-hidden="true" />
              {DIALOG.START}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { GenerateSprintDialog };
