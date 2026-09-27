import { Link, useNavigate } from "react-router";
import { useState, useRef, useCallback } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  AlertTriangle, DollarSign, Bot, Map, TrendingDown, TrendingUp,
  Leaf, ShieldCheck, Clock, ChevronRight, Sparkles, CheckCircle,
  Battery, Wifi, MapPin, FileText, Radio, Play, Camera, Activity,
  Zap, BarChart2, Eye, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  buildGrid, buildCellMap, findCellAt, toSvgPoint,
  cellFill, riskLabel, riskColor, actionLabel,
  type GridCell,
} from "../utils/farmGrid";

// ── Home preview grid (700×188 viewBox) ───────────────────────────────────────
const HP_CELL = 11;
const HP_FIELDS = [
  { id: "a", xMin: 8,   yMin: 4, xMax: 328, yMax: 152 },
  { id: "b", xMin: 348, yMin: 3, xMax: 692, yMax: 152 },
];
const HP_SOURCES = [
  { cx: 248, cy: 42,  peakPct: 128, sigma: 36 },
  { cx: 276, cy: 62,  peakPct: 82,  sigma: 26 },
  { cx: 88,  cy: 44,  peakPct: 52,  sigma: 34 },
  { cx: 88,  cy: 115, peakPct: 22,  sigma: 30 },
  { cx: 490, cy: 46,  peakPct: 42,  sigma: 40 },
  { cx: 560, cy: 62,  peakPct: 28,  sigma: 28 },
  { cx: 420, cy: 114, peakPct: 20,  sigma: 30 },
];

function hpZoneAt(cx: number, cy: number) {
  if (cx >= 8   && cx < 168 && cy >= 4   && cy < 78)  return { id: "a-z1", label: "Field A – Zone 1", pest: "Codling Moth", threshold: 15, trend: "stable" as const, fieldId: "a" };
  if (cx >= 168 && cx < 328 && cy >= 4   && cy < 78)  return { id: "a-z3", label: "Field A – Zone 3", pest: "Codling Moth", threshold: 15, trend: "up"     as const, fieldId: "a" };
  if (cx >= 8   && cx < 168 && cy >= 78  && cy < 152) return { id: "a-z2", label: "Field A – Zone 2", pest: "Apple Aphid",  threshold: 25, trend: "down"   as const, fieldId: "a" };
  if (cx >= 168 && cx < 328 && cy >= 78  && cy < 152) return { id: "a-z4", label: "Field A – Zone 4", pest: "Leafroller",   threshold: 12, trend: "stable" as const, fieldId: "a" };
  if (cx >= 348 && cx < 692 && cy >= 3   && cy < 78)  return { id: "b-z2", label: "Field B – Zone 2", pest: "Leafroller",   threshold: 12, trend: "stable" as const, fieldId: "b" };
  if (cx >= 348 && cx < 520 && cy >= 78  && cy < 152) return { id: "b-z1", label: "Field B – Zone 1", pest: "Codling Moth", threshold: 15, trend: "down"   as const, fieldId: "b" };
  if (cx >= 520 && cx < 692 && cy >= 78  && cy < 152) return { id: "b-z3", label: "Field B – Zone 3", pest: "SWD",          threshold: 10, trend: "stable" as const, fieldId: "b" };
  return null;
}

const HP_CELLS: GridCell[] = buildGrid(HP_FIELDS, HP_SOURCES, hpZoneAt, HP_CELL, 12);
const HP_MAP = buildCellMap(HP_CELLS);

// ── Inline sparkline ─────────────────────────────────────────────────────────
function Sparkline({ data, color, width = 56, height = 18 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 2) + 1;
    const y = height - 4 - ((v - min) / range) * (height - 8) + 1;
    return `${x},${y}`;
  }).join(" ");
  const fillPts = `1,${height - 2} ${pts} ${width - 1},${height - 2}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={fillPts} fill={color} fillOpacity="0.08" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Mini bar chart for nav preview ───────────────────────────────────────────
function MiniBarChart({ bars, color }: { bars: number[]; color: string }) {
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm opacity-70" style={{ height: `${(v / max) * 100}%`, backgroundColor: color }} />
      ))}
    </div>
  );
}

// ── Mini heatmap grid preview ─────────────────────────────────────────────────
function MiniHeatGrid() {
  const cells = [
    ["#22c55e","#22c55e","#eab308","#f97316"],
    ["#22c55e","#eab308","#dc2626","#f97316"],
    ["#22c55e","#22c55e","#f97316","#eab308"],
    ["#22c55e","#22c55e","#22c55e","#22c55e"],
  ];
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
      {cells.flat().map((c, i) => (
        <div key={i} className="rounded-sm" style={{ width: 10, height: 10, backgroundColor: c, opacity: 0.85 }} />
      ))}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const quickStats = [
  {
    label: "High-Risk Zones", value: "1", sub: "Zone A·Z3 · 128% IPM",
    icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", ring: "ring-orange-100",
    trend: "+1 vs last week", trendUp: true, trendColor: "text-orange-500",
    sparkData: [2, 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 4],
    sparkColor: "#f97316",
    extra: "Field A – Zone 3 primary", extraColor: "text-orange-500",
    to: "/heatmap", toLabel: "View Heatmap",
  },
  {
    label: "Saved This Season", value: "$4,200", sub: "3 spray events avoided",
    icon: DollarSign, color: "text-green-600", bg: "bg-green-50", ring: "ring-green-100",
    trend: "68% chemical reduction", trendUp: false, trendColor: "text-green-600",
    sparkData: [400, 800, 1200, 1600, 2100, 2600, 3100, 3600, 4200],
    sparkColor: "#22c55e",
    extra: "↑ $820 vs Wk 26", extraColor: "text-green-600",
    to: "/overview", toLabel: "ROI Dashboard",
  },
  {
    label: "Estimated Yield Risk", value: "2.3%", sub: "Well within safe range",
    icon: Leaf, color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-100",
    trend: "Low risk · Week 27", trendUp: false, trendColor: "text-blue-500",
    sparkData: [4.1, 3.8, 3.2, 2.9, 2.7, 2.5, 2.4, 2.3, 2.3],
    sparkColor: "#3b82f6",
    extra: "↓ 0.4% vs last week", extraColor: "text-blue-500",
    to: "/thresholds", toLabel: "View Thresholds",
  },
  {
    label: "Time to Impact", value: "4–6d", sub: "Leafroller approaching",
    icon: Clock, color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-100",
    trend: "High confidence", trendUp: true, trendColor: "text-amber-600",
    sparkData: [9, 8, 8, 7, 7, 6, 5, 5, 4],
    sparkColor: "#f59e0b",
    extra: "Zone A·Z4 · 108% IPM", extraColor: "text-amber-600",
    to: "/thresholds", toLabel: "IPM Planner",
  },
  {
    label: "Coverage This Week", value: "86%", sub: "Last scan: 2h ago",
    icon: Radio, color: "text-violet-600", bg: "bg-violet-50", ring: "ring-violet-100",
    trend: "High confidence", trendUp: false, trendColor: "text-violet-500",
    sparkData: [70, 74, 76, 79, 81, 83, 84, 85, 86],
    sparkColor: "#8b5cf6",
    extra: "+6% vs last week", extraColor: "text-violet-500",
    to: "/robot", toLabel: "Robot Status",
  },
];

const pests = [
  { name: "Codling Moth",  count: 11, threshold: 15, pct: 73,  status: "Under control",        statusColor: "text-green-600",  barColor: "#22c55e", trend: -15, sparkData: [14,13,13,12,11,11], borderColor: "border-gray-100" },
  { name: "Leafroller",    count: 13, threshold: 12, pct: 108, status: "Approaching threshold", statusColor: "text-yellow-600", barColor: "#eab308", trend: +8,  sparkData: [9, 10,11,12,12,13], borderColor: "border-yellow-100" },
  { name: "Apple Aphid",   count: 8,  threshold: 25, pct: 32,  status: "Under control",        statusColor: "text-green-600",  barColor: "#3b82f6", trend: -5,  sparkData: [11,10, 9, 9, 8, 8], borderColor: "border-gray-100" },
  { name: "SWD",           count: 4,  threshold: 10, pct: 40,  status: "Under control",        statusColor: "text-green-600",  barColor: "#22c55e", trend: 0,   sparkData: [4, 4, 4, 4, 4, 4],  borderColor: "border-gray-100" },
];

export function Home() {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{ cell: GridCell; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const onMapMove = useCallback((e: React.MouseEvent) => {
    const pt = toSvgPoint(e, svgRef.current, 700, 188);
    if (!pt) return;
    const cell = findCellAt(pt.svgX, pt.svgY, HP_FIELDS, HP_MAP, HP_CELL);
    setTooltip(cell ? { cell, x: e.clientX, y: e.clientY } : null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div className="bg-green-100 rounded-lg p-2 mt-0.5 shadow-sm flex-shrink-0">
                <Sparkles className="w-4 h-4 text-green-700" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-px rounded-full inline-block mb-1.5">
                  Sunridge Farm · Week 27 · Jul 1–7, 2026
                </p>
                <h1 className="text-lg md:text-xl text-gray-900 leading-snug">
                  Not insects — impact.{" "}
                  <span className="text-green-600">We tell you when and where pests will hurt your yield.</span>
                </h1>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                  Decision-first pest intelligence for BC farmers · actionable, not raw.
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {[
                { label: "Robot",     value: "Online", icon: Wifi,    color: "text-green-600",  bg: "bg-green-50 border-green-100" },
                { label: "Battery",   value: "78%",    icon: Battery, color: "text-green-600",  bg: "bg-green-50 border-green-100" },
                { label: "Coverage",  value: "86%",    icon: Radio,   color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
                { label: "Last scan", value: "2h ago", icon: Clock,   color: "text-gray-500",   bg: "bg-gray-50 border-gray-100" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg border ${s.bg} gap-0.5`}>
                    <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                    <span className={`text-[11px] leading-none ${s.color}`}>{s.value}</span>
                    <span className="text-[9px] text-gray-400 leading-none">{s.label}</span>
                  </div>
                );
              })}
              <div className="ml-1 flex items-center gap-1 bg-green-600 text-white rounded-lg px-3 py-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <div>
                  <p className="text-[10px] leading-none opacity-80">Recommendation</p>
                  <p className="text-[11px] leading-tight">Monitor Only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 space-y-2.5">

        {/* ── Decision Banner ── */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-start gap-2.5 flex-wrap">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-green-900 leading-tight">
                  <strong>Monitor Only</strong>
                  {" — "}Activity below seasonal baseline for Wk 27. Pest counts under IPM threshold across all zones.
                </span>
                <span className="text-[9px] text-green-700 bg-green-100 border border-green-200 px-1.5 py-px rounded-full">Next review: 5–7 days</span>
                <span className="text-[9px] text-gray-500 bg-white border border-gray-200 px-1.5 py-px rounded-full">Why: Activity 18% below Wk 27 avg</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[9px] text-gray-400">Next action: Routine trap check Jul 8 · No sprays required</span>
              </div>
            </div>
            <Link to="/thresholds" className="flex-shrink-0">
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-2 border-green-300 text-green-700 hover:bg-green-100">
                IPM Details
              </Button>
            </Link>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {quickStats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className={`px-3 py-2.5 cursor-pointer hover:shadow-md transition-all group ring-1 ring-inset ${s.ring}`}
                onClick={() => navigate(s.to)}>
                <div className="flex items-start justify-between mb-1">
                  <div className={`inline-flex p-1.5 rounded-md ${s.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                  </div>
                  <Sparkline data={s.sparkData} color={s.sparkColor} />
                </div>
                <p className="text-xl text-gray-900 leading-none">{s.value}</p>
                <p className="text-[10px] text-gray-600 mt-0.5 leading-tight">{s.label}</p>
                <p className="text-[9px] text-gray-400 leading-tight mt-px">{s.sub}</p>
                <div className="mt-1 flex items-center gap-1">
                  {s.trendUp
                    ? <ArrowUpRight className={`w-2.5 h-2.5 ${s.trendColor} flex-shrink-0`} />
                    : <ArrowDownRight className={`w-2.5 h-2.5 ${s.trendColor} flex-shrink-0`} />}
                  <p className={`text-[9px] leading-tight ${s.trendColor}`}>{s.extra}</p>
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 group-hover:text-green-600 transition-colors leading-none">{s.toLabel}</span>
                  <ChevronRight className="w-2.5 h-2.5 text-gray-300 group-hover:text-green-500 transition-colors" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* ── Navigation Tiles ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

          {/* Full Dashboard */}
          <Link to="/overview">
            <Card className="px-3 py-2.5 hover:shadow-md transition-all group cursor-pointer h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-green-600 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] px-1.5 py-px rounded-full bg-green-50 text-green-700 border border-green-200">Live</span>
              </div>
              <h3 className="text-[11px] text-gray-900 flex items-center justify-between leading-tight mb-0.5">
                Full Dashboard <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-gray-600 flex-shrink-0" />
              </h3>
              <p className="text-[9px] text-gray-400 mb-2 leading-tight">KPIs · trends · ROI · season performance</p>
              <MiniBarChart bars={[55, 62, 48, 71, 65, 78, 72, 80]} color="#22c55e" />
              <p className="text-[9px] text-green-600 mt-1.5">$4,200 saved · Wk 27 on track</p>
            </Card>
          </Link>

          {/* Pest Heatmap */}
          <Link to="/heatmap">
            <Card className="px-3 py-2.5 hover:shadow-md transition-all group cursor-pointer h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-blue-600 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">
                  <Map className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] px-1.5 py-px rounded-full bg-orange-50 text-orange-700 border border-orange-200">1 alert</span>
              </div>
              <h3 className="text-[11px] text-gray-900 flex items-center justify-between leading-tight mb-0.5">
                Pest Heatmap <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-gray-600 flex-shrink-0" />
              </h3>
              <p className="text-[9px] text-gray-400 mb-2 leading-tight">Raster field map · zone overlays · Kriging</p>
              <div className="flex items-end justify-between">
                <MiniHeatGrid />
                <div className="text-right">
                  <p className="text-[9px] text-orange-600 leading-tight">A·Z3 high</p>
                  <p className="text-[9px] text-gray-400">6 zones ok</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Robot & Cameras */}
          <Link to="/robot">
            <Card className="px-3 py-2.5 hover:shadow-md transition-all group cursor-pointer h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-gray-900 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] px-1.5 py-px rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-0.5">
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />Live
                </span>
              </div>
              <h3 className="text-[11px] text-gray-900 flex items-center justify-between leading-tight mb-0.5">
                Robot & Cameras <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-gray-600 flex-shrink-0" />
              </h3>
              <p className="text-[9px] text-gray-400 mb-2 leading-tight">Live feeds · lamp control · fan suction</p>
              <div className="grid grid-cols-3 gap-0.5">
                {["Cam 1","Cam 2","Cam 3"].map((c, i) => (
                  <div key={c} className={`rounded text-center py-1 text-[8px] ${i < 2 ? "bg-gray-800 text-green-400" : "bg-gray-100 text-gray-400"}`}>
                    <Camera className="w-2.5 h-2.5 mx-auto mb-0.5" />
                    {c}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-gray-500 mt-1.5">78% battery · Zone A·Z3</p>
            </Card>
          </Link>

          {/* Weekly Report */}
          <Link to="/reports">
            <Card className="px-3 py-2.5 hover:shadow-md transition-all group cursor-pointer h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-violet-600 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] px-1.5 py-px rounded-full bg-violet-50 text-violet-700 border border-violet-200">New</span>
              </div>
              <h3 className="text-[11px] text-gray-900 flex items-center justify-between leading-tight mb-0.5">
                Weekly Report <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-gray-600 flex-shrink-0" />
              </h3>
              <p className="text-[9px] text-gray-400 mb-2 leading-tight">Auto-generated farm summary · Week 27</p>
              <div className="space-y-1">
                {["1 high-risk zone flagged","3 sprays avoided this season","86% scan coverage · stable"].map((line, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`w-1 h-1 rounded-full flex-shrink-0 ${i === 0 ? "bg-orange-400" : "bg-green-400"}`} />
                    <span className="text-[9px] text-gray-500 leading-tight">{line}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Link>
        </div>

        {/* ── Robot Status + Pest Summary ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

          {/* Robot Status — operational */}
          <Card className="px-3 py-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-[11px] text-gray-900">Robot Status · Ramis-01</h3>
                <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-px rounded-full">Monitoring</span>
              </div>
              <Link to="/robot">
                <Button variant="ghost" size="sm" className="h-5 text-[10px] gap-0.5 text-gray-500 px-1.5">
                  Control <ChevronRight className="w-2.5 h-2.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {[
                { label: "Location",     value: "Field A – Zone 3",   icon: MapPin,   color: "text-blue-500" },
                { label: "Battery",      value: "78% · 4.2h left",    icon: Battery,  color: "text-green-500" },
                { label: "Signal",       value: "Excellent · 4G",     icon: Wifi,     color: "text-green-500" },
                { label: "Mode",         value: "Scanning · active",  icon: Activity, color: "text-violet-500" },
                { label: "Last Command", value: "Trap scan · 2h ago", icon: Clock,    color: "text-gray-400" },
                { label: "ETA Zone A",   value: "~38 min remaining",  icon: Zap,      color: "text-amber-500" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-gray-50 rounded-md px-2 py-1.5">
                    <p className="text-[9px] text-gray-400 leading-none mb-0.5">{item.label}</p>
                    <div className="flex items-center gap-1">
                      <Icon className={`w-3 h-3 ${item.color} flex-shrink-0`} />
                      <span className="text-[10px] text-gray-800 leading-tight">{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent events */}
            <div className="border-t border-gray-100 pt-1.5 mb-2">
              <p className="text-[9px] text-gray-400 mb-1">Recent events</p>
              <div className="space-y-0.5">
                {[
                  { time: "2h ago", event: "Trap scan complete · A·Z3", color: "bg-orange-400" },
                  { time: "4h ago", event: "Zone A·Z2 scan · clear",    color: "bg-green-400" },
                  { time: "6h ago", event: "Fan suction · 3 min",       color: "bg-blue-400" },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.color}`} />
                    <span className="text-[9px] text-gray-500">{e.time}</span>
                    <span className="text-[9px] text-gray-700">{e.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5">
              <Link to="/robot" className="flex-1">
                <Button size="sm" className="w-full h-6 text-[10px] bg-gray-900 hover:bg-gray-800 gap-1 px-2">
                  <Eye className="w-3 h-3" /> View Robot
                </Button>
              </Link>
              <Button size="sm" variant="outline" className="flex-1 h-6 text-[10px] gap-1 px-2">
                <Play className="w-3 h-3" /> Start Scan
              </Button>
              <Link to="/robot" className="flex-1">
                <Button size="sm" variant="outline" className="w-full h-6 text-[10px] gap-1 px-2">
                  <Camera className="w-3 h-3" /> Cameras
                </Button>
              </Link>
            </div>
          </Card>

          {/* Pest Summary */}
          <Card className="px-3 py-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[11px] text-gray-900">This Week's Pest Summary</h3>
                <span className="text-[9px] bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-px rounded-full">4 species tracked</span>
              </div>
              <Link to="/thresholds">
                <Button variant="ghost" size="sm" className="h-5 text-[10px] gap-0.5 text-gray-500 px-1.5">
                  Thresholds <ChevronRight className="w-2.5 h-2.5" />
                </Button>
              </Link>
            </div>
            <div className="space-y-1.5">
              {pests.map((item) => (
                <div key={item.name} className={`bg-gray-50 rounded-md px-2.5 py-1.5 border ${item.borderColor}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-gray-800 leading-none">{item.name}</span>
                    <div className="flex items-center gap-1.5">
                      <Sparkline data={item.sparkData} color={item.barColor} width={40} height={14} />
                      <span className={`text-[9px] flex items-center gap-0.5 ${item.trend > 0 ? "text-red-500" : item.trend < 0 ? "text-green-500" : "text-gray-400"}`}>
                        {item.trend > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : item.trend < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <span>—</span>}
                        {item.trend !== 0 && `${item.trend > 0 ? "+" : ""}${item.trend}%`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-sm text-gray-900 leading-none">{item.count}</span>
                    <span className="text-[9px] text-gray-400">/ {item.threshold} threshold · {item.pct}% IPM</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-0.5">
                    <div className="h-1 rounded-full transition-all" style={{ width: `${Math.min(item.pct, 100)}%`, backgroundColor: item.barColor }} />
                  </div>
                  <p className={`text-[9px] ${item.statusColor}`}>{item.status}</p>
                </div>
              ))}
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-gray-100">
              <p className="text-[9px] text-gray-400">Non-target: 2 beneficials (lacewing, ladybird) · do not disturb</p>
            </div>
          </Card>
        </div>

        {/* ── Season Snapshot ── */}
        <Card className="px-3 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-green-600" />
              <h3 className="text-[11px] text-gray-900">Season Impact Snapshot · 2026</h3>
              <span className="text-[9px] text-gray-400 border border-gray-200 rounded-full px-1.5 py-px">Why your subscription pays for itself</span>
            </div>
            <Link to="/overview">
              <Button variant="ghost" size="sm" className="h-5 text-[10px] gap-0.5 text-gray-500 px-1.5">
                Full ROI <ChevronRight className="w-2.5 h-2.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { label: "Cost Saved",        value: "$4,200", sub: "+$820 this wk",   color: "text-green-600",  bg: "bg-green-50",  icon: DollarSign },
              { label: "Sprays Avoided",    value: "3",      sub: "vs 5 last yr",    color: "text-blue-600",   bg: "bg-blue-50",   icon: ShieldCheck },
              { label: "Chemical Reduced",  value: "68%",    sub: "↓ 32L saved",     color: "text-teal-600",   bg: "bg-teal-50",   icon: Leaf },
              { label: "Yield Risk",        value: "2.3%",   sub: "↓ 1.8% vs avg",  color: "text-violet-600", bg: "bg-violet-50", icon: TrendingDown },
              { label: "Scan Coverage",     value: "86%",    sub: "↑ 6% this wk",   color: "text-amber-600",  bg: "bg-amber-50",  icon: Radio },
              { label: "Early Detections",  value: "2",      sub: "Wk 24 + Wk 27",  color: "text-orange-600", bg: "bg-orange-50", icon: AlertTriangle },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className={`${m.bg} rounded-lg px-2.5 py-2`}>
                  <Icon className={`w-3 h-3 ${m.color} mb-1`} />
                  <p className={`text-base leading-none ${m.color}`}>{m.value}</p>
                  <p className="text-[9px] text-gray-600 mt-0.5 leading-tight">{m.label}</p>
                  <p className="text-[9px] text-gray-400 mt-px leading-tight">{m.sub}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── Farm Risk Map Preview ── */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] text-gray-700">Live Field Map · Sunridge Farm</span>
              <span className="text-[9px] text-gray-400 border border-gray-200 rounded-full px-1.5 py-px ml-1">Grid heat overlay · hover cells</span>
            </div>
            <Link to="/heatmap">
              <Button variant="ghost" size="sm" className="h-5 text-[10px] gap-0.5 text-gray-500 px-1.5">
                Full map <ChevronRight className="w-2.5 h-2.5" />
              </Button>
            </Link>
          </div>

          <div
            className="relative cursor-crosshair"
            style={{ background: "#2e4a28" }}
            onMouseMove={onMapMove}
            onMouseLeave={() => setTooltip(null)}
            onClick={() => navigate("/heatmap")}
          >
            <svg ref={svgRef} className="w-full select-none"
              viewBox="0 0 700 188" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
              <defs>
                <linearGradient id="hph-bg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#3d6535" />
                  <stop offset="50%"  stopColor="#4a7a3d" />
                  <stop offset="100%" stopColor="#3a5e30" />
                </linearGradient>
                <linearGradient id="hph-road" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#c4ac7a" />
                  <stop offset="100%" stopColor="#a8935a" />
                </linearGradient>
                <linearGradient id="hph-leg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#22c55e" />
                  <stop offset="32%"  stopColor="#eab308" />
                  <stop offset="62%"  stopColor="#f97316" />
                  <stop offset="82%"  stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
              </defs>
              <rect width="700" height="188" fill="url(#hph-bg)" />
              {Array.from({ length: 23 }, (_, i) => (
                <line key={`r-${i}`} x1="0" y1={4 + i * 8} x2="700" y2={4 + i * 8}
                  stroke="rgba(20,60,12,0.16)" strokeWidth="1.2" />
              ))}
              <rect x="330" y="0" width="14" height="155" fill="url(#hph-road)" opacity="0.92" />
              <line x1="337" y1="0" x2="337" y2="155" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" strokeDasharray="8 6" />
              <rect x="0" y="155" width="700" height="14" fill="url(#hph-road)" opacity="0.90" />
              <line x1="0" y1="162" x2="700" y2="162" stroke="rgba(255,255,255,0.30)" strokeWidth="0.8" strokeDasharray="10 7" />
              <line x1="8" y1="54" x2="328" y2="54" stroke="#93c5fd" strokeWidth="1.1" strokeDasharray="8 5" opacity="0.44" />
              <line x1="8" y1="118" x2="328" y2="118" stroke="#93c5fd" strokeWidth="0.9" strokeDasharray="7 5" opacity="0.30" />
              <line x1="348" y1="54" x2="692" y2="54" stroke="#93c5fd" strokeWidth="1.0" strokeDasharray="8 5" opacity="0.38" />
              <polygon points="8,4 328,3 328,152 8,153" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.8" strokeLinejoin="round" />
              <polygon points="348,3 692,2 692,152 348,153" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.8" strokeLinejoin="round" />
              <rect x="8" y="170" width="684" height="15" rx="2" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="1.2" />
              <line x1="168" y1="3"  x2="168" y2="152" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" strokeDasharray="5 4" />
              <line x1="8"   y1="78" x2="328" y2="78"  stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" strokeDasharray="5 4" />
              <line x1="348" y1="78" x2="692" y2="78"  stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" strokeDasharray="5 4" />
              <line x1="520" y1="78" x2="520" y2="152" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeDasharray="4 3" />
              {HP_CELLS.map(cell => {
                const { fill, opacity } = cellFill(cell.pct);
                return (
                  <rect key={cell.id} x={cell.x} y={cell.y} width={cell.w} height={cell.h}
                    fill={fill} opacity={opacity} className="pointer-events-none" />
                );
              })}
              {[
                { x: 88,  y: 35,  label: "A·Z1",   pct: 40 },
                { x: 248, y: 26,  label: "A·Z3 ⚠", pct: 80 },
                { x: 88,  y: 107, label: "A·Z2",   pct: 20 },
                { x: 248, y: 107, label: "A·Z4",   pct: 13 },
                { x: 434, y: 32,  label: "B·Z2",   pct: 33 },
                { x: 434, y: 107, label: "B·Z1",   pct: 33 },
                { x: 606, y: 107, label: "B·Z3",   pct: 8  },
              ].map(z => (
                <g key={z.label} className="pointer-events-none">
                  <rect x={z.x - 20} y={z.y - 12} width="40" height="20" rx="3" fill="rgba(0,0,0,0.48)" />
                  <text x={z.x} y={z.y - 2} textAnchor="middle" fontSize="7.5" fill="white" fontWeight="700" opacity="0.95">{z.label}</text>
                  <text x={z.x} y={z.y + 6} textAnchor="middle" fontSize="6" fill={riskColor(z.pct)} fontWeight="600" opacity="0.94">{z.pct}%</text>
                </g>
              ))}
              <path d="M 8,130 L 328,130 L 328,116 L 8,116 L 8,102 L 328,102 L 328,88 L 8,88 L 8,78 L 328,78 L 328,64 L 168,64 L 168,50 L 328,50 L 328,36 L 248,36"
                stroke="#60a5fa" strokeWidth="1.3" strokeDasharray="4 5" fill="none" opacity="0.48" strokeLinecap="square" />
              <circle cx="248" cy="36" fill="none" stroke="#3b82f6" strokeWidth="1.0" opacity="0">
                <animate attributeName="r" from="5" to="14" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="248" cy="36" r="5.5" fill="#2563eb" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" />
              <circle cx="248" cy="36" r="2.2" fill="white" />
              <rect x="257" y="27" width="50" height="13" rx="2.5" fill="rgba(37,99,235,0.92)" />
              <text x="261" y="37" fontSize="6.5" fill="white" fontFamily="monospace">Ramis-01</text>
              <text x="350" y="181" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.62)" fontWeight="600">Field C · Young Pear · 9 ha</text>
              <text x="168" y="13" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.74)" fontWeight="600" letterSpacing="0.3">Field A · Apple · 18 ha</text>
              <text x="520" y="12" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.74)" fontWeight="600" letterSpacing="0.3">Field B · Mixed Orchard · 15 ha</text>
              <rect x="476" y="161" width="218" height="21" rx="3" fill="rgba(0,0,0,0.50)" />
              <text x="480" y="174" fontSize="6" fill="rgba(255,255,255,0.70)">IPM Risk:</text>
              <rect x="504" y="164" width="68" height="8" rx="2" fill="url(#hph-leg)" opacity="0.90" />
              {[
                { x: 576, fill: "#22c55e", label: "<40%" },
                { x: 598, fill: "#eab308", label: "40–70" },
                { x: 624, fill: "#f97316", label: "70–100" },
                { x: 654, fill: "#dc2626", label: "100–130" },
                { x: 686, fill: "#7f1d1d", label: ">130" },
              ].map(l => (
                <g key={l.x}>
                  <rect x={l.x} y="165" width="7" height="7" rx="1.5" fill={l.fill} opacity="0.90" />
                  <text x={l.x + 9} y="172" fontSize="5.5" fill="rgba(255,255,255,0.72)">{l.label}</text>
                </g>
              ))}
              <text x="8"   y="184" fontSize="6"   fill="rgba(255,255,255,0.32)">49°28.234′N · 119°35.871′W</text>
              <text x="692" y="11"  textAnchor="end" fontSize="6.5" fill="rgba(255,255,255,0.44)">2h ago</text>
            </svg>
          </div>
        </Card>

        {/* ── Pro CTA ── */}
        <Card className="px-3 py-2.5 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-[11px] text-gray-900">Unlock Pro features</p>
              <p className="text-[10px] text-gray-500 mt-px">14-day forecast · PDF export · Multi-farm view · Advisor share mode</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-xs h-7 px-3 shadow-sm">
              Upgrade to Pro
            </Button>
          </div>
        </Card>

      </div>

      {/* ── Hover Tooltip ── */}
      {tooltip && (
        <div
          style={{ position: "fixed", left: tooltip.x + 14, top: Math.max(8, tooltip.y - 108), zIndex: 9999, pointerEvents: "none" }}
          className="bg-gray-950/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-sm min-w-[180px]"
        >
          <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-white/10">
            <div className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: cellFill(tooltip.cell.pct).fill, opacity: 0.92 }} />
            <div>
              <p className="text-[11px] text-white leading-tight">{tooltip.cell.zoneLabel}</p>
              <p className="text-[9px] text-gray-400">Field {tooltip.cell.fieldId.toUpperCase()}</p>
            </div>
          </div>
          <div className="px-3 py-2 space-y-1">
            {[
              { label: "Dominant pest", value: tooltip.cell.pest },
              { label: "Count", value: `${tooltip.cell.count} / ${tooltip.cell.threshold} threshold` },
              { label: "IPM %", value: `${Math.round(tooltip.cell.pct)}% · ${riskLabel(tooltip.cell.pct)}`, color: riskColor(tooltip.cell.pct) },
              { label: "Trend", value: tooltip.cell.trend === "up" ? "↑ Rising" : tooltip.cell.trend === "down" ? "↓ Falling" : "→ Stable" },
              { label: "Action", value: actionLabel(tooltip.cell.pct) },
            ].map(r => (
              <div key={r.label} className="flex justify-between gap-3">
                <span className="text-[9px] text-gray-400">{r.label}</span>
                <span className="text-[10px] text-white text-right" style={r.color ? { color: r.color } : {}}>{r.value}</span>
              </div>
            ))}
          </div>
          <div className="px-3 pb-2.5">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-1.5 rounded-full"
                style={{ width: `${Math.min(tooltip.cell.pct, 130) / 130 * 100}%`, backgroundColor: cellFill(tooltip.cell.pct).fill }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
