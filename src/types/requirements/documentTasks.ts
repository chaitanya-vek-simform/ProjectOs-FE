/* -------------------------------------------------------------------------- */
/* Async document tasks & clarification wire shapes (snake_case, bare)         */
/* -------------------------------------------------------------------------- */

/**
 * Response from `POST /projects/{id}/documents` and the clarification
 * submit/skip endpoints — an async task handle plus the document it belongs to.
 */
export interface DocumentTaskResponse {
  task_id: string;
  type: string;
  status: string;
  document_id: string;
  filename?: string;
  project_id?: string;
}

/** Lifecycle state of an async document task. */
export type DocumentTaskProgress =
  "pending" | "running" | "completed" | "failed";

/** Poll result of `GET /tasks/{task_id}` for async document operations. */
export interface DocumentTaskStatus {
  task_id: string;
  type: string;
  resource_id: string | null;
  project_id: string | null;
  status: DocumentTaskProgress;
  progress: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

/** A single clarification question returned by the clarifications endpoint. */
export interface ClarificationQuestion {
  id: string;
  question: string;
  category: string;
  rationale: string;
  options: string[];
  allow_multiple: boolean;
  selected: string[];
  answer_text: string | null;
  answered: boolean;
}

/** Response from `GET /projects/{id}/documents/{docId}/clarifications`. */
export interface ClarificationsResponse {
  document_id: string;
  status: string;
  questions: ClarificationQuestion[];
  generated_at: string;
  answered_at: string | null;
}

/** A single answer entry in the clarification-answers payload. */
export interface ClarificationAnswer {
  question_id: string;
  selected: string[];
  answer_text: string | null;
}

/** Body for `POST .../clarifications/answers`. */
export interface ClarificationAnswersPayload {
  answers: ClarificationAnswer[];
}
