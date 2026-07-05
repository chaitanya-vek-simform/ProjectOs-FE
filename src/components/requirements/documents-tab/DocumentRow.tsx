import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge/status-badge";

import type {
  DocumentTileTone,
  RequirementDocument,
} from "@/types/requirements";

const TILE_TONE_CLASSES: Record<DocumentTileTone, string> = {
  red: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-600",
  slate: "bg-slate-100 text-slate-600",
};

interface DocumentRowProps {
  readonly document: RequirementDocument;
  readonly projectId?: string;
  readonly documentId?: string;
}

/** A single row in the uploaded-documents table. */
function DocumentRow({ document }: DocumentRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
              TILE_TONE_CLASSES[document.tileTone],
            )}
          >
            {document.tileLabel}
          </span>
          <p className="text-sm font-medium text-slate-800">
            {document.fileName}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-sm text-slate-600">{document.type}</TableCell>
      <TableCell className="text-sm text-slate-600">
        {document.uploadedAt}
      </TableCell>
      <TableCell>
        <StatusBadge tone={document.statusTone}>
          <span className="inline-flex items-center gap-1">
            {document.status === "processing" ? (
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            ) : null}
            {document.statusLabel}
          </span>
        </StatusBadge>
      </TableCell>
    </TableRow>
  );
}

export { DocumentRow };
