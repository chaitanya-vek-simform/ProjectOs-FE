import { RouterProvider } from "react-router-dom";

import { AppErrorBoundary } from "@/components/common/app-error-boundary/app-error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";

import { router } from "./routes";

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <ProjectProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ProjectProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;
