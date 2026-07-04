import { LogOut, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn, getInitials } from "@/lib/utils";
import { LABELS } from "@/constants/labels";
import { NAV_ITEMS } from "@/constants/nav";

import { NavBadgeChip } from "./nav-badge-chip";
import { ProjectSwitcher } from "./project-switcher";

interface AppSidebarProps {
  onLogout: () => void;
}

/**
 * AppSidebar — slate-900 rail: logo, project selector, primary nav, user footer.
 * Mirrors the prototype's <aside>.
 */
function AppSidebar({ onLogout }: AppSidebarProps) {
  const nav = LABELS.NAV;
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            {nav.BRAND}
          </span>
        </div>
      </div>

      <div className="border-b border-slate-800 px-3 py-3">
        <ProjectSwitcher />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {item.badge ? <NavBadgeChip badge={item.badge} /> : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
            {getInitials(nav.USER_NAME)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {nav.USER_NAME}
            </p>
            <p className="truncate text-xs text-slate-500">{nav.USER_ROLE}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label={nav.LOGOUT}
            className="text-slate-500 hover:text-slate-300"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export { AppSidebar };
