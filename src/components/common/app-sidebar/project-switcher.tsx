import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProject } from "@/contexts/useProject";
import { cn } from "@/lib/utils";
import { LABELS } from "@/constants/labels";

/**
 * ProjectSwitcher — sidebar dropdown that lists selectable projects and sets the
 * active one via ProjectContext. Replaces the previously static "Current Project"
 * block, which looked clickable but had no menu.
 */
function ProjectSwitcher() {
  const { projects, activeProject, setActiveProjectId } = useProject();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full cursor-pointer rounded-lg bg-slate-800 px-3 py-2 text-left transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <p className="mb-0.5 text-xs text-slate-400">
            {LABELS.NAV.CURRENT_PROJECT}
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-white">
              {activeProject.name}
            </p>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width)"
      >
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onSelect={() => setActiveProjectId(project.id)}
            className="flex items-center justify-between gap-2"
          >
            <span className="truncate">{project.name}</span>
            <Check
              className={cn(
                "h-4 w-4 shrink-0",
                project.id === activeProject.id ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ProjectSwitcher };
