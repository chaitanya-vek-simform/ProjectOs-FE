import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { useProject } from "@/contexts/useProject";
import { useStories } from "@/hooks/requirements/queries";
import { useGenerateStories } from "@/hooks/requirements/mutations";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { EpicCard } from "./EpicCard";
import { StoryEditDialog } from "./StoryEditDialog";

import {
  groupStoriesIntoEpics,
  type UserStoryResponse,
} from "@/types/requirements";

const L = LABELS.REQUIREMENTS.REQUIREMENTS;
const STATE_L = LABELS.REQUIREMENTS.STATE;

/** How long to keep polling for generated stories after the trigger request succeeds. */
const GENERATION_POLL_WINDOW_MS = 120_000;

interface GenerateStoriesButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

function GenerateStoriesButton({
  onGenerate,
  isGenerating,
}: GenerateStoriesButtonProps) {
  return (
    <Button
      type="button"
      className="bg-indigo-600 text-white hover:bg-indigo-700"
      onClick={onGenerate}
      disabled={isGenerating}
    >
      {isGenerating && (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      )}
      {L.GENERATE_STORIES}
    </Button>
  );
}

/** User Stories tab — epics with their nested story cards. */
function UserStoriesTab() {
  const { projectId } = useProject();
  const [isPollingForStories, setIsPollingForStories] = useState(false);
  const {
    data: stories,
    isLoading,
    isError,
    error,
  } = useStories(projectId, isPollingForStories);
  const { mutate: generateStories, isPending: isGeneratingStories } =
    useGenerateStories(projectId ?? "");
  const [editingStoryId, setEditingStoryId] = useState<string | undefined>(
    undefined,
  );

  const epics = useMemo(() => groupStoriesIntoEpics(stories ?? []), [stories]);
  const editingStory = stories?.find(
    (story: UserStoryResponse) => story.id === editingStoryId,
  );

  const handleGenerateStories = () => {
    generateStories(undefined, {
      onSuccess: () => setIsPollingForStories(true),
    });
  };

  useEffect(() => {
    if (!isPollingForStories) return;
    const timeoutId = globalThis.setTimeout(() => {
      setIsPollingForStories(false);
    }, GENERATION_POLL_WINDOW_MS);
    return () => globalThis.clearTimeout(timeoutId);
  }, [isPollingForStories]);

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

  if (isError) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-10">
        <p className="text-sm font-medium text-red-500">
          {getErrorMessage(error, STATE_L.STORIES_ERROR)}
        </p>
      </div>
    );
  }

  if (epics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white py-10">
        <p className="text-sm text-slate-500">{STATE_L.STORIES_EMPTY}</p>
        <GenerateStoriesButton
          onGenerate={handleGenerateStories}
          isGenerating={isGeneratingStories}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <GenerateStoriesButton
          onGenerate={handleGenerateStories}
          isGenerating={isGeneratingStories}
        />
      </div>

      <div className="max-h-[calc(100vh-18rem)] space-y-4 overflow-y-auto">
        {epics.map((epic) => (
          <EpicCard key={epic.id} epic={epic} onEditStory={setEditingStoryId} />
        ))}
      </div>

      <StoryEditDialog
        story={editingStory}
        projectId={projectId}
        onOpenChange={(open) => {
          if (!open) setEditingStoryId(undefined);
        }}
      />
    </div>
  );
}

export { UserStoriesTab };
