import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

import type { RecommendedAction } from "@/types/risk";

const ACTIONS = LABELS.RISK.ACTIONS;

interface RecommendedActionsProps {
  actions: RecommendedAction[];
}

/** RecommendedActions — prioritised mitigation steps in tinted, bordered boxes. */
function RecommendedActions({ actions }: RecommendedActionsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        {ACTIONS.TITLE}
      </h3>
      {actions.length > 0 ? (
        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className={cn(
                "flex gap-3 rounded-lg border p-3",
                action.boxClassName,
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                  action.circleClassName,
                )}
              >
                {action.order}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {action.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{action.detail}</p>
                {(action.priorityLabel || action.ownerLabel) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-400">
                    {action.priorityLabel ? (
                      <span>{action.priorityLabel}</span>
                    ) : null}
                    {action.ownerLabel ? (
                      <span>
                        {ACTIONS.OWNER_PREFIX} {action.ownerLabel}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{ACTIONS.EMPTY}</p>
      )}
    </div>
  );
}

export { RecommendedActions };
