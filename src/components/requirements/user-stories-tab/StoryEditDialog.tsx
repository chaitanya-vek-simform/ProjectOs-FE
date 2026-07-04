import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { LABELS } from "@/constants/labels";
import { useUpdateStory } from "@/hooks/requirements/mutations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  userStoryUpdateSchema,
  type UserStoryUpdateFormValues,
} from "@/schemas/requirements";

import type { UserStoryResponse } from "@/types/requirements";

const FORM_LABELS = LABELS.REQUIREMENTS.FORM;

function toFormValues(story: UserStoryResponse): UserStoryUpdateFormValues {
  return {
    story: story.story,
    acceptance_criteria: story.acceptance_criteria,
    story_points: String(story.story_points),
    priority: story.priority,
    status: story.status,
    epic: story.epic,
    feature: story.feature,
  };
}

interface StoryEditDialogProps {
  story: UserStoryResponse | undefined;
  projectId: string | undefined;
  onOpenChange: (open: boolean) => void;
}

/** Edit dialog for a single user story, backed by `PUT /stories/{id}`. */
function StoryEditDialog({
  story,
  projectId,
  onOpenChange,
}: StoryEditDialogProps) {
  const { mutate: updateStory, isPending } = useUpdateStory(projectId ?? "");
  const form = useForm<UserStoryUpdateFormValues>({
    resolver: zodResolver(userStoryUpdateSchema),
    values: story ? toFormValues(story) : undefined,
  });

  const handleSubmit = form.handleSubmit((values) => {
    if (!story) return;
    updateStory(
      {
        storyId: story.id,
        data: {
          ...values,
          story_points: values.story_points
            ? Number(values.story_points)
            : null,
        },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  });

  return (
    <Dialog open={story !== undefined} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{FORM_LABELS.STORY_EDIT_TITLE}</DialogTitle>
          <DialogDescription>
            {FORM_LABELS.STORY_EDIT_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{FORM_LABELS.STORY_LABEL}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acceptance_criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{FORM_LABELS.ACCEPTANCE_CRITERIA_LABEL}</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="epic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.EPIC_LABEL}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.FEATURE_LABEL}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.PRIORITY_LABEL}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.STATUS_LABEL}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="story_points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.STORY_POINTS_LABEL}</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                )}
                {FORM_LABELS.SAVE_BUTTON}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { StoryEditDialog };
