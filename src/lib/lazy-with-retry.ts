import { lazy, type ComponentType } from "react";

const RELOAD_FLAG = "projectos.chunk-reloaded";

type Importer<T> = () => Promise<{ default: ComponentType<T> }>;

/** A promise that never settles — suspends rendering until the reload swaps the document. */
function pending<T>(): Promise<T> {
  return new Promise<T>(noop);
}

function noop(): void {
  return undefined;
}

/**
 * A `React.lazy` that survives stale chunks after a deploy. When a dynamic
 * `import()` fails to fetch (the classic "Failed to fetch dynamically imported
 * module" seen when hashed chunk filenames change on a new Vercel build), it
 * forces a one-time hard reload so the browser pulls the fresh `index.html` and
 * chunk map. The reload is guarded by a session flag: if the import still fails
 * right after a reload, the error is rethrown so the error page shows instead of
 * looping.
 */
export function lazyWithRetry<T = Record<string, never>>(
  importer: Importer<T>,
) {
  return lazy(async () => {
    try {
      const module = await importer();
      // A successful load means we're on a fresh build; clear the guard.
      globalThis.sessionStorage.removeItem(RELOAD_FLAG);
      return module;
    } catch (error) {
      const alreadyReloaded =
        globalThis.sessionStorage.getItem(RELOAD_FLAG) === "true";
      if (!alreadyReloaded) {
        globalThis.sessionStorage.setItem(RELOAD_FLAG, "true");
        globalThis.location.reload();
        // Suspend until the reload swaps the document.
        return pending<{ default: ComponentType<T> }>();
      }
      throw error;
    }
  });
}
