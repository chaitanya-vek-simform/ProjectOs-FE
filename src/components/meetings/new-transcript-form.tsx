import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Zap } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LABELS } from "@/constants/labels";
import { useCreateMeeting } from "@/hooks/meetings/mutations";
import {
  meetingCreateSchema,
  type MeetingCreateFormValues,
} from "@/schemas/meetings";

const MEETINGS_LABELS = LABELS.MEETINGS;

const SHIMMER_WIDTHS = ["w-full", "w-5/6", "w-4/6"];

interface NewTranscriptFormProps {
  projectId: string;
  onCancel: () => void;
  onProcessed: () => void;
}

function ProcessingState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <Loader2
        className="size-8 animate-spin text-indigo-600"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {MEETINGS_LABELS.PROCESSING.TITLE}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {MEETINGS_LABELS.PROCESSING.SUBTITLE}
        </p>
      </div>
      <div className="w-full max-w-sm space-y-2">
        {SHIMMER_WIDTHS.map((width) => (
          <div
            key={width}
            className={`h-4 animate-pulse rounded bg-slate-200 ${width}`}
          />
        ))}
      </div>
    </div>
  );
}

function NewTranscriptForm({
  projectId,
  onCancel,
  onProcessed,
}: NewTranscriptFormProps) {
  const form = useForm<MeetingCreateFormValues>({
    resolver: zodResolver(meetingCreateSchema),
    defaultValues: {
      title: "",
      raw_transcript: "",
    },
  });
  const { mutate: createMeeting, isPending } = useCreateMeeting(projectId);

  const handleSubmit = form.handleSubmit((values) => {
    createMeeting(
      {
        title: values.title,
        raw_transcript: values.raw_transcript,
        meeting_date: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          form.reset();
          onProcessed();
        },
      },
    );
  });

  if (isPending) {
    return (
      <div className="flex-1">
        <ProcessingState />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {MEETINGS_LABELS.NEW.TITLE}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {MEETINGS_LABELS.NEW.SUBTITLE}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={MEETINGS_LABELS.NEW.TITLE_PLACEHOLDER}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="raw_transcript"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={10}
                    placeholder={MEETINGS_LABELS.NEW.TRANSCRIPT_PLACEHOLDER}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              {MEETINGS_LABELS.ACTIONS.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Zap className="size-4" aria-hidden="true" />
              {MEETINGS_LABELS.ACTIONS.PROCESS_WITH_AI}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export { NewTranscriptForm };
