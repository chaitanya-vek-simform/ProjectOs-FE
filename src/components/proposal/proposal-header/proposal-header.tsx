import { useState } from "react";
import { Download, Loader2, Sparkles } from "lucide-react";

import { AskAiDialog } from "@/components/proposal/ask-ai-dialog/ask-ai-dialog";
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

const { HEADER } = LABELS.PROPOSAL;

interface ProposalHeaderProps {
  hasProposal: boolean;
  statusLabel?: string;
  statusTone?: StatusTone;
  isGenerating: boolean;
  /** False when the project has no requirements — generation is disabled. */
  canGenerate: boolean;
  onGenerate: () => void;
  onExport: () => void;
  projectId: string;
  projectName?: string;
}

/** Top action row: generation status plus edit / export / generate controls. */
function ProposalHeader({
  hasProposal,
  statusLabel,
  statusTone,
  isGenerating,
  canGenerate,
  onGenerate,
  onExport,
  projectId,
  projectName,
}: ProposalHeaderProps) {
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {statusLabel && statusTone && (
          <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={!hasProposal}
          onClick={() => setIsAskAiOpen(true)}
        >
          {HEADER.EDIT}
        </Button>
        <Button variant="outline" disabled={!hasProposal} onClick={onExport}>
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
