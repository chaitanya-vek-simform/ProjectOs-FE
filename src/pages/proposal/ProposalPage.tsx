import { useRef } from "react";
import { isAxiosError } from "axios";
import { FileText, FolderKanban, Loader2 } from "lucide-react";

import { ProposalDocument } from "@/components/proposal/proposal-document/proposal-document";
import { ProposalHeader } from "@/components/proposal/proposal-header/proposal-header";
import { LABELS } from "@/constants/labels";
import { useProject } from "@/contexts/useProject";
import { useProposal } from "@/hooks/proposal/queries";
import { useProposalGeneration } from "@/hooks/proposal/useProposalGeneration";
import { useRequirements } from "@/hooks/requirements/queries";
import { getErrorMessage } from "@/lib/utils";
import {
  isProposalInProgress,
  toProposal,
  type Proposal,
} from "@/types/proposal";

const PROPOSAL = LABELS.PROPOSAL;

/**
 * The backend 404s `GET /proposal` both when the project itself doesn't exist
 * ("Project not found") and when the project has no proposal yet ("No Proposal
 * generated yet"). Only the latter is the empty state — the former is a real error.
 */
function isProposalNotGeneratedError(error: unknown): boolean {
  if (!isAxiosError(error) || error.response?.status !== 404) return false;
  const detail = (error.response?.data as { detail?: string } | undefined)
    ?.detail;
  return (
    typeof detail === "string" && detail.toLowerCase().includes("proposal")
  );
}

interface ProposalBodyProps {
  proposal: Proposal | null;
  projectName?: string;
  isGenerating: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  documentRef: React.RefObject<HTMLDivElement | null>;
}

/** Resolves which panel to render: document, generating, loading, error, or empty. */
function ProposalBody({
  proposal,
  projectName,
  isGenerating,
  isLoading,
  isError,
  errorMessage,
  documentRef,
}: ProposalBodyProps) {
  if (proposal) {
    return (
      <div ref={documentRef} data-proposal-print>
        <ProposalDocument proposal={proposal} projectName={projectName} />
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-center">
        <Loader2
          className="h-6 w-6 animate-spin text-slate-400"
          aria-hidden="true"
        />
        <p className="text-sm text-slate-500">{PROPOSAL.HEADER.GENERATING}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
        <Loader2
          className="h-6 w-6 animate-spin text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-center">
      <FileText className="h-8 w-8 text-slate-300" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-slate-900">
          {PROPOSAL.EMPTY.TITLE}
        </p>
        <p className="text-sm text-slate-500">{PROPOSAL.EMPTY.DESCRIPTION}</p>
      </div>
    </div>
  );
}

interface ProposalContentProps {
  projectId: string;
  projectName?: string;
}

/** Data-wiring container for a resolved project: proposal fetch, generation, and states. */
function ProposalContent({ projectId, projectName }: ProposalContentProps) {
  const documentRef = useRef<HTMLDivElement>(null);

  const { generate, isGenerating } = useProposalGeneration(projectId);
  const {
    data: proposalResponse,
    isLoading,
    isError,
    error,
  } = useProposal(projectId);
  const { data: requirements } = useRequirements(projectId);
  const hasRequirements = (requirements?.length ?? 0) > 0;

  const handleExport = () => {
    if (!documentRef.current) return;
    // Native browser print — the print stylesheet in index.css isolates the
    // tagged proposal document so the PDF is a pixel-exact match of the UI.
    window.print();
  };

  const proposal = proposalResponse ? toProposal(proposalResponse) : null;
  const isBackendGenerating =
    proposal !== null && isProposalInProgress(proposal.status);
  const displayIsGenerating = isGenerating || isBackendGenerating;
  const readyProposal = proposal && !isBackendGenerating ? proposal : null;
  const notGenerated = isError && isProposalNotGeneratedError(error);

  return (
    <div className="space-y-5">
      <ProposalHeader
        hasProposal={readyProposal !== null}
        statusLabel={proposal?.statusLabel}
        statusTone={proposal?.statusTone}
        isGenerating={displayIsGenerating}
        canGenerate={hasRequirements}
        onGenerate={generate}
        onExport={handleExport}
        projectId={projectId}
        projectName={projectName}
      />

      <ProposalBody
        proposal={readyProposal}
        projectName={projectName}
        isGenerating={displayIsGenerating}
        isLoading={isLoading}
        isError={isError && !notGenerated}
        errorMessage={
          isError ? getErrorMessage(error, PROPOSAL.PAGE.LOAD_ERROR) : undefined
        }
        documentRef={documentRef}
      />
    </div>
  );
}

/**
 * ProposalPage — the proposal route. Resolves the active project from context,
 * then delegates proposal fetch/generation wiring to {@link ProposalContent}.
 */
function ProposalPage() {
  const { projectId, activeProject, isLoading } = useProject();

  if (isLoading) {
    return (
      <main className="bg-slate-50 p-6">
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
      </main>
    );
  }

  if (!projectId) {
    return (
      <main className="bg-slate-50 p-6">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FolderKanban className="h-8 w-8 text-slate-300" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-slate-900">
              {PROPOSAL.PAGE.NO_PROJECT_TITLE}
            </p>
            <p className="text-sm text-slate-500">
              {PROPOSAL.PAGE.NO_PROJECT_DESCRIPTION}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 p-6">
      <ProposalContent
        projectId={projectId}
        projectName={activeProject?.name}
      />
    </main>
  );
}

export default ProposalPage;
