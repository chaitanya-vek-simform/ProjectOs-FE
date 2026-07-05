import { useState } from "react";
import { Loader2 } from "lucide-react";

import { SuggestTeamDialog } from "@/components/resources/suggest-team-dialog";
import { TeamMembersTable } from "@/components/resources/team-members-table";
import { UtilizationHeatmap } from "@/components/resources/utilization-heatmap";
import { LABELS } from "@/constants/labels";
import { HEATMAP_WEEK_COUNT } from "@/constants/resources";
import { useProject } from "@/contexts/useProject";
import { useConnectERP } from "@/hooks/projects/mutations";
import { useProject as useProjectDetail } from "@/hooks/projects/queries";
import {
  useRemoveTeamMember,
  useSaveTeam,
  useSuggestTeam,
} from "@/hooks/resources/mutations";
import { useProjectTeam, useUtilization } from "@/hooks/resources/queries";
import { toHeatmapRows, type SelectedMember } from "@/types/resources";
import {
  savedTeamToTableRows,
  toSaveTeamPayload,
} from "@/types/resources/team";

const STATE = LABELS.RESOURCES.STATE;

function ResourcesPage() {
  const { projectId, isLoading: isProjectLoading } = useProject();
  const { data: project } = useProjectDetail(projectId);
  const {
    data: projectTeam,
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useProjectTeam(projectId);
  const {
    data: utilization,
    isLoading: isUtilizationLoading,
    isError: isUtilizationError,
  } = useUtilization();
  const suggest = useSuggestTeam();
  const connectERP = useConnectERP();
  const saveTeam = useSaveTeam();
  const removeMember = useRemoveTeamMember();
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);

  if (isProjectLoading || isTeamLoading || isUtilizationLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <Loader2
          className="size-8 animate-spin text-indigo-600"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isTeamError || isUtilizationError) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            {STATE.ERROR_TITLE}
          </p>
          <p className="mt-1 text-sm text-slate-400">{STATE.ERROR_BODY}</p>
        </div>
      </div>
    );
  }

  const savedMembers = projectTeam?.members ?? [];
  const members = savedTeamToTableRows(savedMembers);
  const utilizationList = utilization ?? [];
  const heatmapRows = toHeatmapRows(utilizationList, HEATMAP_WEEK_COUNT);

  const handleSuggest = () => {
    if (!projectId) return;
    setIsSuggestOpen(true);
    suggest.mutate(projectId);
  };

  const handleToggleSimERP = () => {
    if (!projectId) return;
    const isCurrentlyEnabled = project?.connect_erp ?? false;
    connectERP.mutate({ projectId, enabled: !isCurrentlyEnabled });
  };

  const handleCreateTeam = (selections: SelectedMember[]) => {
    if (!projectId) return;
    const source = suggest.data?.source === "simerp" ? "simerp" : "internal";
    const { members: payload } = toSaveTeamPayload(selections, source);
    saveTeam.mutate(
      { projectId, members: payload },
      { onSuccess: () => setIsSuggestOpen(false) },
    );
  };

  const handleRemoveMember = (memberId: string) => {
    if (!projectId) return;
    removeMember.mutate({ projectId, memberId });
  };

  const hasTeam = members.length > 0;

  return (
    <div className="space-y-5">
      <TeamMembersTable
        members={members}
        onSuggest={handleSuggest}
        isSuggesting={suggest.isPending}
        canSuggest={Boolean(projectId)}
        isSimERPEnabled={project?.connect_erp}
        onToggleSimERP={handleToggleSimERP}
        isSyncingSimERP={connectERP.isPending}
        emptyMessage={hasTeam ? undefined : STATE.EMPTY_BODY}
        onRemoveMember={hasTeam ? handleRemoveMember : undefined}
        removingMemberId={
          removeMember.isPending ? removeMember.variables?.memberId : undefined
        }
      />
      <UtilizationHeatmap rows={heatmapRows} />
      <SuggestTeamDialog
        open={isSuggestOpen}
        onOpenChange={setIsSuggestOpen}
        data={suggest.data}
        isLoading={suggest.isPending}
        onCreateTeam={handleCreateTeam}
        isCreating={saveTeam.isPending}
      />
    </div>
  );
}

export default ResourcesPage;
