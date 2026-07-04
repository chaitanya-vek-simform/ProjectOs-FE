import { formatDate } from "@/lib/utils";
import { LABELS } from "@/constants/labels";

import type { StatusTone } from "@/types/common";

/* -------------------------------------------------------------------------- */
/* API contract (server wire shapes — snake_case, bare responses)             */
/* -------------------------------------------------------------------------- */

/** Requirement classification (e.g. "functional" | "non_functional"). */
export type RequirementType = string;

/** A requirement as returned by `GET /projects/{id}/requirements`. */
export interface RequirementResponse {
  id: string;
  type: RequirementType;
  title: string;
  description: string;
  priority: string;
  status: string;
}

/** Body for updating a requirement (`PUT /requirements/{id}`). */
export interface RequirementUpdate {
  title?: string | null;
  description?: string | null;
  priority?: string | null;
  status?: string | null;
  type?: string | null;
}

/** A user story as returned by `GET /projects/{id}/stories`. */
export interface UserStoryResponse {
  id: string;
  epic: string;
  feature: string;
  story: string;
  acceptance_criteria: string;
  story_points: number;
  priority: string;
  status: string;
}

/** Body for updating a user story (`PUT /stories/{id}`). */
export interface UserStoryUpdate {
  story?: string | null;
  acceptance_criteria?: string | null;
  story_points?: number | null;
  priority?: string | null;
  status?: string | null;
  epic?: string | null;
  feature?: string | null;
}

/** A requirement source document as returned by the documents endpoints. */
export interface DocumentResponse {
  id: string;
  project_id: string;
  filename: string;
  storage_path: string;
  file_type: string;
  status: string;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Document file classification tile colour. */
export type DocumentTileTone = "red" | "blue" | "slate";

/** Processing lifecycle for an uploaded requirement document. */
export type DocumentStatus = "uploaded" | "processing" | "processed" | "failed";

/** A single uploaded requirement source document. */
export type RequirementDocument = {
  id: string;
  tileLabel: string;
  tileTone: DocumentTileTone;
  fileName: string;
  type: string;
  uploadedAt: string;
  status: DocumentStatus;
  statusTone: StatusTone;
  statusLabel: string;
  actionLabel: string;
  actionDisabled: boolean;
};

/** A functional requirement extracted from the source documents. */
export type FunctionalRequirement = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  priorityTone: StatusTone;
  priorityLabel: string;
};

/** A non-functional requirement (performance, availability, etc.). */
export type NonFunctionalRequirement = {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  priorityTone: StatusTone;
  priorityLabel: string;
};

/** A single Given/When/Then acceptance-criteria line. */
export type GherkinStep = {
  keyword: string;
  text: string;
};

/** Gherkin-style acceptance criteria for a user story. */
export type Gherkin = {
  given: GherkinStep;
  when: GherkinStep;
  then: GherkinStep;
};

/** A user story with estimation and acceptance criteria. */
export type UserStory = {
  id: string;
  code: string;
  priorityTone: StatusTone;
  priorityLabel: string;
  points: string;
  title: string;
  gherkin: Gherkin;
};

/** Epic tile accent colour. */
export type EpicTone = "indigo" | "orange";

/** A grouping of user stories under a shared theme. */
export type Epic = {
  id: string;
  title: string;
  tone: EpicTone;
  summary: string;
  stories: UserStory[];
  statusTone?: StatusTone;
  statusLabel?: string;
  note?: string;
};

/* -------------------------------------------------------------------------- */
/* Mappers — API wire shapes → UI-facing shapes                               */
/* -------------------------------------------------------------------------- */

const L = LABELS.REQUIREMENTS;

const FILE_TYPE_TILE: Record<
  string,
  { label: string; tone: DocumentTileTone }
> = {
  pdf: { label: L.DOCS_DATA.TILE_PDF, tone: "red" },
  docx: { label: L.DOCS_DATA.TILE_DOC, tone: "blue" },
  doc: { label: L.DOCS_DATA.TILE_DOC, tone: "blue" },
  txt: { label: L.DOCS_DATA.TILE_TXT, tone: "slate" },
};

const DOCUMENT_STATUS_META: Record<
  string,
  {
    tone: StatusTone;
    label: string;
    actionLabel: string;
    actionDisabled: boolean;
  }
> = {
  uploaded: {
    tone: "medium",
    label: L.STATUS.PROCESSING,
    actionLabel: L.ACTIONS.PENDING,
    actionDisabled: true,
  },
  processing: {
    tone: "medium",
    label: L.STATUS.PROCESSING,
    actionLabel: L.ACTIONS.PENDING,
    actionDisabled: true,
  },
  processed: {
    tone: "low",
    label: L.STATUS.PROCESSED,
    actionLabel: L.ACTIONS.VIEW_RESULTS,
    actionDisabled: false,
  },
  failed: {
    tone: "critical",
    label: L.STATUS.FAILED,
    actionLabel: L.ACTIONS.RETRY,
    actionDisabled: false,
  },
};

/** Maps a `DocumentResponse` from the API into the table-row UI shape. */
export function toRequirementDocument(
  doc: DocumentResponse,
): RequirementDocument {
  const fallbackTile: { label: string; tone: DocumentTileTone } = {
    label: doc.file_type.toUpperCase(),
    tone: "slate",
  };
  const tile = FILE_TYPE_TILE[doc.file_type.toLowerCase()] ?? fallbackTile;
  const statusMeta =
    DOCUMENT_STATUS_META[doc.status.toLowerCase()] ??
    DOCUMENT_STATUS_META.uploaded;

  return {
    id: doc.id,
    tileLabel: tile.label,
    tileTone: tile.tone,
    fileName: doc.filename,
    type: doc.file_type.toUpperCase(),
    uploadedAt: formatDate(doc.created_at) ?? "",
    status: doc.status.toLowerCase() as DocumentStatus,
    statusTone: statusMeta.tone,
    statusLabel: statusMeta.label,
    actionLabel: statusMeta.actionLabel,
    actionDisabled: statusMeta.actionDisabled,
  };
}

/** Maps a priority string from the API into a `StatusBadge` tone. */
export function priorityToTone(priority: string): StatusTone {
  switch (priority.toLowerCase()) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "neutral";
  }
}

const PRIORITY_LABEL: Record<string, string> = {
  critical: L.STATUS.CRITICAL,
  high: L.STATUS.HIGH,
  medium: L.STATUS.MEDIUM,
  low: L.STATUS.LOW,
};

/** Human-readable label for a priority string, falling back to the raw value. */
export function priorityToLabel(priority: string): string {
  return PRIORITY_LABEL[priority.toLowerCase()] ?? priority;
}

/** Maps a functional `RequirementResponse` into its UI row shape. */
export function toFunctionalRequirement(
  requirement: RequirementResponse,
): FunctionalRequirement {
  return {
    id: requirement.id,
    code: requirement.id.slice(0, 8).toUpperCase(),
    title: requirement.title,
    subtitle: requirement.description,
    priorityTone: priorityToTone(requirement.priority),
    priorityLabel: priorityToLabel(requirement.priority),
  };
}

/** Maps a non-functional `RequirementResponse` into its UI row shape. */
export function toNonFunctionalRequirement(
  requirement: RequirementResponse,
): NonFunctionalRequirement {
  return {
    id: requirement.id,
    code: requirement.id.slice(0, 8).toUpperCase(),
    title: requirement.title,
    subtitle: requirement.description || undefined,
    priorityTone: priorityToTone(requirement.priority),
    priorityLabel: priorityToLabel(requirement.priority),
  };
}

const GHERKIN_SEGMENT_PATTERN =
  /(given|when|then)[\s\S]*?(?=given|when|then|$)/gi;
const GHERKIN_KEYWORD_PATTERN = /^(given|when|then)\s*:?\s*/i;

/** Best-effort parse of a free-text acceptance-criteria string into Given/When/Then. */
export function parseGherkin(acceptanceCriteria: string): Gherkin {
  const matches = acceptanceCriteria.match(GHERKIN_SEGMENT_PATTERN);

  const steps: Record<string, string> = {};
  matches?.forEach((segment) => {
    const keywordMatch = GHERKIN_KEYWORD_PATTERN.exec(segment);
    const keyword = keywordMatch?.[1]?.toLowerCase();
    if (!keyword) return;
    steps[keyword] = segment.replace(GHERKIN_KEYWORD_PATTERN, "").trim();
  });

  const hasParsedSteps = Boolean(steps.given ?? steps.when ?? steps.then);

  return {
    given: {
      keyword: L.USER_STORIES.GIVEN,
      text: hasParsedSteps ? (steps.given ?? "") : acceptanceCriteria,
    },
    when: {
      keyword: L.USER_STORIES.WHEN,
      text: hasParsedSteps ? (steps.when ?? "") : "",
    },
    then: {
      keyword: L.USER_STORIES.THEN,
      text: hasParsedSteps ? (steps.then ?? "") : "",
    },
  };
}

/** Maps a `UserStoryResponse` into its UI card shape. */
export function toUserStory(story: UserStoryResponse): UserStory {
  return {
    id: story.id,
    code: story.id.slice(0, 8).toUpperCase(),
    priorityTone: priorityToTone(story.priority),
    priorityLabel: priorityToLabel(story.priority),
    points: L.DYNAMIC.STORY_POINTS(story.story_points),
    title: story.story,
    gherkin: parseGherkin(story.acceptance_criteria),
  };
}

const EPIC_TONES: EpicTone[] = ["indigo", "orange"];

/** Groups a flat list of user stories into epics by their `epic` field. */
export function groupStoriesIntoEpics(stories: UserStoryResponse[]): Epic[] {
  const byEpic = new Map<string, UserStoryResponse[]>();
  stories.forEach((story) => {
    const key = story.epic || story.feature;
    byEpic.set(key, [...(byEpic.get(key) ?? []), story]);
  });

  return Array.from(byEpic.entries()).map(([title, epicStories], index) => {
    const points = epicStories.reduce(
      (sum, story) => sum + story.story_points,
      0,
    );
    return {
      id: title,
      title,
      tone: EPIC_TONES[index % EPIC_TONES.length],
      summary: L.DYNAMIC.EPIC_SUMMARY(epicStories.length, points),
      stories: epicStories.map(toUserStory),
    };
  });
}
