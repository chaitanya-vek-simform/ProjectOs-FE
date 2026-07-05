import { Download, Loader2, Pencil, Sparkles } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge/status-badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LABELS } from "@/constants/labels";

import type { StatusTone } from "@/types/common";
import { AskAiDialog } from "../ask-ai-dialog/ask-ai-dialog";
import { useState } from "react";

const { HEADER, EDIT } = LABELS.PROPOSAL;

interface ProposalHeaderProps {
  readonly hasProposal: boolean;
  readonly statusLabel?: string;
  readonly statusTone?: StatusTone;
  readonly isGenerating: boolean;
  /** False when the project has no requirements — generation is disabled. */
  readonly canGenerate: boolean;
  /** Whether the whole document is currently in edit mode. */
  readonly isEditing: boolean;
  /** True while the edited proposal is being saved. */
  readonly isSaving: boolean;
  readonly onGenerate: () => void;
  readonly onExport: () => void;
  /** Toggles edit mode; when already editing, this acts as "Save". */
  readonly onToggleEdit: () => void;
  /** Discards edits and exits edit mode. */
  readonly onCancel: () => void;
  readonly projectId: string;
  readonly projectName?: string;
}

/** Top action row: generation status plus edit / export / generate controls. */
function ProposalHeader({
  hasProposal,
  statusLabel,
  statusTone,
  isGenerating,
  canGenerate,
  isEditing,
  isSaving,
  onGenerate,
  onExport,
  onToggleEdit,
  onCancel,
  projectId,
  projectName,
}: ProposalHeaderProps) {
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  let editToggleLabel: string = EDIT.EDIT_BUTTON;
  if (isSaving) editToggleLabel = EDIT.SAVING;
  else if (isEditing) editToggleLabel = EDIT.SAVE_BUTTON;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {statusLabel && statusTone && (
          <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hasProposal && (
          <>
            <Button
              variant="outline"
              disabled={!hasProposal}
              onClick={() => setIsAskAiOpen(true)}
            >
              {isGenerating ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles aria-hidden="true" />
              )}
              {isGenerating ? HEADER.EDITING : HEADER.EDIT}
            </Button>
            <Button
              variant={isEditing ? "default" : "outline"}
              disabled={isSaving}
              onClick={onToggleEdit}
              className={isEditing ? "bg-indigo-600 hover:bg-indigo-700" : ""}
            >
              {isSaving ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Pencil aria-hidden="true" />
              )}
              {editToggleLabel}
            </Button>
            {isEditing && (
              <Button variant="outline" disabled={isSaving} onClick={onCancel}>
                {EDIT.CANCEL_BUTTON}
              </Button>
            )}
          </>
        )}
        <Button
          variant="outline"
          disabled={!hasProposal || isEditing}
          onClick={onExport}
        >
          <Download aria-hidden="true" />
          {HEADER.EXPORT}
        </Button>
        {!hasProposal && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Wrapper keeps hover events alive so the tooltip still shows
                    while the button is disabled. */}
                <span>
                  <Button
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    disabled={isGenerating || !canGenerate}
                    onClick={onGenerate}
                  >
                    {isGenerating ? (
                      <Loader2 className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Sparkles aria-hidden="true" />
                    )}
                    {isGenerating ? HEADER.GENERATING : HEADER.GENERATE}
                  </Button>
                </span>
              </TooltipTrigger>
              {!canGenerate && (
                <TooltipContent>{HEADER.GENERATE_DISABLED_HINT}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <AskAiDialog
        open={isAskAiOpen}
        onOpenChange={setIsAskAiOpen}
        projectId={projectId}
        projectName={projectName}
      />
    </div>
  );
}

export { ProposalHeader };
