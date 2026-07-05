import {
  Award,
  Check,
  Clock,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { LABELS } from "@/constants/labels";
import { cn, getInitials } from "@/lib/utils";

import type { SuggestedMember } from "@/types/resources";

const SUGGEST_LABELS = LABELS.RESOURCES.SUGGEST;

function matchTone(score: number) {
  if (score >= 90) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (score >= 75) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function MetaBadge({
  icon: Icon,
  children,
  tone = "text-slate-600",
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  tone?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", tone)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {children}
    </span>
  );
}

function StatusFlags({ member }: { member: SuggestedMember }) {
  const flags: Array<{ label: string; tone: string }> = [];
  if (member.on_leave) {
    flags.push({
      label: SUGGEST_LABELS.ON_LEAVE,
      tone: "bg-red-50 text-red-600 ring-red-200",
    });
  }
  if (member.in_notice_period) {
    flags.push({
      label: SUGGEST_LABELS.NOTICE_PERIOD,
      tone: "bg-amber-50 text-amber-600 ring-amber-200",
    });
  }
  if (member.is_contractor) {
    flags.push({
      label: SUGGEST_LABELS.CONTRACTOR,
      tone: "bg-indigo-50 text-indigo-600 ring-indigo-200",
    });
  }
  if (flags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((flag) => (
        <span
          key={flag.label}
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
            flag.tone,
          )}
        >
          {flag.label}
        </span>
      ))}
    </div>
  );
}

function MemberRatings({ member }: { member: SuggestedMember }) {
  if (!member.ratings) return null;
  const { overall, ai, communication } = member.ratings;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <MetaBadge icon={Star} tone="text-amber-600">
        {SUGGEST_LABELS.RATING_OVERALL} {overall.toFixed(1)}
      </MetaBadge>
      <MetaBadge icon={Sparkles} tone="text-indigo-600">
        {SUGGEST_LABELS.RATING_AI} {ai.toFixed(1)}
      </MetaBadge>
      <MetaBadge icon={MessageCircle} tone="text-sky-600">
        {SUGGEST_LABELS.RATING_COMMUNICATION} {communication.toFixed(1)}
      </MetaBadge>
    </div>
  );
}

function MemberAvatar({ member }: { readonly member: SuggestedMember }) {
  if (member.avatar_url) {
    return (
      <img
        src={member.avatar_url}
        alt=""
        className="size-12 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white"
      aria-hidden="true"
    >
      {getInitials(member.name)}
    </span>
  );
}

function MemberIdentity({ member }: { readonly member: SuggestedMember }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-900">
        {member.name}
      </p>
      {(member.designation || member.department) && (
        <p className="truncate text-xs text-slate-500">
          {[member.designation, member.department].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}

function MatchBadge({ score }: { readonly score?: number }) {
  if (typeof score !== "number") return null;
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        matchTone(score),
      )}
    >
      {score}% {SUGGEST_LABELS.MATCH}
    </span>
  );
}

function MemberMeta({ member }: { member: SuggestedMember }) {
  const hasMeta =
    typeof member.experience_years === "number" ||
    member.stack ||
    typeof member.availability_pct === "number";
  if (!hasMeta) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {typeof member.experience_years === "number" && (
        <MetaBadge icon={Award}>
          {member.experience_years} {SUGGEST_LABELS.EXPERIENCE_SUFFIX}
        </MetaBadge>
      )}
      {member.stack && (
        <span className="rounded bg-slate-900/5 px-1.5 py-0.5 text-xs font-medium text-slate-700">
          {member.stack}
        </span>
      )}
      {typeof member.availability_pct === "number" && (
        <MetaBadge
          icon={Clock}
          tone={
            member.availability_pct >= 50
              ? "text-emerald-600"
              : "text-amber-600"
          }
        >
          {member.availability_pct}% {SUGGEST_LABELS.AVAILABILITY}
        </MetaBadge>
      )}
    </div>
  );
}

function MemberSkills({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function SuggestMemberCard({
  member,
  checked,
  disabled,
  onToggle,
}: {
  readonly member: SuggestedMember;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
        checked
          ? "border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500"
          : "border-slate-200 hover:border-indigo-300 hover:shadow-sm",
        disabled && "cursor-not-allowed opacity-50 hover:border-slate-200",
      )}
    >
      <Checkbox
        checked={checked}
        className="pointer-events-none mt-1 shrink-0"
        tabIndex={-1}
        aria-hidden="true"
      />
      <MemberAvatar member={member} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <MemberIdentity member={member} />
          <MatchBadge score={member.match_score} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <MemberMeta member={member} />
          <StatusFlags member={member} />
        </div>
        <MemberSkills skills={member.skills} />
        {member.rationale && (
          <p className="flex items-start gap-1.5 rounded-lg bg-slate-50 p-2 text-xs leading-relaxed text-slate-600">
            <Check
              className="mt-0.5 size-3.5 shrink-0 text-emerald-500"
              aria-hidden="true"
            />
            <span className="min-w-0 break-words">{member.rationale}</span>
          </p>
        )}
        <MemberRatings member={member} />
      </div>
    </button>
  );
}

export { SuggestMemberCard };
