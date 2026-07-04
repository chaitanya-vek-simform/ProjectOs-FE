import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { LABELS } from "@/constants/labels";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge/status-badge";

import { StoryCard } from "./StoryCard";

import type { Epic, EpicTone } from "@/types/requirements";

const EPIC_TONE_CLASSES: Record<EpicTone, string> = {
  indigo: "bg-indigo-500",
  orange: "bg-orange-500",
};

interface EpicCardProps {
  epic: Epic;
  onEditStory: (storyId: string) => void;
}

/** An epic grouping — header with accent tile plus its child story cards or a note. */
function EpicCard({ epic, onEditStory }: EpicCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "size-8 shrink-0 rounded-md",
              EPIC_TONE_CLASSES[epic.tone],
            )}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">{epic.title}</p>
            <p className="text-xs text-slate-500">{epic.summary}</p>
          </div>
        </div>
        {epic.statusTone && epic.statusLabel ? (
          <StatusBadge tone={epic.statusTone}>{epic.statusLabel}</StatusBadge>
        ) : (
          <ChevronDown
            className="size-5 text-slate-400"
            aria-label={LABELS.REQUIREMENTS.USER_STORIES.COLLAPSE_ARIA}
          />
        )}
      </CardHeader>
      <CardContent className="space-y-3 px-5 py-4">
        {epic.stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onEdit={() => onEditStory(story.id)}
          />
        ))}
        {epic.note ? (
          <p className="text-sm text-slate-500">{epic.note}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { EpicCard };
