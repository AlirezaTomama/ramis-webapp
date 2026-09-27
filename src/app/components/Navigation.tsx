import { Link, useLocation } from "react-router";
import { Home, Map, Target, Bot, FileText, Gauge, Lock, Settings } from "lucide-react";
import { cn } from "./ui/utils";
import { GlobalStatusBar } from "./GlobalStatusBar";

const navItems = [
  { path: "/",           label: "Home",       icon: Home },
  { path: "/overview",   label: "Dashboard",  icon: Target },
  { path: "/heatmap",    label: "Heatmap",    icon: Map },
  { path: "/robot",      label: "Robot",      icon: Bot },
  { path: "/thresholds", label: "Thresholds", icon: Gauge },
  { path: "/reports",    label: "Reports",    icon: FileText },
];

const proFeatures = [
  "14-day forecast",
  "PDF export",
  "Multi-farm view",
  "Advisor share",
];

export function Navigation() {
  const location = useLocation();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-6 gap-0 px-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-colors",
                  isActive ? "text-green-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[9px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:bottom-0 md:w-56 bg-white border-r border-gray-100 z-40 shadow-sm">

        {/* Logo */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center shadow-sm">
              <Target className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-base text-gray-900">Ramis</h1>
          </div>
          <p className="text-[9px] text-gray-400 leading-tight pl-8">Pest Intelligence · BC Farms</p>
        </div>

        {/* Status bar */}
        <div className="flex-shrink-0">
          <GlobalStatusBar />
        </div>

        {/* Nav items — no overflow, everything fits */}
        <nav className="flex-1 px-2.5 py-1 space-y-px">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-2.5 py-2 rounded-lg transition-all text-[13px]",
                  isActive
                    ? "bg-green-50 text-green-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5 mr-2.5 flex-shrink-0", isActive ? "text-green-600" : "text-gray-400")} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Settings + Pro — compact, no scroll needed */}
        <div className="px-2.5 pb-3 border-t border-gray-100 flex-shrink-0 space-y-1 pt-2">
          {/* Settings */}
          <Link
            to="/settings"
            className={cn(
              "flex items-center px-2.5 py-2 rounded-lg transition-all text-[13px]",
              location.pathname === "/settings"
                ? "bg-green-50 text-green-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Settings className="w-3.5 h-3.5 mr-2.5 text-gray-400" />
            <span>Settings</span>
          </Link>

          {/* Pro upsell — compact 2-col feature list */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2.5 border border-green-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lock className="w-3 h-3 text-green-700" />
              <p className="text-[10px] text-green-800">Standard Plan</p>
            </div>
            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 mb-2">
              {proFeatures.map((f) => (
                <div key={f} className="flex items-center gap-1">
                  <Lock className="w-2 h-2 text-gray-400 flex-shrink-0" />
                  <span className="text-[9px] text-gray-500 truncate">{f}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white text-[11px] py-1.5 rounded-md transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
