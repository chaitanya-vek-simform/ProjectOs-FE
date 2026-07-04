import { HeatmapCell } from "@/components/resources/heatmap-cell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LABELS } from "@/constants/labels";
import { HEATMAP_WEEK_COUNT } from "@/constants/resources";

import type { HeatmapRow } from "@/types/resources";

const HEATMAP_LABELS = LABELS.RESOURCES.HEATMAP;

const WEEK_COLUMNS = Array.from(
  { length: HEATMAP_WEEK_COUNT },
  (_, index) => index + 1,
);

interface UtilizationHeatmapProps {
  rows: HeatmapRow[];
}

function UtilizationHeatmap({ rows }: UtilizationHeatmapProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {HEATMAP_LABELS.TITLE}
        </h2>
        <span className="text-xs text-slate-400">{HEATMAP_LABELS.LEGEND}</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{HEATMAP_LABELS.COLUMN_MEMBER}</TableHead>
            {WEEK_COLUMNS.map((week) => (
              <TableHead
                key={week}
              >{`${HEATMAP_LABELS.WEEK_PREFIX} ${week}`}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium text-slate-900">
                {row.member}
              </TableCell>
              {row.cells.map((cell, index) => (
                <TableCell key={`${row.id}-week-${index + 1}`}>
                  <HeatmapCell value={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { UtilizationHeatmap };
