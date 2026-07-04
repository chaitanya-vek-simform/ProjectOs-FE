import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { LABELS } from "@/constants/labels";
import { useUpdateRequirement } from "@/hooks/requirements/mutations";
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
  requirementUpdateSchema,
  type RequirementUpdateFormValues,
} from "@/schemas/requirements";

import type { RequirementResponse } from "@/types/requirements";

const FORM_LABELS = LABELS.REQUIREMENTS.FORM;

function toFormValues(
  requirement: RequirementResponse,
): RequirementUpdateFormValues {
  return {
    title: requirement.title,
    description: requirement.description,
    priority: requirement.priority,
    status: requirement.status,
    type: requirement.type,
  };
}

interface RequirementEditDialogProps {
  requirement: RequirementResponse | undefined;
  projectId: string | undefined;
  onOpenChange: (open: boolean) => void;
}

/** Edit dialog for a single requirement, backed by `PUT /requirements/{id}`. */
function RequirementEditDialog({
  requirement,
  projectId,
  onOpenChange,
}: RequirementEditDialogProps) {
  const { mutate: updateRequirement, isPending } = useUpdateRequirement(
    projectId ?? "",
  );
  const form = useForm<RequirementUpdateFormValues>({
    resolver: zodResolver(requirementUpdateSchema),
    values: requirement ? toFormValues(requirement) : undefined,
  });

  const handleSubmit = form.handleSubmit((values) => {
    if (!requirement) return;
    updateRequirement(
      { requirementId: requirement.id, data: values },
      { onSuccess: () => onOpenChange(false) },
    );
  });

  return (
    <Dialog open={requirement !== undefined} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{FORM_LABELS.REQUIREMENT_EDIT_TITLE}</DialogTitle>
          <DialogDescription>
            {FORM_LABELS.REQUIREMENT_EDIT_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{FORM_LABELS.TITLE_LABEL}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{FORM_LABELS.DESCRIPTION_LABEL}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
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

export { RequirementEditDialog };
