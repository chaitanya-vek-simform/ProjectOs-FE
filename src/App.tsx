import { RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";

import { router } from "./routes";

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
