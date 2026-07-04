import { Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { LABELS } from "@/constants/labels";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge/status-badge";

import type { StatusTone } from "@/types/common";

interface RequirementRowProps {
  code: string;
  title: string;
  subtitle?: string;
  priorityTone: StatusTone;
  priorityLabel: string;
  chipClassName: string;
  onEdit: () => void;
}

/** A single requirement line — code chip, title/subtitle, priority badge, edit action. */
function RequirementRow({
  code,
  title,
  subtitle,
  priorityTone,
  priorityLabel,
  chipClassName,
  onEdit,
}: RequirementRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn("rounded px-2 py-0.5 text-xs font-bold", chipClassName)}
        >
          {code}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <StatusBadge tone={priorityTone}>{priorityLabel}</StatusBadge>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={LABELS.REQUIREMENTS.REQUIREMENTS.EDIT_ARIA}
          onClick={onEdit}
        >
          <Pencil className="size-4 text-slate-400" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export { RequirementRow };
