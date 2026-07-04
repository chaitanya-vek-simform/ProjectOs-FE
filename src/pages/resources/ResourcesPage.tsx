import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SuggestTeamDialog } from "@/components/resources/suggest-team-dialog";
import { TeamMembersTable } from "@/components/resources/team-members-table";
import { UtilizationHeatmap } from "@/components/resources/utilization-heatmap";
import { LABELS } from "@/constants/labels";
import { HEATMAP_WEEK_COUNT } from "@/constants/resources";
import { useProject } from "@/contexts/useProject";
import { useSuggestTeam } from "@/hooks/resources/mutations";
import { useTeam, useUtilization } from "@/hooks/resources/queries";
import {
  toCreatedTeamMembers,
  toHeatmapRows,
  toTeamMembers,
  type SelectedMember,
  type TeamMember,
} from "@/types/resources";

const STATE = LABELS.RESOURCES.STATE;

function ResourcesPage() {
  const { projectId, isLoading: isProjectLoading } = useProject();
  const {
    data: team,
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useTeam();
  const {
    data: utilization,
    isLoading: isUtilizationLoading,
    isError: isUtilizationError,
  } = useUtilization();
  const suggest = useSuggestTeam();
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  // TEMPORARY: locally-added members from Create Team until the endpoint exists.
  const [createdMembers, setCreatedMembers] = useState<TeamMember[]>([]);

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

  if (!team || team.length === 0) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            {STATE.EMPTY_TITLE}
          </p>
          <p className="mt-1 text-sm text-slate-400">{STATE.EMPTY_BODY}</p>
        </div>
      </div>
    );
  }

  const utilizationList = utilization ?? [];
  const members = [...toTeamMembers(team, utilizationList), ...createdMembers];
  const heatmapRows = toHeatmapRows(utilizationList, HEATMAP_WEEK_COUNT);

  const handleSuggest = () => {
    if (!projectId) return;
    setIsSuggestOpen(true);
    suggest.mutate(projectId);
  };

  // TEMPORARY: add selected members to the table locally. Replace with the
  // Create Team API call + team-query invalidation once the endpoint is ready.
  const handleCreateTeam = (selections: SelectedMember[]) => {
    setCreatedMembers((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const additions = toCreatedTeamMembers(selections).filter(
        (m) => !existingIds.has(m.id),
      );
      return [...prev, ...additions];
    });
    setIsSuggestOpen(false);
    toast.success(LABELS.RESOURCES.SUGGEST.CREATE_SUCCESS);
  };

  return (
    <div className="space-y-5">
      <TeamMembersTable
        members={members}
        onSuggest={handleSuggest}
        isSuggesting={suggest.isPending}
        canSuggest={Boolean(projectId)}
      />
      <UtilizationHeatmap rows={heatmapRows} />
      <SuggestTeamDialog
        open={isSuggestOpen}
        onOpenChange={setIsSuggestOpen}
        data={suggest.data}
        isLoading={suggest.isPending}
        onCreateTeam={handleCreateTeam}
        isCreating={false}
      />
    </div>
  );
}

export default ResourcesPage;
