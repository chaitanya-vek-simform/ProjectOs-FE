import { z } from "zod";

import { LABELS } from "@/constants/labels";

const FORM_LABELS = LABELS.REQUIREMENTS.FORM;

export const requirementUpdateSchema = z.object({
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
  status: z.string().trim().optional(),
  type: z.string().trim().optional(),
});

export type RequirementUpdateFormValues = z.infer<
  typeof requirementUpdateSchema
>;

const storyPointsField = z
  .string()
  .optional()
  .refine(
    (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0),
    { message: FORM_LABELS.VALIDATION.STORY_POINTS_INVALID },
  );

export const userStoryUpdateSchema = z.object({
  story: z
    .string()
    .trim()
    .min(1, FORM_LABELS.VALIDATION.STORY_REQUIRED)
    .max(500, FORM_LABELS.VALIDATION.STORY_MAX),
  acceptance_criteria: z
    .string()
    .trim()
    .max(2000, FORM_LABELS.VALIDATION.ACCEPTANCE_CRITERIA_MAX)
    .optional(),
  story_points: storyPointsField,
  priority: z.string().trim().optional(),
  status: z.string().trim().optional(),
  epic: z.string().trim().max(255, FORM_LABELS.VALIDATION.EPIC_MAX).optional(),
  feature: z
    .string()
    .trim()
    .max(255, FORM_LABELS.VALIDATION.FEATURE_MAX)
    .optional(),
});

export type UserStoryUpdateFormValues = z.infer<typeof userStoryUpdateSchema>;
