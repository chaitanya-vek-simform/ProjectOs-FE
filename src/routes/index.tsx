import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { RequireAuth } from "@/components/common/require-auth/require-auth";
import { AppLayout } from "@/layouts/AppLayout";
import { ROUTES } from "@/constants/routes";
import { lazyWithRetry } from "@/lib/lazy-with-retry";

import { PageFallback } from "./page-fallback";

const LoginPage = lazyWithRetry(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazyWithRetry(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazyWithRetry(
  () => import("@/pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazyWithRetry(
  () => import("@/pages/auth/ResetPasswordPage"),
);
const DashboardPage = lazyWithRetry(
  () => import("@/pages/dashboard/DashboardPage"),
);
const ProjectsPage = lazyWithRetry(
  () => import("@/pages/projects/ProjectsPage"),
);
const RequirementsPage = lazyWithRetry(
  () => import("@/pages/requirements/RequirementsPage"),
);
const ProposalPage = lazyWithRetry(
  () => import("@/pages/proposal/ProposalPage"),
);
const PlannerPage = lazyWithRetry(() => import("@/pages/planner/PlannerPage"));
const MeetingsPage = lazyWithRetry(
  () => import("@/pages/meetings/MeetingsPage"),
);
const RiskPage = lazyWithRetry(() => import("@/pages/risk/RiskPage"));
const ResourcesPage = lazyWithRetry(
  () => import("@/pages/resources/ResourcesPage"),
);
const RouteErrorPage = lazyWithRetry(
  () => import("@/pages/error/RouteErrorPage"),
);
const NotFoundPage = lazyWithRetry(() => import("@/pages/error/NotFoundPage"));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>;
}

/** Branded fallback rendered whenever a route element/loader throws. */
const errorElement = withSuspense(<RouteErrorPage />);

export const router = createBrowserRouter([
  {
    errorElement,
    children: [
      { path: ROUTES.LOGIN, element: withSuspense(<LoginPage />) },
      { path: ROUTES.REGISTER, element: withSuspense(<RegisterPage />) },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: withSuspense(<ForgotPasswordPage />),
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: withSuspense(<ResetPasswordPage />),
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.DASHBOARD} replace />,
              },
              {
                path: ROUTES.DASHBOARD,
                element: withSuspense(<DashboardPage />),
              },
              {
                path: ROUTES.PROJECTS,
                element: withSuspense(<ProjectsPage />),
              },
              {
                path: ROUTES.REQUIREMENTS,
                element: withSuspense(<RequirementsPage />),
              },
              {
                path: ROUTES.PROPOSAL,
                element: withSuspense(<ProposalPage />),
              },
              { path: ROUTES.PLANNER, element: withSuspense(<PlannerPage />) },
              {
                path: ROUTES.MEETINGS,
                element: withSuspense(<MeetingsPage />),
              },
              { path: ROUTES.RISK, element: withSuspense(<RiskPage />) },
              {
                path: ROUTES.RESOURCES,
                element: withSuspense(<ResourcesPage />),
              },
              { path: "*", element: withSuspense(<NotFoundPage />) },
            ],
          },
        ],
      },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
]);
