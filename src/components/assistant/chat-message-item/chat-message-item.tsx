import { Bot, User } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

import { MarkdownContent } from "@/components/common/markdown/markdown";

import type { ChatMessage } from "@/types/assistant";

const MESSAGE = LABELS.ASSISTANT.MESSAGE;

interface ChatMessageItemProps {
  readonly message: ChatMessage;
}

/**
 * A single chat turn. User turns align right with a filled bubble; assistant
 * turns align left. A streaming assistant turn with no content yet shows a
 * "thinking" placeholder, and a blinking caret while tokens arrive.
 */
function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const isPending = message.streaming && !message.content;

  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-2",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
      aria-label={isUser ? MESSAGE.USER_ARIA : MESSAGE.ASSISTANT_ARIA}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700",
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </span>

      <div
        className={cn(
          "flex min-w-0 max-w-sm flex-col",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "min-w-0 max-w-sm rounded-2xl px-3 py-2 text-sm leading-relaxed overflow-hidden",
            isUser
              ? "bg-indigo-600 whitespace-pre-wrap text-white break-words"
              : "bg-slate-100 text-slate-900 break-words",
          )}
        >
          {isPending ? (
            <span className="text-slate-500">{MESSAGE.THINKING}</span>
          ) : isUser ? (
            message.content
          ) : (
            <>
              <MarkdownContent content={message.content} />
              {message.streaming && (
                <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-current align-middle" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { ChatMessageItem };
