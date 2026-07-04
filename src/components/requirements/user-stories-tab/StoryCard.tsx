import { Pencil } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge/status-badge";

import { GherkinBlock } from "./GherkinBlock";

import type { UserStory } from "@/types/requirements";

interface StoryCardProps {
  story: UserStory;
  onEdit: () => void;
}

/** A single user story card with metadata and Gherkin acceptance criteria. */
function StoryCard({ story, onEdit }: StoryCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{story.code}</span>
          <StatusBadge tone={story.priorityTone}>
            {story.priorityLabel}
          </StatusBadge>
          <span className="text-xs text-slate-500">{story.points}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={LABELS.REQUIREMENTS.USER_STORIES.EDIT_ARIA}
          onClick={onEdit}
        >
          <Pencil className="size-4 text-slate-400" aria-hidden="true" />
        </Button>
      </div>
      <p className="mt-2 mb-3 text-sm font-medium text-slate-800">
        {story.title}
      </p>
      <GherkinBlock gherkin={story.gherkin} />
    </div>
  );
}

export { StoryCard };
