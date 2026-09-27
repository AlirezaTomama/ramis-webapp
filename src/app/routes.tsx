import { createHashRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Overview } from "./pages/Overview";
import { Heatmap } from "./pages/Heatmap";
import { Robot } from "./pages/Robot";
import { Thresholds } from "./pages/Thresholds";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "overview", Component: Overview },
      { path: "heatmap", Component: Heatmap },
      { path: "robot", Component: Robot },
      { path: "thresholds", Component: Thresholds },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);
