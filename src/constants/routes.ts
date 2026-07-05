/**
 * Client-side route paths. Never hardcode a path in a component — reference
 * ROUTES.* so the single source of truth lives here.
 */
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  REQUIREMENTS: "/requirements",
  PROPOSAL: "/proposal",
  PLANNER: "/planner",
  MEETINGS: "/meetings",
  RISK: "/risk",
  RESOURCES: "/resources",
  NOT_FOUND: "/404",
} as const;
