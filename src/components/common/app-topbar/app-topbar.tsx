import { Bell } from "lucide-react";

import { LABELS } from "@/constants/labels";

interface AppTopbarProps {
  title: string;
  subtitle: string;
}

/** AppTopbar — page title + subtitle, notification bell, AI-ready pill. */
function AppTopbar({ title, subtitle }: AppTopbarProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={LABELS.NAV.NOTIFICATIONS}
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          {LABELS.NAV.AI_READY}
        </div>
      </div>
    </header>
  );
}

export { AppTopbar };
