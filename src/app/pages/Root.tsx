import { Outlet, useLocation } from "react-router";
import { Navigation } from "../components/Navigation";
import { GlobalStatusBar } from "../components/GlobalStatusBar";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/overview": "Dashboard",
  "/heatmap": "Heatmap",
  "/robot": "Robot",
  "/thresholds": "Thresholds",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Root() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Ramis";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-medium">R</span>
            </div>
            <h1 className="text-base text-gray-900">
              {pageTitle === "Home" ? "Ramis" : pageTitle}
            </h1>
          </div>
          <GlobalStatusBar compact />
        </div>
      </header>

      <Navigation />
      <main className="pt-[58px] pb-20 md:pt-0 md:pb-0 md:pl-56">
        <Outlet />
      </main>
    </div>
  );
}