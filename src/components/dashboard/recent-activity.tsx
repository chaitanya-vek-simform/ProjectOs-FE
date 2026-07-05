import {
  AlertTriangle,
  CheckCircle2,
  type LucideIcon,
  Users,
  Video,
} from "lucide-react";

import { ACTIVITY_ITEMS } from "@/constants/dashboard/mock";
import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

import type { ActivityItem, ActivityTone } from "@/types/dashboard";

const ACTIVITY = LABELS.DASHBOARD.ACTIVITY;

const TONE_CONFIG: Record<
  ActivityTone,
  { icon: LucideIcon; className: string }
> = {
  red: { icon: AlertTriangle, className: "bg-red-100 text-red-600" },
  amber: { icon: Users, className: "bg-amber-100 text-amber-600" },
  indigo: { icon: Video, className: "bg-indigo-100 text-indigo-600" },
  emerald: { icon: CheckCircle2, className: "bg-emerald-100 text-emerald-600" },
};

function ActivityRow({ item }: { readonly item: ActivityItem }) {
  const { icon: Icon, className } = TONE_CONFIG[item.tone];
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          className,
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-700">
          {item.titleStrong ? (
            <span className="font-semibold text-slate-900">
              {item.titleStrong}
            </span>
          ) : null}
          {item.titleRest}
        </p>
        <p className="text-xs text-slate-400">{item.subtitle}</p>
      </div>
      <span className="shrink-0 text-xs text-slate-400">{item.timestamp}</span>
    </li>
  );
}

interface RecentActivityProps {
  readonly items?: typeof ACTIVITY_ITEMS;
}

function RecentActivity({
  items = ACTIVITY_ITEMS,
}: RecentActivityProps) {
  // Don't render if no data
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        {ACTIVITY.TITLE}
      </h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export { RecentActivity };
