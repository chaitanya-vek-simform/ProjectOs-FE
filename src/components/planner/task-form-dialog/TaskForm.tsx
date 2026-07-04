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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LABELS } from "@/constants/labels";
import { useCreateTask } from "@/hooks/planner/mutations";
import { taskCreateSchema, type TaskCreateFormValues } from "@/schemas/planner";

import type { Priority } from "@/types/common";
import type { SprintResponse, TaskCreate } from "@/types/planner";

const FORM_LABELS = LABELS.PLANNER.FORM;

/** Sentinel Select value for "no sprint" — Radix Select disallows empty-string items. */
const NO_SPRINT = "__none__";

const PRIORITY_OPTIONS: readonly { value: Priority; label: string }[] = [
  { value: "low", label: FORM_LABELS.PRIORITY_LOW },
  { value: "medium", label: FORM_LABELS.PRIORITY_MEDIUM },
  { value: "high", label: FORM_LABELS.PRIORITY_HIGH },
  { value: "critical", label: FORM_LABELS.PRIORITY_CRITICAL },
];

function toTaskCreateDto(values: TaskCreateFormValues): TaskCreate {
  return {
    title: values.title,
    description: values.description || null,
    priority: values.priority || undefined,
    task_type: values.task_type || undefined,
    estimated_hours: values.estimated_hours
      ? Number(values.estimated_hours)
      : undefined,
    sprint_id: values.sprint_id === NO_SPRINT ? null : values.sprint_id || null,
    due_date: values.due_date || null,
    assignee_id: values.assignee_id || null,
  };
}

interface TaskFormProps {
  projectId: string;
  sprints: SprintResponse[];
  defaultSprintId?: string;
  onSuccess: () => void;
}

/** Create-task form. Preselects `defaultSprintId` when provided. */
function TaskForm({
  projectId,
  sprints,
  defaultSprintId,
  onSuccess,
}: TaskFormProps) {
  const form = useForm<TaskCreateFormValues>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      task_type: "",
      estimated_hours: "",
      sprint_id: defaultSprintId ?? NO_SPRINT,
      due_date: undefined,
      assignee_id: "",
    },
  });
  const { mutate: createTask, isPending } = useCreateTask(projectId);

  const handleSubmit = form.handleSubmit((values) => {
    createTask(toTaskCreateDto(values), {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{FORM_LABELS.TITLE_LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={FORM_LABELS.TITLE_PLACEHOLDER} {...field} />
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.PRIORITY_LABEL}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={FORM_LABELS.PRIORITY_PLACEHOLDER}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="task_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.TASK_TYPE_LABEL}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={FORM_LABELS.TASK_TYPE_PLACEHOLDER}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="estimated_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.ESTIMATED_HOURS_LABEL}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder={FORM_LABELS.ESTIMATED_HOURS_PLACEHOLDER}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sprint_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.SPRINT_LABEL}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={FORM_LABELS.SPRINT_PLACEHOLDER}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NO_SPRINT}>
                      {FORM_LABELS.SPRINT_NONE}
                    </SelectItem>
                    {sprints.map((sprint) => (
                      <SelectItem key={sprint.id} value={sprint.id}>
                        {`${LABELS.PLANNER.CONTROLS.SPRINT_PREFIX} ${sprint.sprint_number}: ${sprint.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.DUE_DATE_LABEL}</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignee_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORM_LABELS.ASSIGNEE_LABEL}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={FORM_LABELS.ASSIGNEE_PLACEHOLDER}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {FORM_LABELS.SUBMIT_BUTTON}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { TaskForm };
