/** All user-visible copy for the Resources module. */
export const RESOURCES_LABELS = {
  API: {
    SUGGEST_SUCCESS: "Team suggestion ready.",
    SUGGEST_ERROR: "Failed to generate team suggestion.",
  },
  STATE: {
    ERROR_TITLE: "Couldn't load resources",
    ERROR_BODY:
      "Something went wrong while loading team resources. Please try again.",
    EMPTY_TITLE: "No team members yet",
    EMPTY_BODY: "There are no resources allocated to this project yet.",
  },
  STATUS: {
    OVERLOADED: "Overloaded",
    NEAR_CAPACITY: "Near capacity",
    AVAILABLE: "Available",
    BLOCKED: "Blocked",
  },
  TEAM_MEMBERS: {
    TITLE: "Team Members",
    AI_SUGGEST: "AI Suggest Team →",
    COLUMN_NAME: "Name",
    COLUMN_ROLE: "Role",
    COLUMN_SKILLS: "Skills",
    COLUMN_RATE: "Rate/Day",
    COLUMN_UTILIZATION: "Utilization",
    COLUMN_STATUS: "Status",
  },
  HEATMAP: {
    TITLE: "Cross-Sprint Utilization Heatmap",
    LEGEND: "Green <80% · Amber 80–100% · Red >100%",
    COLUMN_MEMBER: "Team Member",
    WEEK_PREFIX: "Week",
    EMPTY_CELL: "–",
    LEAVE_CELL: "Leave",
  },
  SUGGEST: {
    TITLE: "AI Team Suggestion",
    DESCRIPTION: "Recommended team composition based on the project backlog.",
    STORY_POINTS: "Total story points",
    SPRINTS: "Estimated sprints",
    COUNT_NEEDED: "Needed",
    SUGGESTED_MEMBERS: "Suggested members",
    NO_MEMBERS: "No matching members found.",
    LOADING: "Generating suggestions…",
    EMPTY: "No recommendations available.",
    SELECTED: "selected",
    CREATE_TEAM: "Create Team",
    CREATE_SUCCESS: "Team created.",
  },
} as const;
