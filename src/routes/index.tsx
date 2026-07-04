import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { RequireAuth } from "@/components/common/require-auth/require-auth";
import { AppLayout } from "@/layouts/AppLayout";
import { ROUTES } from "@/constants/routes";

import { PageFallback } from "./page-fallback";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const ProjectsPage = lazy(() => import("@/pages/projects/ProjectsPage"));
const RequirementsPage = lazy(
  () => import("@/pages/requirements/RequirementsPage"),
);
const ProposalPage = lazy(() => import("@/pages/proposal/ProposalPage"));
const PlannerPage = lazy(() => import("@/pages/planner/PlannerPage"));
const MeetingsPage = lazy(() => import("@/pages/meetings/MeetingsPage"));
const RiskPage = lazy(() => import("@/pages/risk/RiskPage"));
const ResourcesPage = lazy(() => import("@/pages/resources/ResourcesPage"));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: withSuspense(<LoginPage />) },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          { path: ROUTES.DASHBOARD, element: withSuspense(<DashboardPage />) },
          { path: ROUTES.PROJECTS, element: withSuspense(<ProjectsPage />) },
          {
            path: ROUTES.REQUIREMENTS,
            element: withSuspense(<RequirementsPage />),
          },
          { path: ROUTES.PROPOSAL, element: withSuspense(<ProposalPage />) },
          { path: ROUTES.PLANNER, element: withSuspense(<PlannerPage />) },
          { path: ROUTES.MEETINGS, element: withSuspense(<MeetingsPage />) },
          { path: ROUTES.RISK, element: withSuspense(<RiskPage />) },
          { path: ROUTES.RESOURCES, element: withSuspense(<ResourcesPage />) },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to={ROUTES.DASHBOARD} replace /> },
]);
