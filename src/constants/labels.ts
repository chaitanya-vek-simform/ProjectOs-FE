import { ASSISTANT_LABELS } from "@/constants/assistant/labels";
import { AUTH_LABELS } from "@/constants/auth/labels";
import { DASHBOARD_LABELS } from "@/constants/dashboard/labels";
import { ERROR_LABELS } from "@/constants/error/labels";
import { MEETINGS_LABELS } from "@/constants/meetings/labels";
import { NAV_LABELS } from "@/constants/nav/labels";
import { PLANNER_LABELS } from "@/constants/planner/labels";
import { PROJECTS_LABELS } from "@/constants/projects/labels";
import { PROPOSAL_LABELS } from "@/constants/proposal/labels";
import { REQUIREMENTS_LABELS } from "@/constants/requirements/labels";
import { RESOURCES_LABELS } from "@/constants/resources/labels";
import { RISK_LABELS } from "@/constants/risk/labels";

/**
 * Centralised UI copy. Design-system primitives read their default strings from
 * here so wording stays consistent and translatable. Feature modules extend this
 * object with their own namespaces.
 */
export const LABELS = {
  COMMON: {
    COMBOBOX: {
      SELECT_PLACEHOLDER: "Select...",
      SEARCH_PLACEHOLDER: "Search...",
      NO_RESULTS: "No results found.",
    },
    MULTI_SELECT: {
      SELECTED_SUFFIX: "selected",
      REMOVE_ARIA_PREFIX: "Remove ",
    },
    COMMAND: {
      PALETTE_TITLE: "Command Palette",
      SEARCH_PLACEHOLDER: "Search for a command to run...",
    },
  },
  AUTH: AUTH_LABELS,
  NAV: NAV_LABELS,
  DASHBOARD: DASHBOARD_LABELS,
  PROJECTS: PROJECTS_LABELS,
  REQUIREMENTS: REQUIREMENTS_LABELS,
  PROPOSAL: PROPOSAL_LABELS,
  PLANNER: PLANNER_LABELS,
  MEETINGS: MEETINGS_LABELS,
  RISK: RISK_LABELS,
  RESOURCES: RESOURCES_LABELS,
  ASSISTANT: ASSISTANT_LABELS,
  ERROR: ERROR_LABELS,
} as const;
