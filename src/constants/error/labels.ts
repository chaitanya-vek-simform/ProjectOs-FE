/** Copy for the global error / not-found pages. */
export const ERROR_LABELS = {
  GENERIC: {
    TITLE: "Something went wrong",
    BODY: "An unexpected error occurred. You can try again, or head back to your dashboard.",
    RETRY: "Try again",
    HOME: "Back to dashboard",
  },
  /** Shown when a stale build chunk fails to load after a deploy. */
  STALE: {
    TITLE: "A new version is available",
    BODY: "The app was updated. Reload to get the latest version.",
    RELOAD: "Reload",
  },
  NOT_FOUND: {
    CODE: "404",
    TITLE: "Page not found",
    BODY: "The page you're looking for doesn't exist or may have moved.",
    HOME: "Back to dashboard",
  },
} as const;
