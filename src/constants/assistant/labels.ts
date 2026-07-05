/** All user-visible copy for the AI Assistant module. */
export const ASSISTANT_LABELS = {
  LAUNCHER: {
    OPEN_ARIA: "Open AI assistant",
    CLOSE_ARIA: "Close AI assistant",
  },
  WINDOW: {
    TITLE: "AI Assistant",
    SUBTITLE: "Ask anything about your projects.",
    CLOSE_ARIA: "Close chat",
    RESET_ARIA: "Clear chat history",
    RESET_CONFIRM_TITLE: "Clear conversation?",
    RESET_CONFIRM_DESCRIPTION:
      "This will permanently clear your conversation for this project. This action cannot be undone.",
    RESET_CONFIRM_ACTION: "Yes, clear",
    RESET_CONFIRM_CANCEL: "Cancel",
    LOADING_HISTORY: "Loading your conversation…",
  },
  EMPTY: {
    TITLE: "How can I help?",
    BODY: "Ask a question and I'll respond in real time.",
  },
  COMPOSER: {
    PLACEHOLDER: "Send a message…",
    NO_PROJECT_PLACEHOLDER: "Select a project to start chatting.",
    SEND_ARIA: "Send message",
    STOP_ARIA: "Stop generating",
    HINT: "Enter to send · Shift+Enter for a new line",
  },
  MESSAGE: {
    USER_ARIA: "Your message",
    ASSISTANT_ARIA: "Assistant message",
    THINKING: "Thinking…",
  },
  API: {
    ERROR: "The assistant couldn't respond. Please try again.",
    EMPTY_RESPONSE: "The assistant returned an empty response.",
    CLEAR_ERROR: "Couldn't clear the chat. Please try again.",
  },
} as const;
