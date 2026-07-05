import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { ProposalDocument } from "@/components/proposal/proposal-document/proposal-document";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LABELS } from "@/constants/labels";
import {
  useAiEditProposal,
  useUpdateProposal,
} from "@/hooks/proposal/mutations";
import { toProposalPreview, toProposalUpdate } from "@/types/proposal";

const DIALOG = LABELS.PROPOSAL.ASK_AI_DIALOG;

interface AskAiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName?: string;
}

/**
 * AskAiDialog — two-phase AI edit. Phase 1: describe a change and request an AI
 * edit (`POST /proposal/ai-edit`). Phase 2: preview the returned `proposed`
 * proposal and Confirm to commit it via `PUT /proposal`, or Discard to retry.
 */
function AskAiDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
}: AskAiDialogProps) {
  const [instruction, setInstruction] = useState("");
  const aiEdit = useAiEditProposal();
  const update = useUpdateProposal();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setInstruction("");
      aiEdit.reset();
    }
    onOpenChange(nextOpen);
  };

  const handleGenerate = () => {
    aiEdit.mutate({ projectId, instruction });
  };

  const handleConfirm = () => {
    if (!aiEdit.data) return;
    update.mutate(
      { projectId, data: toProposalUpdate(aiEdit.data.proposed) },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  const preview = aiEdit.data;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {preview ? DIALOG.PREVIEW_TITLE : DIALOG.TITLE}
          </DialogTitle>
        </DialogHeader>

        {preview ? (
          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-xs font-semibold tracking-wider text-indigo-500 uppercase">
                {DIALOG.CHANGE_SUMMARY_LABEL}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {preview.change_summary}
              </p>
            </div>
            <ProposalDocument
              proposal={toProposalPreview(preview.proposed)}
              projectName={projectName}
            />
          </div>
        ) : (
          <Textarea
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder={DIALOG.DESCRIPTION_PLACEHOLDER}
            className="min-h-32"
            autoFocus
          />
        )}

        <DialogFooter>
          {preview ? (
            <>
              <Button
                variant="outline"
                onClick={() => aiEdit.reset()}
                disabled={update.isPending}
              >
                {DIALOG.DISCARD}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={update.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {update.isPending ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : null}
                {update.isPending ? DIALOG.CONFIRMING : DIALOG.CONFIRM}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                {DIALOG.CANCEL}
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!instruction.trim() || aiEdit.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {aiEdit.isPending ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles aria-hidden="true" />
                )}
                {aiEdit.isPending ? DIALOG.GENERATING : DIALOG.SUBMIT}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AskAiDialog };
