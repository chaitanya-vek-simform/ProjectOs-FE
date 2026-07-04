import { Loader2, Sparkles } from "lucide-react";

import { ProgressBar } from "@/components/common/progress-bar/progress-bar";
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
import { cn, getInitials } from "@/lib/utils";

import type { TeamMember } from "@/types/resources";

const TEAM_LABELS = LABELS.RESOURCES.TEAM_MEMBERS;

interface TeamMembersTableProps {
  members: TeamMember[];
  onSuggest: () => void;
  isSuggesting: boolean;
  canSuggest: boolean;
}

function MemberRow({ member }: { member: TeamMember }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white",
              member.avatarTone,
            )}
            aria-hidden="true"
          >
            {getInitials(member.name).charAt(0)}
          </span>
          <span className="font-medium text-slate-900">{member.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-slate-600">{member.role}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {member.skills.map((skill) => (
            <span
              key={skill}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-slate-600">{member.ratePerDay}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ProgressBar
            value={member.utilizationValue}
            fillClassName={member.utilizationFill}
            className="w-24"
          />
          <span
            className={cn("text-xs font-bold", member.utilizationLabelClass)}
          >
            {member.utilizationLabel}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge tone={member.status.tone}>
          {member.status.label}
        </StatusBadge>
      </TableCell>
    </TableRow>
  );
}

function TeamMembersTable({
  members,
  onSuggest,
  isSuggesting,
  canSuggest,
}: TeamMembersTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {TEAM_LABELS.TITLE}
        </h2>
        <Button
          type="button"
          onClick={onSuggest}
          disabled={isSuggesting || !canSuggest}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isSuggesting ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles aria-hidden="true" />
          )}
          {TEAM_LABELS.AI_SUGGEST}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{TEAM_LABELS.COLUMN_NAME}</TableHead>
            <TableHead>{TEAM_LABELS.COLUMN_ROLE}</TableHead>
            <TableHead>{TEAM_LABELS.COLUMN_SKILLS}</TableHead>
            <TableHead>{TEAM_LABELS.COLUMN_RATE}</TableHead>
            <TableHead>{TEAM_LABELS.COLUMN_UTILIZATION}</TableHead>
            <TableHead>{TEAM_LABELS.COLUMN_STATUS}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { TeamMembersTable };
