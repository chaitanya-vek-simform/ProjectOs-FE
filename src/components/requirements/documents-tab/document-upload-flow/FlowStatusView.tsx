import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FlowStatusVariant = "loading" | "done" | "error";

interface FlowStatusAction {
  label: string;
  onClick: () => void;
}

interface FlowStatusViewProps {
  variant: FlowStatusVariant;
  title: string;
  description: string;
  action?: FlowStatusAction;
}

const ICON_WRAPPER: Record<FlowStatusVariant, string> = {
  loading: "bg-indigo-100 text-indigo-600",
  done: "bg-emerald-100 text-emerald-600",
  error: "bg-red-100 text-red-600",
};

/** Centered icon + copy used for the non-interactive flow steps. */
function FlowStatusView({
  variant,
  title,
  description,
  action,
}: FlowStatusViewProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-full",
          ICON_WRAPPER[variant],
        )}
      >
        {variant === "loading" && (
          <Loader2 className="size-7 animate-spin" aria-hidden="true" />
        )}
        {variant === "done" && (
          <CheckCircle2 className="size-7" aria-hidden="true" />
        )}
        {variant === "error" && (
          <TriangleAlert className="size-7" aria-hidden="true" />
        )}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="max-w-sm text-xs text-slate-500">{description}</p>
      </div>
      {action && (
        <Button type="button" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { FlowStatusView };
