import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { AppSidebar } from "@/components/common/app-sidebar/app-sidebar";
import { AppTopbar } from "@/components/common/app-topbar/app-topbar";
import { useAuth } from "@/contexts/useAuth";
import { useProject } from "@/contexts/useProject";
import { LABELS } from "@/constants/labels";
import { NAV_ITEMS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";

/**
 * AppLayout — the authenticated application shell. Slate sidebar + topbar wrap a
 * routed <Outlet>. The topbar title is derived from the active nav item.
 */
function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { activeProject } = useProject();

  const active = NAV_ITEMS.find((item) =>
    location.pathname.startsWith(item.to),
  );
  const title = active?.title ?? LABELS.NAV.BRAND;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar onLogout={handleLogout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar title={title} subtitle={activeProject.subtitle} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { AppLayout };
