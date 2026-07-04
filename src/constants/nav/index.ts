import {
  AlertTriangle,
  FileStack,
  FileText,
  FolderKanban,
  LayoutDashboard,
  type LucideIcon,
  ScrollText,
  Users,
  Video,
} from "lucide-react";

import { NAV_LABELS } from "@/constants/nav/labels";
import { ROUTES } from "@/constants/routes";

import type { StatusTone } from "@/types/common";

export interface NavBadge {
  label: string;
  tone: StatusTone | "primary";
}

export interface NavItemConfig {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Page title shown in the topbar. */
  title: string;
  /** Optional count/status chip on the right of the nav item. */
  badge?: NavBadge;
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    to: ROUTES.DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    to: ROUTES.PROJECTS,
    label: "Projects",
    icon: FolderKanban,
    title: "Projects",
  },
  {
    to: ROUTES.REQUIREMENTS,
    label: "Requirements",
    icon: FileText,
    title: "Requirement Intelligence",
    badge: { label: "", tone: "primary" },
  },
  {
    to: ROUTES.PROPOSAL,
    label: "Proposal",
    icon: FileStack,
    title: "Proposal & Estimation",
    badge: { label: "", tone: "low" },
  },
  {
    to: ROUTES.PLANNER,
    label: "Planner",
    icon: ScrollText,
    title: "AI Project Planner",
  },
  {
    to: ROUTES.MEETINGS,
    label: "Meetings",
    icon: Video,
    title: "Meeting Intelligence",
    badge: { label: "", tone: "medium" },
  },
  {
    to: ROUTES.RISK,
    label: "Risk",
    icon: AlertTriangle,
    title: "Risk Prediction",
    badge: { label: "", tone: "critical" },
  },
  {
    to: ROUTES.RESOURCES,
    label: "Resources",
    icon: Users,
    title: "Resource Allocation",
  },
];

export interface ProjectOption {
  id: string;
  /** Display name shown in the sidebar switcher. */
  name: string;
  /** Subtitle rendered in the topbar while this project is active. */
  subtitle: string;
}

/**
 * Selectable projects for the sidebar project switcher. The first entry is the
 * default and reuses the shared NAV copy; the rest are additional demo projects.
 */
export const PROJECTS: ProjectOption[] = [
  {
    id: "techflow-logistics",
    name: NAV_LABELS.PROJECT_NAME,
    subtitle: NAV_LABELS.SUBTITLE,
  },
  {
    id: "northwind-retail",
    name: "Northwind Retail",
    subtitle: "Northwind Omnichannel Commerce · Sprint 5 Active",
  },
  {
    id: "apex-health-cloud",
    name: "Apex Health Cloud",
    subtitle: "Apex Patient Platform · Discovery Phase",
  },
];
