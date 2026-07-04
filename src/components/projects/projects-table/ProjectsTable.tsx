import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LABELS } from "@/constants/labels";
import { formatDate } from "@/lib/utils";

import { getProjectStatusTone } from "./projectStatusTone";

import type { Project } from "@/types/projects";

const TABLE_LABELS = LABELS.PROJECTS.TABLE;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ProjectRow({
  project,
  onEdit,
}: {
  project: Project;
  onEdit: (project: Project) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium text-slate-900">
        {project.name}
      </TableCell>
      <TableCell>
        <StatusBadge tone={getProjectStatusTone(project.status)}>
          {project.status}
        </StatusBadge>
      </TableCell>
      <TableCell className="text-slate-600">
        {project.client_name ?? "—"}
      </TableCell>
      <TableCell className="text-slate-600">
        {formatDate(project.start_date) ?? "—"}
      </TableCell>
      <TableCell className="text-slate-600">
        {formatDate(project.target_end_date) ?? "—"}
      </TableCell>
      <TableCell className="text-slate-600">
        {project.budget_usd !== null
          ? currencyFormatter.format(project.budget_usd)
          : "—"}
      </TableCell>
      <TableCell className="text-slate-600">
        {formatDate(project.created_at) ?? "—"}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          aria-label={TABLE_LABELS.EDIT_ACTION_LABEL}
          onClick={() => onEdit(project)}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function ProjectsTable({
  projects,
  onEdit,
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{TABLE_LABELS.COLUMN_NAME}</TableHead>
          <TableHead>{TABLE_LABELS.COLUMN_STATUS}</TableHead>
          <TableHead>{TABLE_LABELS.COLUMN_CLIENT}</TableHead>
          <TableHead>{TABLE_LABELS.COLUMN_START_DATE}</TableHead>
          <TableHead>{TABLE_LABELS.COLUMN_TARGET_END_DATE}</TableHead>
          <TableHead>{TABLE_LABELS.COLUMN_BUDGET}</TableHead>
          <TableHead>{TABLE_LABELS.COLUMN_CREATED_AT}</TableHead>
          <TableHead>{TABLE_LABELS.COLUMN_ACTIONS}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} onEdit={onEdit} />
        ))}
      </TableBody>
    </Table>
  );
}

export { ProjectsTable };
