import { z } from "zod";

import { LABELS } from "@/constants/labels";

const FORM_LABELS = LABELS.PLANNER.FORM;

export const taskCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, FORM_LABELS.VALIDATION.TITLE_REQUIRED)
    .max(255, FORM_LABELS.VALIDATION.TITLE_MAX),
  description: z
    .string()
    .trim()
    .max(2000, FORM_LABELS.VALIDATION.DESCRIPTION_MAX)
    .optional(),
  priority: z.string().trim().optional(),
  task_type: z
    .string()
    .trim()
    .max(50, FORM_LABELS.VALIDATION.TASK_TYPE_MAX)
    .optional(),
  estimated_hours: z
    .string()
    .optional()
    .refine(
      (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      {
        message: FORM_LABELS.VALIDATION.ESTIMATED_HOURS_INVALID,
      },
    ),
  sprint_id: z.string().trim().optional(),
  due_date: z.string().trim().optional(),
  assignee_id: z
    .string()
    .trim()
    .max(255, FORM_LABELS.VALIDATION.ASSIGNEE_MAX)
    .optional(),
});

export type TaskCreateFormValues = z.infer<typeof taskCreateSchema>;
