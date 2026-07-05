import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { LABELS } from "@/constants/labels";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  clarificationFormSchema,
  type ClarificationFormValues,
} from "@/schemas/requirements";

import { ClarificationQuestionField } from "./ClarificationQuestionField";

import type {
  ClarificationAnswersPayload,
  ClarificationQuestion,
} from "@/types/requirements";

const L = LABELS.REQUIREMENTS.UPLOAD_FLOW;

interface ClarificationStepProps {
  questions: ClarificationQuestion[];
  isSubmitting: boolean;
  isSkipping: boolean;
  onSubmit: (payload: ClarificationAnswersPayload) => void;
  onSkip: () => void;
}

function buildDefaultValues(
  questions: ClarificationQuestion[],
): ClarificationFormValues {
  const answers: ClarificationFormValues["answers"] = {};
  questions.forEach((question) => {
    answers[question.id] = {
      selected: question.selected ?? [],
      answer_text: question.answer_text ?? "",
    };
  });
  return { answers };
}

function toPayload(
  values: ClarificationFormValues,
): ClarificationAnswersPayload {
  return {
    answers: Object.entries(values.answers).map(([questionId, answer]) => ({
      question_id: questionId,
      selected: answer.selected,
      answer_text: answer.answer_text.trim() || null,
    })),
  };
}

/** Clarification questions form with skip-all and submit actions. */
function ClarificationStep({
  questions,
  isSubmitting,
  isSkipping,
  onSubmit,
  onSkip,
}: ClarificationStepProps) {
  const form = useForm<ClarificationFormValues>({
    resolver: zodResolver(clarificationFormSchema),
    defaultValues: buildDefaultValues(questions),
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(toPayload(values));
  });

  const isBusy = isSubmitting || isSkipping;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
          {questions.map((question, index) => (
            <ClarificationQuestionField
              key={question.id}
              control={form.control}
              question={question}
              index={index}
            />
          ))}
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={isBusy}
          >
            {isSkipping && (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            {L.SKIP}
          </Button>
          <Button type="submit" disabled={isBusy}>
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            {L.SUBMIT}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export { ClarificationStep };
