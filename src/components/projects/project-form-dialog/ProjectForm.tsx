import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { DatePicker } from "@/components/common/date-picker/date-picker";
import { Button } from "@/components/ui/button";
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
import { LABELS } from "@/constants/labels";
import { useCreateProject, useUpdateProject } from "@/hooks/projects/mutations";
import {
  updateProjectSchema,
  type UpdateProjectFormValues,
} from "@/schemas/projects";

import type {
  CreateProjectDto,
  Project,
  UpdateProjectDto,
} from "@/types/projects";

const FORM_LABELS = LABELS.PROJECTS.FORM;
const DIALOG_LABELS = LABELS.PROJECTS.DIALOG;

const EMPTY_VALUES: UpdateProjectFormValues = {
  name: "",
  description: "",
  client_name: "",
  status: "",
  start_date: undefined,
  target_end_date: undefined,
  budget_usd: undefined,
};

function toFormValues(project: Project): UpdateProjectFormValues {
  return {
    name: project.name,
    description: project.description ?? "",
    client_name: project.client_name ?? "",
    status: project.status ?? "",
    start_date: project.start_date ?? undefined,
    target_end_date: project.target_end_date ?? undefined,
    budget_usd:
      project.budget_usd !== null ? String(project.budget_usd) : undefined,
  };
}

function toCreateProjectDto(values: UpdateProjectFormValues): CreateProjectDto {
  return {
    name: values.name,
    description: values.description || null,
    client_name: values.client_name || null,
    start_date: values.start_date || null,
    target_end_date: values.target_end_date || null,
    budget_usd: values.budget_usd ? Number(values.budget_usd) : null,
  };
}

function toUpdateProjectDto(values: UpdateProjectFormValues): UpdateProjectDto {
  return {
    ...toCreateProjectDto(values),
    status: values.status || null,
  };
}

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
}

/** Shared create/edit form for projects. Renders in "edit" mode when `project` is passed. */
function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const isEditMode = project !== undefined;
  const form = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: project ? toFormValues(project) : EMPTY_VALUES,
  });
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const isPending = isCreating || isUpdating;

  const handleSubmit = form.handleSubmit((values) => {
    if (isEditMode) {
      updateProject(
        { projectId: project.id, data: toUpdateProjectDto(values) },
        { onSuccess },
      );
      return;
    }

    createProject(toCreateProjectDto(values), {
      onSuccess: () => {
        form.reset(EMPTY_VALUES);
        onSuccess();
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{FORM_LABELS.NAME_LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={FORM_LABELS.NAME_PLACEHOLDER} {...field} />
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
                <Textarea
                  placeholder={FORM_LABELS.DESCRIPTION_PLACEHOLDER}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.CLIENT_NAME_LABEL}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={FORM_LABELS.CLIENT_NAME_PLACEHOLDER}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEditMode ? (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{FORM_LABELS.STATUS_LABEL}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={FORM_LABELS.STATUS_PLACEHOLDER}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.START_DATE_LABEL}</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.TARGET_END_DATE_LABEL}</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="budget_usd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FORM_LABELS.BUDGET_LABEL}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder={FORM_LABELS.BUDGET_PLACEHOLDER}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isEditMode
              ? DIALOG_LABELS.SAVE_BUTTON
              : DIALOG_LABELS.SUBMIT_BUTTON}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { ProjectForm };
