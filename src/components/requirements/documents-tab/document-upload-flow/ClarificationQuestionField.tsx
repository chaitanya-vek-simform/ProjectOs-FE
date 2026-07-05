import { Controller, type Control } from "react-hook-form";

import { LABELS } from "@/constants/labels";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Textarea } from "@/components/ui/textarea";

import type { ClarificationFormValues } from "@/schemas/requirements";
import type { ClarificationQuestion } from "@/types/requirements";

const L = LABELS.REQUIREMENTS.UPLOAD_FLOW;

interface ClarificationQuestionFieldProps {
  control: Control<ClarificationFormValues>;
  question: ClarificationQuestion;
  index: number;
}

/** A single clarification question — single/multi select options plus free text. */
function ClarificationQuestionField({
  control,
  question,
  index,
}: ClarificationQuestionFieldProps) {
  const selectedName = `answers.${question.id}.selected` as const;
  const answerTextName = `answers.${question.id}.answer_text` as const;

  return (
    <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4">
      <legend className="px-1 text-sm font-medium text-slate-800">
        {`${index + 1}. ${question.question}`}
      </legend>
      {question.rationale && (
        <p className="text-xs text-slate-500">
          <span className="font-medium text-slate-600">
            {`${L.RATIONALE_LABEL}: `}
          </span>
          {question.rationale}
        </p>
      )}

      <Controller
        control={control}
        name={selectedName}
        render={({ field }) => {
          const selected = field.value ?? [];

          if (question.allow_multiple) {
            const toggle = (option: string, checked: boolean) => {
              field.onChange(
                checked
                  ? [...selected, option]
                  : selected.filter((value) => value !== option),
              );
            };

            return (
              <div className="space-y-2">
                {question.options.map((option) => {
                  const id = `${question.id}-${option}`;
                  return (
                    <div key={option} className="flex items-start gap-2">
                      <Checkbox
                        id={id}
                        checked={selected.includes(option)}
                        onCheckedChange={(checked) =>
                          toggle(option, checked === true)
                        }
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor={id}
                        className="text-sm font-normal text-slate-700"
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </div>
            );
          }

          return (
            <RadioGroup
              value={selected[0] ?? ""}
              onValueChange={(value) => field.onChange([value])}
            >
              {question.options.map((option) => {
                const id = `${question.id}-${option}`;
                return (
                  <div key={option} className="flex items-start gap-2">
                    <RadioGroupItem value={option} id={id} className="mt-0.5" />
                    <Label
                      htmlFor={id}
                      className="text-sm font-normal text-slate-700"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          );
        }}
      />

      <Controller
        control={control}
        name={answerTextName}
        render={({ field }) => (
          <div className="space-y-1">
            <Label
              htmlFor={answerTextName}
              className="text-xs font-medium text-slate-600"
            >
              {L.OTHER_LABEL}
            </Label>
            <Textarea
              id={answerTextName}
              rows={2}
              placeholder={L.ANSWER_PLACEHOLDER}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />
    </fieldset>
  );
}

export { ClarificationQuestionField };
