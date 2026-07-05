import { useEffect, useRef } from "react";
import { Bot, Loader2, RotateCcw, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LABELS } from "@/constants/labels";

import type { ChatMessage } from "@/types/assistant";
import { ChatComposer } from "../chat-composer/chat-composer";
import { ChatMessageItem } from "../chat-message-item/chat-message-item";

const WINDOW = LABELS.ASSISTANT.WINDOW;
const EMPTY = LABELS.ASSISTANT.EMPTY;

interface ChatWindowProps {
  readonly messages: ChatMessage[];
  readonly isStreaming: boolean;
  /** True while the persisted thread is being loaded for the active project. */
  readonly isLoadingHistory: boolean;
  /** True while the thread is being cleared server-side. */
  readonly isClearing: boolean;
  /** False when no project is selected — the composer is disabled. */
  readonly canSend: boolean;
  readonly onSend: (message: string) => void;
  readonly onStop: () => void;
  readonly onReset: () => void;
  readonly onClose: () => void;
}

/**
 * The chat surface: a bottom-right anchored panel (full-screen on mobile) with a
 * header, an auto-scrolling message list, and the composer. Escape closes it.
 */
function ChatWindow({
  messages,
  isStreaming,
  isLoadingHistory,
  isClearing,
  canSend,
  onSend,
  onStop,
  onReset,
  onClose,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label={WINDOW.TITLE}
      className="fixed inset-0 z-50 flex flex-col bg-white shadow-2xl sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[min(600px,calc(100vh-8rem))] sm:w-96 sm:rounded-2xl sm:border sm:border-slate-200"
    >
      <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <span
          className="flex size-8 items-center justify-center rounded-full bg-indigo-600 text-white"
          aria-hidden="true"
        >
          <Bot className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {WINDOW.TITLE}
          </p>
          <p className="truncate text-xs text-slate-500">{WINDOW.SUBTITLE}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={WINDOW.RESET_ARIA}
              disabled={messages.length === 0 || isClearing || isStreaming}
            >
              {isClearing ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <RotateCcw aria-hidden="true" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{WINDOW.RESET_CONFIRM_TITLE}</AlertDialogTitle>
              <AlertDialogDescription>
                {WINDOW.RESET_CONFIRM_DESCRIPTION}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {WINDOW.RESET_CONFIRM_CANCEL}
              </AlertDialogCancel>
              <AlertDialogAction onClick={onReset}>
                {WINDOW.RESET_CONFIRM_ACTION}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onClose}
          aria-label={WINDOW.CLOSE_ARIA}
        >
          <X aria-hidden="true" />
        </Button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
      >
        {isLoadingHistory && messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Loader2
              className="size-5 animate-spin text-indigo-600"
              aria-hidden="true"
            />
            <p className="text-xs text-slate-500">{WINDOW.LOADING_HISTORY}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span
              className="mb-3 flex size-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"
              aria-hidden="true"
            >
              <Bot className="size-6" />
            </span>
            <p className="text-sm font-medium text-slate-900">{EMPTY.TITLE}</p>
            <p className="mt-1 max-w-56 text-xs text-slate-500">{EMPTY.BODY}</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))
        )}
      </div>

      <ChatComposer
        isStreaming={isStreaming}
        canSend={canSend}
        onSend={onSend}
        onStop={onStop}
      />
    </div>
  );
}

export { ChatWindow };
