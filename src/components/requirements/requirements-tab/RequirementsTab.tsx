import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { useProject } from "@/contexts/useProject";
import { useRequirements } from "@/hooks/requirements/queries";
import { getErrorMessage } from "@/lib/utils";

import { RequirementEditDialog } from "./RequirementEditDialog";
import { RequirementGroupCard } from "./RequirementGroupCard";
import { RequirementRow } from "./RequirementRow";
import { RequirementsToolbar, FILTER_ALL } from "./RequirementsToolbar";

import {
  toFunctionalRequirement,
  toNonFunctionalRequirement,
  type RequirementResponse,
} from "@/types/requirements";

const L = LABELS.REQUIREMENTS.REQUIREMENTS;
const STATE_L = LABELS.REQUIREMENTS.STATE;
const FR_CHIP = "bg-indigo-100 text-indigo-600";
const NFR_CHIP = "bg-purple-100 text-purple-600";
const NON_FUNCTIONAL_TYPE = "non_functional";

function matchesSearch(
  requirement: RequirementResponse,
  search: string,
): boolean {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return (
    requirement.title.toLowerCase().includes(query) ||
    requirement.description.toLowerCase().includes(query)
  );
}

interface RequirementGroupsProps {
  isLoading: boolean;
  errorMessage: string | null;
  requirements: RequirementResponse[];
  onEdit: (requirement: RequirementResponse) => void;
}

function RequirementGroups({
  isLoading,
  errorMessage,
  requirements,
  onEdit,
}: RequirementGroupsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-10">
        <Loader2
          className="size-5 animate-spin text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-10">
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
      </div>
    );
  }

  if (requirements.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-10">
        <p className="text-sm text-slate-500">{STATE_L.REQUIREMENTS_EMPTY}</p>
      </div>
    );
  }

  const functionalRequirements = requirements.filter(
    (requirement) => requirement.type.toLowerCase() !== NON_FUNCTIONAL_TYPE,
  );
  const nonFunctionalRequirements = requirements.filter(
    (requirement) => requirement.type.toLowerCase() === NON_FUNCTIONAL_TYPE,
  );

  return (
    <>
      <RequirementGroupCard
        title={`${L.FUNCTIONAL_TITLE} (${functionalRequirements.length})`}
        dotClassName="bg-indigo-500"
      >
        {functionalRequirements.map((requirement) => {
          const row = toFunctionalRequirement(requirement);
          return (
            <RequirementRow
              key={row.id}
              code={row.code}
              title={row.title}
              subtitle={row.subtitle}
              priorityTone={row.priorityTone}
              priorityLabel={row.priorityLabel}
              chipClassName={FR_CHIP}
              onEdit={() => onEdit(requirement)}
            />
          );
        })}
      </RequirementGroupCard>
      <RequirementGroupCard
        title={`${L.NON_FUNCTIONAL_TITLE} (${nonFunctionalRequirements.length})`}
        dotClassName="bg-purple-500"
      >
        {nonFunctionalRequirements.map((requirement) => {
          const row = toNonFunctionalRequirement(requirement);
          return (
            <RequirementRow
              key={row.id}
              code={row.code}
              title={row.title}
              subtitle={row.subtitle}
              priorityTone={row.priorityTone}
              priorityLabel={row.priorityLabel}
              chipClassName={NFR_CHIP}
              onEdit={() => onEdit(requirement)}
            />
          );
        })}
      </RequirementGroupCard>
    </>
  );
}

/** Requirements tab — toolbar plus functional & non-functional requirement groups. */
function RequirementsTab() {
  const { projectId } = useProject();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(FILTER_ALL);
  const [editingRequirement, setEditingRequirement] = useState<
    RequirementResponse | undefined
  >(undefined);

  const apiType = typeFilter === FILTER_ALL ? undefined : typeFilter;
  const {
    data: requirements,
    isLoading,
    isError,
    error,
  } = useRequirements(projectId, apiType);

  const filtered = useMemo(
    () =>
      (requirements ?? []).filter((requirement) =>
        matchesSearch(requirement, search),
      ),
    [requirements, search],
  );

  const errorMessage = isError
    ? getErrorMessage(error, STATE_L.REQUIREMENTS_ERROR)
    : null;

  return (
    <div className="space-y-4">
      <RequirementsToolbar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <RequirementGroups
        isLoading={isLoading}
        errorMessage={errorMessage}
        requirements={filtered}
        onEdit={setEditingRequirement}
      />

      <RequirementEditDialog
        requirement={editingRequirement}
        projectId={projectId}
        onOpenChange={(open) => {
          if (!open) setEditingRequirement(undefined);
        }}
      />
    </div>
  );
}

export { RequirementsTab };
