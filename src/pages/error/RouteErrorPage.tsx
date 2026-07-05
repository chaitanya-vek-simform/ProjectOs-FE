import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/error-state/error-state";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";

const L = LABELS.ERROR;

/** Heuristic: does this error look like a stale lazy-chunk failure after a deploy? */
function isChunkLoadError(error: unknown): boolean {
  let message = "";
  if (error instanceof Error) message = error.message;
  else if (typeof error === "string") message = error;
  return (
    /dynamically imported module/i.test(message) ||
    /Loading chunk \d+ failed/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
}

/**
 * Root `errorElement` for the router. Renders a branded error page instead of
 * React Router's default screen. Stale-chunk failures (common after a Vercel
 * redeploy) get a dedicated "new version available" message with a reload.
 */
function RouteErrorPage() {
  const error = useRouteError();
  const reload = () => globalThis.location.reload();

  if (isChunkLoadError(error)) {
    return (
      <ErrorState
        icon={<RefreshCw className="size-7" aria-hidden="true" />}
        title={L.STALE.TITLE}
        body={L.STALE.BODY}
        actions={
          <Button onClick={reload}>
            <RefreshCw aria-hidden="true" />
            {L.STALE.RELOAD}
          </Button>
        }
      />
    );
  }

  return (
    <ErrorState
      icon={<AlertTriangle className="size-7" aria-hidden="true" />}
      title={L.GENERIC.TITLE}
      body={L.GENERIC.BODY}
      actions={
        <>
          <Button onClick={reload}>
            <RefreshCw aria-hidden="true" />
            {L.GENERIC.RETRY}
          </Button>
          <Button variant="outline" asChild>
            <Link to={ROUTES.DASHBOARD}>
              <Home aria-hidden="true" />
              {L.GENERIC.HOME}
            </Link>
          </Button>
        </>
      }
    />
  );
}

export default RouteErrorPage;
