import { z } from "zod";

import { LABELS } from "@/constants/labels";

const FORM_LABELS = LABELS.PROJECTS.FORM;

const budgetField = z
  .string()
  .optional()
  .refine(
    (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0),
    {
      message: FORM_LABELS.BUDGET_INVALID,
    },
  );

const dateRangeRefinement = (data: {
  start_date?: string;
  target_end_date?: string;
}) =>
  !data.start_date ||
  !data.target_end_date ||
  data.target_end_date >= data.start_date;

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(1, FORM_LABELS.NAME_REQUIRED),
    description: z.string().trim().optional(),
    client_name: z.string().trim().optional(),
    start_date: z.string().optional(),
    target_end_date: z.string().optional(),
    budget_usd: budgetField,
  })
  .refine(dateRangeRefinement, {
    message: FORM_LABELS.DATE_RANGE_INVALID,
    path: ["target_end_date"],
  });

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1, FORM_LABELS.NAME_REQUIRED),
    description: z.string().trim().optional(),
    client_name: z.string().trim().optional(),
    status: z.string().trim().optional(),
    start_date: z.string().optional(),
    target_end_date: z.string().optional(),
    budget_usd: budgetField,
  })
  .refine(dateRangeRefinement, {
    message: FORM_LABELS.DATE_RANGE_INVALID,
    path: ["target_end_date"],
  });

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
