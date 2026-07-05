import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  /** Zero-based index of the active step. */
  activeIndex: number;
}

/** Numbered horizontal step indicator for the document upload flow. */
function StepIndicator({ steps, activeIndex }: StepIndicatorProps) {
  return (
    <ol className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                isComplete && "bg-indigo-600 text-white",
                isActive && "bg-indigo-100 text-indigo-700",
                !isComplete && !isActive && "bg-slate-100 text-slate-400",
              )}
            >
              {isComplete ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={cn(
                "text-xs font-medium",
                isActive ? "text-slate-800" : "text-slate-400",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <span className="mx-1 h-px w-6 bg-slate-200" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export { StepIndicator };
