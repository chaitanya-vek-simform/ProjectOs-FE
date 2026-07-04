import { useState } from "react";
import { Loader2 } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge/status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { LABELS } from "@/constants/labels";
import { getFallbackSuggestedMembers } from "@/constants/resources";
import { cn } from "@/lib/utils";
import {
  formatRoleLabel,
  type SelectedMember,
  type SuggestRecommendation,
  type SuggestTeamResponse,
  type SuggestedMember,
} from "@/types/resources";

const SUGGEST_LABELS = LABELS.RESOURCES.SUGGEST;

interface SuggestTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: SuggestTeamResponse;
  isLoading: boolean;
  onCreateTeam: (selections: SelectedMember[]) => void;
  isCreating: boolean;
}

function MemberSelectCard({
  member,
  checked,
  disabled,
  onToggle,
}: {
  member: SuggestedMember;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
        checked
          ? "border-indigo-500 bg-indigo-50"
          : "border-slate-200 hover:border-slate-300",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        className="pointer-events-none mt-0.5"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{member.name}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {member.skills.map((skill) => (
            <span
              key={`${member.id}-${skill}`}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function RecommendationCard({
  recommendation,
  selected,
  onToggle,
}: {
  recommendation: SuggestRecommendation;
  selected: SuggestedMember[];
  onToggle: (role: string, member: SuggestedMember, cap: number) => void;
}) {
  // TEMPORARY: fall back to static candidates when the API returns none.
  const members =
    recommendation.suggested_members.length > 0
      ? recommendation.suggested_members
      : getFallbackSuggestedMembers(recommendation.role);
  const cap = recommendation.count_needed;
  const selectedIds = new Set(selected.map((m) => m.id));
  const capReached = selected.length >= cap;

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          {formatRoleLabel(recommendation.role)}
        </h3>
        <StatusBadge tone="info">
          {SUGGEST_LABELS.COUNT_NEEDED}: {cap}
        </StatusBadge>
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">
        {SUGGEST_LABELS.SUGGESTED_MEMBERS} · {selected.length}/{cap}{" "}
        {SUGGEST_LABELS.SELECTED}
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {members.map((member) => (
          <MemberSelectCard
            key={member.id}
            member={member}
            checked={selectedIds.has(member.id)}
            disabled={capReached && !selectedIds.has(member.id)}
            onToggle={() => onToggle(recommendation.role, member, cap)}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((row) => (
          <div key={row} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-3 w-28" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestSummary({ data }: { data: SuggestTeamResponse }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-slate-50 p-3">
        <p className="text-xs text-slate-500">{SUGGEST_LABELS.STORY_POINTS}</p>
        <p className="text-lg font-semibold text-slate-900">
          {data.total_story_points}
        </p>
      </div>
      <div className="rounded-lg bg-slate-50 p-3">
        <p className="text-xs text-slate-500">{SUGGEST_LABELS.SPRINTS}</p>
        <p className="text-lg font-semibold text-slate-900">
          {data.estimated_sprints}
        </p>
      </div>
    </div>
  );
}

function SuggestBody({
  data,
  isLoading,
  selectedByRole,
  onToggle,
}: {
  data?: SuggestTeamResponse;
  isLoading: boolean;
  selectedByRole: Record<string, SuggestedMember[]>;
  onToggle: (role: string, member: SuggestedMember, cap: number) => void;
}) {
  if (isLoading) {
    return <SuggestSkeleton />;
  }

  if (!data) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        {SUGGEST_LABELS.EMPTY}
      </p>
    );
  }

  return (
    <>
      <SuggestSummary data={data} />
      {data.recommendations.length > 0 ? (
        <div className="space-y-3">
          {data.recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.role}
              recommendation={recommendation}
              selected={selectedByRole[recommendation.role] ?? []}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{SUGGEST_LABELS.EMPTY}</p>
      )}
    </>
  );
}

function SuggestTeamDialog({
  open,
  onOpenChange,
  data,
  isLoading,
  onCreateTeam,
  isCreating,
}: SuggestTeamDialogProps) {
  const [selectedByRole, setSelectedByRole] = useState<
    Record<string, SuggestedMember[]>
  >({});

  const handleOpenChange = (next: boolean) => {
    if (!next) setSelectedByRole({});
    onOpenChange(next);
  };

  const handleCreate = () => {
    onCreateTeam(selections);
    setSelectedByRole({});
  };

  const toggleMember = (role: string, member: SuggestedMember, cap: number) => {
    setSelectedByRole((prev) => {
      const current = prev[role] ?? [];
      if (current.some((m) => m.id === member.id)) {
        return { ...prev, [role]: current.filter((m) => m.id !== member.id) };
      }
      if (current.length >= cap) return prev;
      return { ...prev, [role]: [...current, member] };
    });
  };

  const selections: SelectedMember[] = Object.entries(selectedByRole).flatMap(
    ([role, members]) => members.map((member) => ({ role, member })),
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{SUGGEST_LABELS.TITLE}</DialogTitle>
          <DialogDescription>{SUGGEST_LABELS.DESCRIPTION}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto">
          <SuggestBody
            data={data}
            isLoading={isLoading}
            selectedByRole={selectedByRole}
            onToggle={toggleMember}
          />
        </div>

        {data && !isLoading ? (
          <DialogFooter>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={selections.length === 0 || isCreating}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isCreating ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : null}
              {SUGGEST_LABELS.CREATE_TEAM}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export { SuggestTeamDialog };
