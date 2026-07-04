export const RISK_LABELS = {
  API: {
    COMPUTE_STARTED: "Risk computation started…",
    COMPUTE_SUCCESS: "Risk score recomputed.",
    COMPUTE_ERROR: "Failed to compute risk.",
  },
  GAUGE: {
    CAPTION: "Current Risk Score",
    SUFFIX: "/100",
    COMPUTED_PREFIX: "Computed",
  },
  LEVEL: {
    LOW: "LOW RISK",
    MEDIUM: "MEDIUM RISK",
    HIGH: "HIGH RISK",
    CRITICAL: "CRITICAL RISK",
  },
  FACTORS: {
    TITLE: "Risk Factor Breakdown",
    RECOMPUTE: "Recompute Now",
    RECOMPUTING: "Recomputing…",
    TOTAL_LABEL: "Total",
    OVERALLOCATION: "Overallocation",
    VELOCITY_DROP: "Velocity Drop",
    BLOCKED_TASKS: "Blocked Tasks",
    MILESTONE_DRIFT: "Milestone Drift",
    SCOPE_CREEP: "Scope Creep",
    MEETING_RISK: "Meeting Risk",
  },
  ANALYSIS: {
    TITLE: "AI Risk Analysis",
    EMPTY: "No AI analysis available for the latest computation.",
  },
  ACTIONS: {
    TITLE: "Recommended Actions",
    EMPTY: "No recommended actions right now.",
    OWNER_PREFIX: "Owner:",
    PRIORITY: {
      IMMEDIATE: "Immediate",
      THIS_SPRINT: "This Sprint",
      THIS_WEEK: "This Week",
    },
    OWNER: {
      PROJECT_MANAGER: "Project Manager",
      PRODUCT_OWNER: "Product Owner",
      TECH_LEAD: "Tech Lead",
      SCRUM_MASTER: "Scrum Master",
    },
  },
  HISTORY: {
    TITLE: "Risk History",
    SUBTITLE: "Score trend over time",
    EMPTY: "Not enough history to plot a trend yet.",
    AVERAGE_PREFIX: "Avg",
    TREND: {
      IMPROVING: "Improving",
      STABLE: "Stable",
      WORSENING: "Worsening",
    },
  },
  STATE: {
    LOADING: "Loading risk analysis…",
    ERROR: "Failed to load risk analysis.",
    EMPTY_TITLE: "No risk score yet",
    EMPTY_BODY: "Run a computation to generate the first risk snapshot.",
    COMPUTE_CTA: "Compute Risk",
  },
  DYNAMIC: {
    SCORE: (score: number, max: number) => `${score}/${max}`,
  },
} as const;
