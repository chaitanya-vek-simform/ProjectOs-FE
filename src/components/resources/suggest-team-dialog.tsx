import { useState } from "react";
import { Database, Loader2, Sparkles, Users } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge/status-badge";
import { SuggestMemberCard } from "@/components/resources/suggest-member-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";
import {
  formatRoleLabel,
  type SelectedMember,
  type SuggestRecommendation,
  type SuggestTeamResponse,
  type SuggestedMember,
} from "@/types/resources";

const SUGGEST_LABELS = LABELS.RESOURCES.SUGGEST;

function RecommendationCard({
  recommendation,
  selected,
  onToggle,
}: {
  readonly recommendation: SuggestRecommendation;
  readonly selected: SuggestedMember[];
  readonly onToggle: (
    role: string,
    member: SuggestedMember,
    cap: number,
  ) => void;
}) {
  const members = recommendation.suggested_members;
  const cap = recommendation.count_needed;
  const selectedIds = new Set(selected.map((m) => m.id));
  const capReached = selected.length >= cap;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-indigo-500" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-900">
            {formatRoleLabel(recommendation.role)}
          </h3>
        </div>
        <StatusBadge tone="info">
          {SUGGEST_LABELS.COUNT_NEEDED}: {cap}
        </StatusBadge>
      </div>
      {members.length > 0 ? (
        <>
          <p className="mt-3 text-xs font-medium text-slate-500">
            {SUGGEST_LABELS.SUGGESTED_MEMBERS} ·{" "}
            <span
              className={cn(
                selected.length === cap && "font-semibold text-emerald-600",
              )}
            >
              {selected.length}/{cap} {SUGGEST_LABELS.SELECTED}
            </span>
          </p>
          <div className="mt-2 flex flex-col gap-3">
            {members.map((member) => (
              <SuggestMemberCard
                key={member.id}
                member={member}
                checked={selectedIds.has(member.id)}
                disabled={capReached && !selectedIds.has(member.id)}
                onToggle={() => onToggle(recommendation.role, member, cap)}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-400">
          {recommendation.gap ?? SUGGEST_LABELS.NO_MEMBERS}
        </p>
      )}
    </div>
  );
}

function SuggestLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-200 opacity-60" />
        <div className="relative flex size-14 items-center justify-center rounded-full bg-indigo-100">
          <Loader2
            className="size-7 animate-spin text-indigo-600"
            aria-hidden="true"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {SUGGEST_LABELS.LOADING}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {SUGGEST_LABELS.LOADING_BODY}
        </p>
      </div>
    </div>
  );
}

function SuggestSummary({ data }: { readonly data: SuggestTeamResponse }) {
  const isSimERP = data.source === "simerp";
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            {SUGGEST_LABELS.STORY_POINTS}
          </p>
          <p className="text-xl font-bold text-slate-900">
            {data.total_story_points}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">{SUGGEST_LABELS.SPRINTS}</p>
          <p className="text-xl font-bold text-slate-900">
            {data.estimated_sprints}
          </p>
        </div>
      </div>
      {data.source && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
            isSimERP
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-slate-100 text-slate-600 ring-slate-200",
          )}
        >
          <Database className="size-3.5" aria-hidden="true" />
          {!isSimERP && SUGGEST_LABELS.SOURCE_LOCAL}
        </span>
      )}
      {data.summary && (
        <p className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs leading-relaxed text-slate-600">
          {data.summary}
        </p>
      )}
    </div>
  );
}

function SuggestBody({
  data,
  isLoading,
  selectedByRole,
  onToggle,
}: {
  readonly data?: SuggestTeamResponse;
  readonly isLoading: boolean;
  readonly selectedByRole: Record<string, SuggestedMember[]>;
  readonly onToggle: (
    role: string,
    member: SuggestedMember,
    cap: number,
  ) => void;
}) {
  if (isLoading) {
    return <SuggestLoading />;
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
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly data?: SuggestTeamResponse;
  readonly isLoading: boolean;
  readonly onCreateTeam: (selections: SelectedMember[]) => void;
  readonly isCreating: boolean;
}) {
  const [selectedByRole, setSelectedByRole] = useState<
    Record<string, SuggestedMember[]>
  >({});

  const handleOpenChange = (next: boolean) => {
    if (!next) setSelectedByRole({});
    onOpenChange(next);
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

  const handleCreate = () => {
    onCreateTeam(selections);
    setSelectedByRole({});
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-indigo-500" aria-hidden="true" />
            {SUGGEST_LABELS.TITLE}
          </DialogTitle>
          <DialogDescription>{SUGGEST_LABELS.DESCRIPTION}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          <SuggestBody
            data={data}
            isLoading={isLoading}
            selectedByRole={selectedByRole}
            onToggle={toggleMember}
          />
        </div>

        {data && !isLoading ? (
          <DialogFooter className="items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              {selections.length} {SUGGEST_LABELS.SELECTED}
            </p>
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
