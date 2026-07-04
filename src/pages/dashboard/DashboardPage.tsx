import { Loader2 } from "lucide-react";

import { BurndownChart } from "@/components/dashboard/burndown-chart";
import { MilestoneTracker } from "@/components/dashboard/milestone-tracker";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCards } from "@/components/dashboard/stat-cards";
import { VelocityChart } from "@/components/dashboard/velocity-chart";
import { LABELS } from "@/constants/labels";
import { useProject } from "@/contexts/useProject";
import { useProjectDashboard } from "@/hooks/projects/queries";
import { getErrorMessage } from "@/lib/utils";

import { mapDashboardToStatCards } from "./mapDashboardToStatCards";

function DashboardStatsRow() {
  const { projectId } = useProject();
  const {
    data: dashboard,
    isLoading,
    isError,
    error,
  } = useProjectDashboard(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-10">
        <Loader2
          className="h-5 w-5 animate-spin text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-10">
        <p className="text-sm font-medium text-red-500">
          {getErrorMessage(error, LABELS.PROJECTS.LIST.LOAD_ERROR)}
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return <StatCards cards={mapDashboardToStatCards(dashboard)} />;
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardStatsRow />
      <div className="grid grid-cols-3 gap-4">
        <BurndownChart />
        <VelocityChart />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <RecentActivity />
        <MilestoneTracker />
      </div>
    </div>
  );
}

export default DashboardPage;
