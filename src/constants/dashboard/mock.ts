import type {
  ActivityItem,
  BurndownPoint,
  Milestone,
  VelocityPoint,
} from "@/types/dashboard";

const BURNDOWN_LABELS = [
  "Jun 10",
  "Jun 12",
  "Jun 14",
  "Jun 16",
  "Jun 18",
  "Jun 20",
  "Jun 22",
  "Jun 24",
  "Jun 26",
  "Jun 28",
];
const IDEAL = [38, 34, 30, 26, 22, 18, 14, 10, 6, 0];
const ACTUAL: (number | null)[] = [38, 38, 36, 33, 28, 25, 22, 20, null, null];

export const BURNDOWN_DATA: BurndownPoint[] = BURNDOWN_LABELS.map(
  (label, index) => ({
    label,
    ideal: IDEAL[index],
    actual: ACTUAL[index],
  }),
);

export const VELOCITY_DATA: VelocityPoint[] = [
  { label: "S1", points: 42, color: "#6366f1" },
  { label: "S2", points: 34, color: "#f59e0b" },
  { label: "S3 (est)", points: 26, color: "#e2e8f0" },
];

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "route-optimization",
    tone: "red",
    titleStrong: "Route Optimization task",
    titleRest: " has been blocked for 52 hours",
    subtitle: "Risk increased by 14 points",
    timestamp: "2h ago",
  },
  {
    id: "sarah-chen",
    tone: "amber",
    titleStrong: "Sarah Chen",
    titleRest: " is 115% allocated this sprint",
    subtitle: "Overallocation alert triggered",
    timestamp: "5h ago",
  },
  {
    id: "sprint-kickoff",
    tone: "indigo",
    titleStrong: "",
    titleRest: "Sprint 3 Kickoff meeting processed",
    subtitle: "3 action items, 2 decisions extracted",
    timestamp: "1d ago",
  },
  {
    id: "driver-app-ui",
    tone: "emerald",
    titleStrong: "Driver App UI",
    titleRest: " moved to Done",
    subtitle: "8 story points completed",
    timestamp: "1d ago",
  },
];

export const MILESTONES: Milestone[] = [
  {
    id: "alpha-release",
    label: "Alpha Release",
    badge: { tone: "low", text: "Done" },
    progress: { value: 100, fillClassName: "bg-emerald-500" },
    date: "Jun 15, 2026",
  },
  {
    id: "beta-release",
    label: "Beta Release",
    badge: { tone: "high", text: "At Risk" },
    progress: { value: 58, fillClassName: "bg-orange-500" },
    date: "Jun 30, 2026",
  },
  {
    id: "production-launch",
    label: "Production Launch",
    badge: { tone: "medium", text: "On Track" },
    progress: { value: 35, fillClassName: "bg-amber-500" },
    date: "Jul 31, 2026",
  },
  {
    id: "phase-2-kickoff",
    label: "Phase 2 Kickoff",
    badge: { tone: "low", text: "Planned" },
    progress: { value: 0, fillClassName: "bg-slate-300" },
    date: "Aug 15, 2026",
  },
];
