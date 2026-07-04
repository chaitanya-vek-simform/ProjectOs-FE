import { LABELS } from "@/constants/labels";
import { useProject } from "@/contexts/useProject";
import { useRequirements, useStories } from "@/hooks/requirements/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTab } from "@/components/requirements/documents-tab/DocumentsTab";
import { RequirementsTab } from "@/components/requirements/requirements-tab/RequirementsTab";
import { UserStoriesTab } from "@/components/requirements/user-stories-tab/UserStoriesTab";

const L = LABELS.REQUIREMENTS.TABS;

const TAB_DOCUMENTS = "documents";
const TAB_REQUIREMENTS = "requirements";
const TAB_USER_STORIES = "user-stories";

/** Requirements page — Documents, Requirements and User Stories tabs. */
function RequirementsPage() {
  const { projectId } = useProject();
  const { data: requirements } = useRequirements(projectId);
  const { data: stories } = useStories(projectId);

  return (
    <div className="space-y-4">
      <Tabs defaultValue={TAB_DOCUMENTS} className="gap-4">
        <TabsList>
          <TabsTrigger value={TAB_DOCUMENTS}>{L.DOCUMENTS}</TabsTrigger>
          <TabsTrigger value={TAB_REQUIREMENTS} className="gap-2">
            {L.REQUIREMENTS}
            <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-600">
              {requirements?.length ?? 0}
            </span>
          </TabsTrigger>
          <TabsTrigger value={TAB_USER_STORIES} className="gap-2">
            {L.USER_STORIES}
            <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-600">
              {stories?.length ?? 0}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TAB_DOCUMENTS}>
          <DocumentsTab />
        </TabsContent>
        <TabsContent value={TAB_REQUIREMENTS}>
          <RequirementsTab />
        </TabsContent>
        <TabsContent value={TAB_USER_STORIES}>
          <UserStoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RequirementsPage;
