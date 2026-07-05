import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ErrorStateProps {
  readonly icon: ReactNode;
  /** Optional large accent code (e.g. "404"). */
  readonly code?: string;
  readonly title: string;
  readonly body: string;
  /** Action buttons rendered below the copy. */
  readonly actions: ReactNode;
  readonly className?: string;
}

/**
 * Centered, branded error surface shared by the route error page and the
 * not-found page. Purely presentational — callers supply icon, copy and actions.
 */
function ErrorState({
  icon,
  code,
  title,
  body,
  actions,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] w-full flex-col items-center justify-center px-6 text-center",
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      {code ? (
        <p className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
          {code}
        </p>
      ) : null}
      <h1 className="mt-3 text-lg font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">{body}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actions}
      </div>
    </div>
  );
}

export { ErrorState };
