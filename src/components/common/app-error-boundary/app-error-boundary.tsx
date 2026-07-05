import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/error-state/error-state";
import { LABELS } from "@/constants/labels";

const L = LABELS.ERROR.GENERIC;

interface AppErrorBoundaryProps {
  readonly children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Top-level class boundary that catches render errors thrown *outside* the
 * router's reach (providers, RouterProvider itself). Route-level errors are
 * handled by the router's `errorElement`. Shows a branded fallback with a reload.
 */
class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <ErrorState
        className="min-h-screen"
        icon={<AlertTriangle className="size-7" aria-hidden="true" />}
        title={L.TITLE}
        body={L.BODY}
        actions={
          <Button onClick={() => globalThis.location.reload()}>
            <RefreshCw aria-hidden="true" />
            {L.RETRY}
          </Button>
        }
      />
    );
  }
}

export { AppErrorBoundary };
