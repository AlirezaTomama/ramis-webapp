import {
  AlertTriangle, TrendingDown, TrendingUp, DollarSign, Droplets, Leaf,
  Clock, ChevronDown, Calendar, Target, CheckCircle, X, Radio, Activity,
  ShieldCheck, BarChart2, Battery, ChevronRight, Eye, ListChecks, ExternalLink,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import {
  buildGrid, buildCellMap, findCellAt, toSvgPoint,
  cellFill, riskLabel, riskColor, actionLabel,
  type GridCell,
} from "../utils/farmGrid";
import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, PieChart, Pie, Cell,
  ComposedChart, Area, AreaChart, ReferenceArea,
} from "recharts";
import {
  infestationTrendData, activePestTypes, hotspotZones,
  savingsVsLastSeason, actionImpactData,
} from "../utils/mockData";

// ─── Data ─────────────────────────────────────────────────────────────────────
const trendDataByWindow: Record<string, { week: string; count: number; threshold: number }[]> = {
  week: [
    { week: "Mon", count: 9, threshold: 15 }, { week: "Tue", count: 10, threshold: 15 },
    { week: "Wed", count: 11, threshold: 15 }, { week: "Thu", count: 10, threshold: 15 },
    { week: "Fri", count: 12, threshold: 15 }, { week: "Sat", count: 11, threshold: 15 },
    { week: "Sun", count: 11, threshold: 15 },
  ],
  "8weeks": infestationTrendData,
  season: [
    { week: "Wk16", count: 2, threshold: 15 }, { week: "Wk18", count: 5, threshold: 15 },
    { week: "Wk20", count: 8, threshold: 15 }, { week: "Wk22", count: 18, threshold: 15 },
    { week: "Wk24", count: 27, threshold: 15 }, { week: "Wk26", count: 19, threshold: 15 },
    { week: "Wk27", count: 11, threshold: 15 },
  ],
};

const pestTrendData: Record<string, { week: string; count: number; threshold: number }[]> = {
  "Codling Moth": infestationTrendData,
  "Leafroller": [
    { week: "Wk20", count: 4, threshold: 12 }, { week: "Wk21", count: 6, threshold: 12 },
    { week: "Wk22", count: 9, threshold: 12 }, { week: "Wk23", count: 11, threshold: 12 },
    { week: "Wk24", count: 13, threshold: 12 }, { week: "Wk25", count: 10, threshold: 12 },
    { week: "Wk26", count: 12, threshold: 12 }, { week: "Wk27", count: 13, threshold: 12 },
  ],
  "Apple Aphid": [
    { week: "Wk20", count: 3, threshold: 25 }, { week: "Wk21", count: 5, threshold: 25 },
    { week: "Wk22", count: 7, threshold: 25 }, { week: "Wk23", count: 9, threshold: 25 },
    { week: "Wk24", count: 8, threshold: 25 }, { week: "Wk25", count: 6, threshold: 25 },
    { week: "Wk26", count: 7, threshold: 25 }, { week: "Wk27", count: 8, threshold: 25 },
  ],
};

const pestTypesByWindow: Record<string, typeof activePestTypes> = {
  week: [
    { name: "Codling Moth", count: 11, share: 42, color: "#f97316" },
    { name: "Leafroller", count: 13, share: 30, color: "#eab308" },
    { name: "Apple Aphid", count: 8, share: 18, color: "#3b82f6" },
    { name: "Spotted Wing Drosophila", count: 3, share: 7, color: "#8b5cf6" },
    { name: "Non-target", count: 1, share: 3, color: "#9ca3af" },
  ],
  "8weeks": activePestTypes,
  season: [
    { name: "Codling Moth", count: 145, share: 48, color: "#f97316" },
    { name: "Leafroller", count: 89, share: 29, color: "#eab308" },
    { name: "Apple Aphid", count: 42, share: 14, color: "#3b82f6" },
    { name: "Spotted Wing Drosophila", count: 21, share: 7, color: "#8b5cf6" },
    { name: "Non-target", count: 6, share: 2, color: "#9ca3af" },
  ],
};

const pestActionComboData = [
  { week: "Wk18", pestIndex: 22, actions: 0, projected: null },
  { week: "Wk20", pestIndex: 35, actions: 1, projected: null },
  { week: "Wk22", pestIndex: 72, actions: 2, projected: null },
  { week: "Wk24", pestIndex: 89, actions: 3, projected: null },
  { week: "Wk25", pestIndex: 64, actions: 1, projected: null },
  { week: "Wk26", pestIndex: 73, actions: 2, projected: null },
  { week: "Wk27", pestIndex: 58, actions: 0, projected: 58 },
  { week: "Wk28", pestIndex: null, actions: null, projected: 45 },
  { week: "Wk29", pestIndex: null, actions: null, projected: 62 },
  { week: "Wk30", pestIndex: null, actions: null, projected: 79 },
];

const riskForecastChartData = [
  { week: "Now", current: 58, projected: 58 },
  { week: "Wk28", current: null, projected: 45 },
  { week: "Wk29", current: null, projected: 62 },
  { week: "Wk30", current: null, projected: 79 },
  { week: "Wk31", current: null, projected: 58 },
];

const windowLabels: Record<string, string> = { week: "This Week", "8weeks": "Last 8 Wks", season: "Season" };

const recommendedActions = [
  { id: 1, priority: "high",   action: "Monitor Field A – Zone 3 every 48h", reason: "Pest index at 87/100 — near critical threshold. Codling moth counts elevated.", type: "Monitor" },
  { id: 2, priority: "medium", action: "Prepare trap replacement for Week 28–29", reason: "Delta traps in Field A reaching end of effective window.", type: "Prepare" },
  { id: 3, priority: "medium", action: "Check leafroller counts in Field B – Zone 2", reason: "Leafroller at 13/12 threshold (above). Close observation required.", type: "Prepare" },
  { id: 4, priority: "low",    action: "Review Field C perimeter scan results", reason: "SWD activity detected at low levels. Baseline check recommended.", type: "Monitor" },
  { id: 5, priority: "low",    action: "Schedule next full-farm scan cycle", reason: "Coverage gap in Field B – Zone 3 flagged this week.", type: "Monitor" },
];

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#22c55e" }: { data: number[]; color?: string }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 56, h = 20;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Compact card section label */
function CH({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-1">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 leading-none">{label}</p>
      {sub && <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{sub}</p>}
    </div>
  );
}

const statusBadge = (status: "Watch" | "Alert" | "Critical") => {
  const cfg = {
    Watch:    "bg-yellow-50 text-yellow-700 border-yellow-200",
    Alert:    "bg-orange-50 text-orange-700 border-orange-200",
    Critical: "bg-red-50 text-red-700 border-red-200",
  };
  return <span className={`text-[10px] border px-1.5 py-px rounded-full ${cfg[status]}`}>{status}</span>;
};

function getTrendStatus(data: { count: number; threshold: number }[]) {
  const last = data[data.length - 1];
  const pct = last.count / last.threshold;
  if (pct > 1)   return { label: "Above threshold", color: "bg-red-50 text-red-700 border-red-200" };
  if (pct > 0.7) return { label: "Approaching",     color: "bg-yellow-50 text-yellow-700 border-yellow-200" };
  return { label: "Under control", color: "bg-green-50 text-green-700 border-green-200" };
}

// ─── SVG Field Risk Map — raster grid overlay ─────────────────────────────────
const OV_CELL = 9;
const OV_FIELDS = [
  { id: "a", xMin: 6,   yMin: 4,  xMax: 161, yMax: 193 },
  { id: "b", xMin: 170, yMin: 3,  xMax: 267, yMax: 193 },
  { id: "c", xMin: 276, yMin: 2,  xMax: 333, yMax: 194 },
];
const OV_SOURCES = [
  { cx: 122, cy: 48,  peakPct: 128, sigma: 28 },
  { cx: 140, cy: 66,  peakPct: 80,  sigma: 20 },
  { cx: 46,  cy: 54,  peakPct: 52,  sigma: 26 },
  { cx: 46,  cy: 148, peakPct: 22,  sigma: 22 },
  { cx: 208, cy: 50,  peakPct: 42,  sigma: 28 },
  { cx: 238, cy: 65,  peakPct: 28,  sigma: 20 },
  { cx: 196, cy: 148, peakPct: 22,  sigma: 20 },
  { cx: 304, cy: 52,  peakPct: 18,  sigma: 20 },
];
function ovZoneAt(cx: number, cy: number) {
  if (cx >= 6   && cx < 84  && cy >= 4   && cy < 100) return { id: "a-z1", label: "Field A – Zone 1", pest: "Codling Moth", threshold: 15, trend: "stable" as const, fieldId: "a" };
  if (cx >= 84  && cx < 161 && cy >= 4   && cy < 100) return { id: "a-z3", label: "Field A – Zone 3", pest: "Codling Moth", threshold: 15, trend: "up"     as const, fieldId: "a" };
  if (cx >= 6   && cx < 84  && cy >= 100 && cy < 193) return { id: "a-z2", label: "Field A – Zone 2", pest: "Apple Aphid",  threshold: 25, trend: "down"   as const, fieldId: "a" };
  if (cx >= 84  && cx < 161 && cy >= 100 && cy < 193) return { id: "a-z4", label: "Field A – Zone 4", pest: "Leafroller",   threshold: 12, trend: "stable" as const, fieldId: "a" };
  if (cx >= 170 && cx < 267 && cy >= 3   && cy < 100) return { id: "b-z2", label: "Field B – Zone 2", pest: "Leafroller",   threshold: 12, trend: "stable" as const, fieldId: "b" };
  if (cx >= 170 && cx < 220 && cy >= 100 && cy < 193) return { id: "b-z1", label: "Field B – Zone 1", pest: "Codling Moth", threshold: 15, trend: "down"   as const, fieldId: "b" };
  if (cx >= 220 && cx < 267 && cy >= 100 && cy < 193) return { id: "b-z3", label: "Field B – Zone 3", pest: "SWD",          threshold: 10, trend: "stable" as const, fieldId: "b" };
  if (cx >= 276 && cx < 333 && cy >= 2   && cy < 100) return { id: "c-z1", label: "Field C – Zone 1", pest: "SWD",          threshold: 10, trend: "stable" as const, fieldId: "c" };
  if (cx >= 276 && cx < 333 && cy >= 100 && cy < 194) return { id: "c-z2", label: "Field C – Zone 2", pest: "Non-target",   threshold: 10, trend: "stable" as const, fieldId: "c" };
  return null;
}
const OV_CELLS: GridCell[] = buildGrid(OV_FIELDS, OV_SOURCES, ovZoneAt, OV_CELL, 11);
const OV_MAP = buildCellMap(OV_CELLS);
const OV_ZONE_LABELS = [
  { cx: 46,  cy: 53,  label: "A·Z1", pct: 40  },
  { cx: 122, cy: 53,  label: "A·Z3", pct: 80, warn: true },
  { cx: 46,  cy: 148, label: "A·Z2", pct: 20  },
  { cx: 122, cy: 145, label: "A·Z4", pct: 13  },
  { cx: 218, cy: 52,  label: "B·Z2", pct: 33  },
  { cx: 196, cy: 148, label: "B·Z1", pct: 33  },
  { cx: 244, cy: 148, label: "B·Z3", pct: 8   },
  { cx: 305, cy: 52,  label: "C·Z1", pct: 20  },
  { cx: 305, cy: 148, label: "C·Z2", pct: 10  },
];

// Kept for backwards compat with the existing zoneData = [
const zoneData = [
  { id: "A-Z1", label: "A·Z1", poly: "8,6 84,5 84,100 8,100",       index: 61, hotspotKey: "Field A – Zone 1", cx: 46, cy: 53 },
  { id: "A-Z3", label: "A·Z3", poly: "84,5 160,5 160,100 84,100",   index: 87, hotspotKey: "Field A – Zone 3", cx: 122, cy: 53 },
  { id: "A-Z4", label: "A·Z4", poly: "8,100 84,100 84,190 8,192",   index: 28, hotspotKey: "Field A – Zone 4", cx: 46, cy: 145 },
  { id: "A-Z2", label: "A·Z2", poly: "84,100 160,100 160,190 84,192", index: 44, hotspotKey: "Field A – Zone 2", cx: 122, cy: 145 },
  { id: "B-Z2", label: "B·Z2", poly: "172,5 268,4 268,100 172,100", index: 55, hotspotKey: "Field B – Zone 2", cx: 220, cy: 53 },
  { id: "B-Z1", label: "B·Z1", poly: "172,100 220,100 220,192 172,192", index: 18, hotspotKey: "Field B – Zone 1", cx: 196, cy: 145 },
  { id: "B-Z3", label: "B·Z3", poly: "220,100 268,100 268,192 220,192", index: 24, hotspotKey: "Field B – Zone 3", cx: 244, cy: 145 },
  { id: "C-Z1", label: "C·Z1", poly: "278,5 330,4 330,100 278,100",  index: 32, hotspotKey: "Field C – Zone 1", cx: 304, cy: 53 },
  { id: "C-Z2", label: "C·Z2", poly: "278,100 330,100 330,192 278,192", index: 19, hotspotKey: "Field C – Zone 2", cx: 304, cy: 145 },
];

interface Detection {
  id: string;
  zoneId: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  intensity: number;
  color: string;
}

const detections: Detection[] = [
  { id: "d1", zoneId: "A-Z3", cx: 114, cy: 46, rx: 26, ry: 14, intensity: 0.62, color: "#f97316" },
  { id: "d2", zoneId: "A-Z3", cx: 138, cy: 68, rx: 20, ry: 12, intensity: 0.44, color: "#f97316" },
  { id: "d3", zoneId: "A-Z1", cx: 48, cy: 54, rx: 18, ry: 10, intensity: 0.36, color: "#eab308" },
  { id: "d4", zoneId: "B-Z2", cx: 208, cy: 48, rx: 20, ry: 12, intensity: 0.30, color: "#eab308" },
  { id: "d5", zoneId: "B-Z2", cx: 238, cy: 62, rx: 16, ry: 10, intensity: 0.22, color: "#eab308" },
];

function zoneRisk(index: number) {
  if (index >= 80) return { stroke: "#ef4444", sw: 2.2, text: "#7c2d12" };
  if (index >= 55) return { stroke: "#f97316", sw: 1.8, text: "#7c2d12" };
  if (index >= 35) return { stroke: "#eab308", sw: 1.4, text: "#713f12" };
  return { stroke: "#4ade80", sw: 1.0, text: "#14532d" };
}

function FieldRiskMap({ highlighted, onZoneClick }: { highlighted: string | null; onZoneClick: (k: string) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ cell: GridCell; x: number; y: number } | null>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const pt = toSvgPoint(e, svgRef.current, 340, 200);
    if (!pt) return;
    const cell = findCellAt(pt.svgX, pt.svgY, OV_FIELDS, OV_MAP, OV_CELL);
    setTooltip(cell ? { cell, x: e.clientX, y: e.clientY } : null);
  }, []);
  const onClick = useCallback((e: React.MouseEvent) => {
    const pt = toSvgPoint(e, svgRef.current, 340, 200);
    if (!pt) return;
    const cell = findCellAt(pt.svgX, pt.svgY, OV_FIELDS, OV_MAP, OV_CELL);
    onZoneClick(cell ? cell.zoneLabel : "");
  }, [onZoneClick]);

  return (
    <>
    <svg ref={svgRef} viewBox="0 0 340 200" className="w-full h-full cursor-crosshair"
      style={{ background: "#2e4a28" }}
      onMouseMove={onMove} onMouseLeave={() => setTooltip(null)} onClick={onClick}>
      <defs>
        <linearGradient id="dash-sat-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#3d6535" />
          <stop offset="50%"  stopColor="#4a7a3d" />
          <stop offset="100%" stopColor="#3a5e30" />
        </linearGradient>
        <linearGradient id="dash-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c4ac7a" />
          <stop offset="100%" stopColor="#a8935a" />
        </linearGradient>
        {/* Radial heat gradients — smooth natural falloff */}
        <radialGradient id="dash-hg-critical" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#dc2626" stopOpacity="0.92" />
          <stop offset="22%"  stopColor="#ef4444" stopOpacity="0.78" />
          <stop offset="50%"  stopColor="#f97316" stopOpacity="0.52" />
          <stop offset="75%"  stopColor="#eab308" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dash-hg-high" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f97316" stopOpacity="0.82" />
          <stop offset="38%"  stopColor="#f97316" stopOpacity="0.55" />
          <stop offset="68%"  stopColor="#eab308" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dash-hg-watch" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#eab308" stopOpacity="0.72" />
          <stop offset="42%"  stopColor="#eab308" stopOpacity="0.40" />
          <stop offset="72%"  stopColor="#84cc16" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dash-hg-low" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.52" />
          <stop offset="55%"  stopColor="#22c55e" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <filter id="dash-zone-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Satellite base ── */}
      <rect width="340" height="200" fill="url(#dash-sat-bg)" />

      {/* Crop row texture */}
      {Array.from({ length: 24 }, (_, i) => (
        <line key={`r-${i}`} x1="4" y1={4 + i * 8} x2="334" y2={4 + i * 8}
          stroke="rgba(25,65,15,0.18)" strokeWidth="1.2" />
      ))}

      {/* Canopy variation patches */}
      <rect x="6"   y="4"  width="78" height="96" fill="rgba(40,90,28,0.10)" />
      <rect x="84"  y="4"  width="78" height="96" fill="rgba(32,80,22,0.07)" />
      <rect x="170" y="4"  width="98" height="96" fill="rgba(42,88,28,0.08)" />

      {/* Roads */}
      <rect x="162" y="0" width="8" height="197" fill="url(#dash-road)" opacity="0.92" />
      <line x1="166" y1="0" x2="166" y2="197" stroke="rgba(255,255,255,0.38)" strokeWidth="0.7" strokeDasharray="6 4" />
      <rect x="268" y="0" width="8" height="197" fill="url(#dash-road)" opacity="0.90" />
      <line x1="272" y1="0" x2="272" y2="197" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" strokeDasharray="6 4" />

      {/* Irrigation channels */}
      <line x1="6"   y1="60" x2="162" y2="60" stroke="#93c5fd" strokeWidth="1.0" strokeDasharray="7 5" opacity="0.40" />
      <line x1="170" y1="60" x2="267" y2="60" stroke="#93c5fd" strokeWidth="0.9" strokeDasharray="7 5" opacity="0.35" />
      <line x1="276" y1="60" x2="333" y2="60" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.30" />

      {/* Field boundaries — white satellite-style */}
      <polygon points="6,4 161,3 161,193 6,194"
        fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="1.4" />
      <polygon points="170,3 267,2 267,193 170,194"
        fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="1.4" />
      <polygon points="276,2 333,1 333,194 276,194"
        fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="1.4" />

      {/* Zone dividers */}
      <line x1="84"  y1="3"   x2="84"  y2="193" stroke="rgba(255,255,255,0.20)" strokeWidth="0.7" strokeDasharray="4 3" />
      <line x1="6"   y1="100" x2="161" y2="100" stroke="rgba(255,255,255,0.20)" strokeWidth="0.7" strokeDasharray="4 3" />
      <line x1="170" y1="100" x2="267" y2="100" stroke="rgba(255,255,255,0.20)" strokeWidth="0.7" strokeDasharray="4 3" />
      <line x1="220" y1="100" x2="220" y2="193" stroke="rgba(255,255,255,0.20)" strokeWidth="0.7" strokeDasharray="4 3" />
      <line x1="276" y1="100" x2="333" y2="100" stroke="rgba(255,255,255,0.20)" strokeWidth="0.7" strokeDasharray="4 3" />

      {/* ═══ RASTER HEAT GRID ═══ */}
      {OV_CELLS.map(cell => {
        const { fill, opacity } = cellFill(cell.pct);
        const isHL = highlighted && cell.zoneLabel === highlighted;
        return (
          <rect key={cell.id} x={cell.x} y={cell.y} width={cell.w} height={cell.h}
            fill={fill} opacity={isHL ? Math.min(opacity + 0.18, 0.94) : opacity}
            className="pointer-events-none" />
        );
      })}

      {/* Zone boundaries on top of grid */}
      {zoneData.map(z => {
        const hl = highlighted === z.hotspotKey;
        return (
          <polygon key={`zone-${z.id}`} points={z.poly}
            fill="transparent"
            stroke={hl ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.18)"}
            strokeWidth={hl ? 2.0 : 0.7}
            strokeLinejoin="round"
            className="pointer-events-none"
          />
        );
      })}

      {/* Zone labels */}
      {/* Zone labels */}
      {OV_ZONE_LABELS.map(z => (
        <g key={z.label} className="pointer-events-none">
          <rect x={z.cx - 16} y={z.cy - 10} width="32" height="17" rx="2.5" fill="rgba(0,0,0,0.50)" />
          <text x={z.cx} y={z.cy - 2} textAnchor="middle" fontSize="7" fill="white" fontWeight="700" opacity="0.95">
            {z.label}{z.warn ? " ⚠" : ""}
          </text>
          <text x={z.cx} y={z.cy + 6} textAnchor="middle" fontSize="5.5" fill={riskColor(z.pct)} fontWeight="600" opacity="0.94">
            {z.pct}%
          </text>
        </g>
      ))}

      {/* Robot */}
      <circle cx="122" cy="46" fill="none" stroke="#60a5fa" strokeWidth="1.0" opacity="0">
        <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="122" cy="46" r="4" fill="#2563eb" stroke="rgba(255,255,255,0.90)" strokeWidth="1.2" />
      <circle cx="122" cy="46" r="1.8" fill="white" opacity="0.9" />

      {/* Field labels */}
      <text x="84"  y="12" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.72)" fontWeight="600">Field A</text>
      <text x="218" y="11" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.72)" fontWeight="600">Field B</text>
      <text x="305" y="11" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.72)" fontWeight="600">Field C</text>
    </svg>

    {/* Tooltip */}
    {tooltip && (
      <div style={{ position: "fixed", left: tooltip.x + 12, top: Math.max(8, tooltip.y - 102), zIndex: 9999, pointerEvents: "none" }}
        className="bg-gray-950/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-sm min-w-[165px]">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1.5 border-b border-white/10">
          <div className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: cellFill(tooltip.cell.pct).fill, opacity: 0.92 }} />
          <p className="text-[10px] text-white leading-tight">{tooltip.cell.zoneLabel}</p>
        </div>
        <div className="px-3 py-1.5 space-y-0.5">
          {[
            { label: "Pest",   value: tooltip.cell.pest },
            { label: "Count",  value: `${tooltip.cell.count}/${tooltip.cell.threshold}` },
            { label: "IPM %",  value: `${Math.round(tooltip.cell.pct)}% · ${riskLabel(tooltip.cell.pct)}`, color: riskColor(tooltip.cell.pct) },
            { label: "Action", value: actionLabel(tooltip.cell.pct) },
          ].map(r => (
            <div key={r.label} className="flex justify-between gap-2">
              <span className="text-[8px] text-gray-400">{r.label}</span>
              <span className="text-[9px] text-white" style={r.color ? { color: r.color } : {}}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function Overview() {
  const [farm, setFarm]       = useState("sunridge");
  const [field, setField]     = useState("all");
  const [crop, setCrop]       = useState("apple");
  const [season, setSeason]   = useState("2026");
  const [trendWindow, setTrendWindow] = useState<"week" | "8weeks" | "season">("8weeks");
  const [activePestFilter, setActivePestFilter] = useState<string | null>(null);
  const [highlightedZone, setHighlightedZone]   = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<number | null>(null);

  const currentTrendData = (activePestFilter && pestTrendData[activePestFilter]) || trendDataByWindow[trendWindow];
  const currentPestTypes = pestTypesByWindow[trendWindow];
  const trendStatus      = getTrendStatus(currentTrendData);
  const donutData        = [{ value: 68 }, { value: 32 }];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Filter bar ── */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-2 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1">
            <Target className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs text-gray-900">Dashboard</span>
          </div>
          <div className="flex flex-wrap gap-1.5 flex-1">
            <Select value={farm} onValueChange={setFarm}>
              <SelectTrigger className="h-6 text-xs w-auto min-w-[120px] border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sunridge">Sunridge Farm</SelectItem>
                <SelectItem value="maple">Maple Creek Farm</SelectItem>
              </SelectContent>
            </Select>
            <Select value={field} onValueChange={setField}>
              <SelectTrigger className="h-6 text-xs w-auto min-w-[84px] border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="field-a">Field A</SelectItem>
                <SelectItem value="field-b">Field B</SelectItem>
                <SelectItem value="field-c">Field C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger className="h-6 text-xs w-auto min-w-[72px] border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
                <SelectItem value="pear">Pear</SelectItem>
              </SelectContent>
            </Select>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="h-6 text-xs w-auto min-w-[80px] border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026 Season</SelectItem>
                <SelectItem value="2025">2025 Season</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-6 text-xs gap-1 px-2 border-gray-200">
              <Calendar className="w-3 h-3" /> Wk 27 · Jul 1–7 <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
          {/* Inline trust strip */}
          <div className="hidden lg:flex items-center gap-2.5 ml-2 pl-2.5 border-l border-gray-200">
            <span className="flex items-center gap-1 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-700">Online</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-500"><Battery className="w-3 h-3 text-green-500" /> 78%</span>
            <span className="flex items-center gap-1 text-[11px] text-gray-500"><Clock className="w-3 h-3 text-gray-400" /> 2h ago</span>
            <span className="flex items-center gap-1 text-[11px] text-gray-500"><Radio className="w-3 h-3 text-violet-500" /> 86% cov.</span>
            <span className="flex items-center gap-1 text-[11px] bg-green-50 text-green-700 border border-green-200 rounded-full px-1.5 py-px">
              <ShieldCheck className="w-3 h-3" /> High confidence
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-2 space-y-1.5">

        {/* ── Decision banner ── */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span className="text-[11px] text-green-900 leading-tight">
              <strong>What should I do now? (Next 5–7 days)</strong>
              {" · "}
              <span className="inline-flex items-center gap-0.5 bg-green-100 text-green-800 border border-green-300 rounded-full px-1.5 py-px text-[10px]">
                <Eye className="w-2.5 h-2.5" /> Monitor Only
              </span>
              {" — "}Activity below seasonal baseline. Counts under IPM threshold across 8 of 9 zones.
            </span>
          </div>
          <button onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1 text-[11px] text-green-700 bg-white border border-green-200 hover:bg-green-50 rounded-md px-2 py-1 transition-colors flex-shrink-0">
            <ListChecks className="w-3 h-3" /> View actions (5) <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* ── ROW 1: KPI Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {[
            { idx: 0, icon: AlertTriangle, iconBg: "bg-orange-100", iconColor: "text-orange-600",
              value: "1", label: "High-Risk Zones", delta: "–2 vs last wk", deltaUp: false,
              sub: "Field A – Zone 3 ↑", subColor: "text-orange-600" },
            { idx: 1, icon: Activity, iconBg: "bg-yellow-100", iconColor: "text-yellow-600",
              value: "73%", label: "Infestation Level", delta: "Falling", deltaUp: false,
              sub: "of IPM threshold", subColor: "text-gray-500", bar: 73, barColor: "#f97316" },
            { idx: 2, icon: ShieldCheck, iconBg: "bg-violet-100", iconColor: "text-violet-600",
              value: "3", label: "Actions Suggested", delta: "This season", deltaUp: null,
              sub: "sprays avoided", subColor: "text-gray-500", viewList: true },
            { idx: 3, icon: Leaf, iconBg: "bg-green-100", iconColor: "text-green-600",
              value: "1,240 kg", label: "Yield Saved", delta: "+14% vs last yr", deltaUp: true,
              sub: "Est. season-to-date", subColor: "text-gray-500" },
            { idx: 4, icon: DollarSign, iconBg: "bg-emerald-100", iconColor: "text-emerald-600",
              value: "$4,200", label: "Total Cost Saved", delta: "68% chem. ↓", deltaUp: true,
              sub: "Chemical + labor", subColor: "text-gray-500" },
          ].map((kpi) => {
            const Icon = kpi.icon;
            const isSel = selectedKpi === kpi.idx;
            return (
              <Card key={kpi.idx} onClick={() => setSelectedKpi(isSel ? null : kpi.idx)}
                className={`px-2.5 py-2 cursor-pointer transition-all select-none ${isSel ? "ring-2 ring-green-400 bg-green-50/30" : "hover:shadow-md"}`}>
                {/* icon + delta on one row */}
                <div className="flex items-center justify-between mb-1">
                  <div className={`${kpi.iconBg} p-1 rounded`}><Icon className={`w-3.5 h-3.5 ${kpi.iconColor}`} /></div>
                  {kpi.delta && (
                    <span className={`flex items-center gap-0.5 text-[11px] leading-none ${kpi.deltaUp === true ? "text-green-600" : kpi.deltaUp === false ? "text-green-600" : "text-gray-400"}`}>
                      {kpi.deltaUp === true  && <TrendingUp className="w-3 h-3" />}
                      {kpi.deltaUp === false && <TrendingDown className="w-3 h-3" />}
                      {kpi.delta}
                    </span>
                  )}
                </div>
                {/* value */}
                <p className="text-xl text-gray-900 leading-none">{kpi.value}</p>
                {/* label */}
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{kpi.label}</p>
                {/* bar (infestation only) */}
                {kpi.bar && (
                  <div className="mt-1 h-1 bg-gray-100 rounded-full">
                    <div className="h-1 rounded-full" style={{ width: `${kpi.bar}%`, backgroundColor: kpi.barColor }} />
                  </div>
                )}
                {/* sub */}
                <div className="flex items-center justify-between mt-0.5">
                  <p className={`text-[11px] leading-tight ${kpi.subColor}`}>{kpi.sub}</p>
                  {kpi.viewList && (
                    <button onClick={(e) => { e.stopPropagation(); setDrawerOpen(true); }}
                      className="text-[11px] text-violet-600 hover:underline leading-none">View list</button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* ── ROW 2: Field Risk Map | Infestation Trend | Active Pest Types ── */}
        <div className="grid grid-cols-12 gap-1.5">

          {/* Field Risk Map */}
          <div className="col-span-12 lg:col-span-5">
            <Card className="p-2 h-full">
              <div className="flex items-center justify-between mb-1">
                <CH label="Field Risk Map" sub="Click zone to highlight" />
                <Link to="/heatmap" className="flex items-center gap-0.5 text-[11px] text-blue-600 hover:underline">
                  Open Heatmap <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div className="w-full" style={{ aspectRatio: "340/200" }}>
                <FieldRiskMap
                  highlighted={highlightedZone}
                  onZoneClick={(k) => setHighlightedZone(p => p === k ? null : k)}
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap bg-gray-900 rounded-md px-2 py-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider flex-shrink-0">IPM:</span>
                {[
                  { fill: "#22c55e", label: "<40%" },
                  { fill: "#eab308", label: "40–70" },
                  { fill: "#f97316", label: "70–100" },
                  { fill: "#dc2626", label: "100–130" },
                  { fill: "#7f1d1d", label: ">130" },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-0.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.fill, opacity: 0.92 }} />
                    <span className="text-[10px] text-gray-300">{l.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-0.5 ml-auto">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-[10px] text-gray-400">Robot</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Infestation Trend */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="p-2 h-full">
              <div className="flex items-start justify-between mb-1 gap-1">
                <div>
                  <CH label="Infestation Trend" />
                  <p className="text-xs text-gray-700 leading-none">{activePestFilter ?? "Codling Moth"}</p>
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  <span className={`text-[10px] border px-1.5 py-px rounded-full ${trendStatus.color}`}>{trendStatus.label}</span>
                  {activePestFilter && (
                    <button onClick={() => setActivePestFilter(null)} className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-100 hover:bg-gray-200 px-1.5 py-px rounded-full">
                      <X className="w-2.5 h-2.5" /> Clear
                    </button>
                  )}
                </div>
              </div>
              {/* Window toggle */}
              <div className="flex gap-px mb-1 bg-gray-100 rounded p-0.5 w-fit">
                {(["week", "8weeks", "season"] as const).map((w) => (
                  <button key={w} onClick={() => setTrendWindow(w)}
                    className={`px-2 py-px rounded text-[10px] transition-all ${trendWindow === w ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {windowLabels[w]}
                  </button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={132}>
                <LineChart data={currentTrendData} margin={{ top: 2, right: 24, left: -28, bottom: 0 }}>
                  <CartesianGrid key="lc-grid" strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis key="lc-x" dataKey="week" tick={{ fontSize: 9 }} />
                  <YAxis key="lc-y" tick={{ fontSize: 9 }} />
                  <Tooltip key="lc-tip" contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e5e7eb" }} />
                  <ReferenceLine key="lc-ref" y={currentTrendData[0]?.threshold} stroke="#ef4444" strokeDasharray="4 4"
                    label={{ value: "Threshold", position: "right", fontSize: 9, fill: "#ef4444" }} />
                  <Line key="lc-count" type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} dot={{ r: 2, fill: "#f97316" }} activeDot={{ r: 3 }} name="Count" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[11px] text-gray-500">Current: <strong className="text-gray-900">{currentTrendData[currentTrendData.length - 1]?.count}</strong></span>
                <span className="text-[11px] text-gray-500">Threshold: <strong className="text-orange-600">{currentTrendData[0]?.threshold}</strong></span>
              </div>
            </Card>
          </div>

          {/* Active Pest Types */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="p-2 h-full">
              <CH label="Active Pest Types" sub={`Top 5 · ${windowLabels[trendWindow]} · tap to filter`} />
              <div className="space-y-1">
                {currentPestTypes.map((p) => (
                  <button key={p.name} onClick={() => setActivePestFilter(prev => prev === p.name ? null : p.name)}
                    className={`w-full text-left rounded p-1 transition-all ${activePestFilter === p.name ? "bg-orange-50 ring-1 ring-orange-200" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-gray-700 truncate pr-1 leading-tight">{p.name}</span>
                      <span className="text-[11px] text-gray-500 flex-shrink-0">{p.share}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 rounded-full" style={{ width: `${p.share}%`, backgroundColor: p.color }} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-1 pt-1 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Total detections</span>
                <span className="text-xs text-gray-900">{currentPestTypes.reduce((s, p) => s + p.count, 0)}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* ── ROW 3: Pest Index & Actions | Risk Forecast | Action Impact ── */}
        <div className="grid grid-cols-12 gap-1.5">

          {/* Combo chart */}
          <div className="col-span-12 lg:col-span-5">
            <Card className="p-2 h-full">
              <CH label="Pest Index & Actions Over Time" sub="Index line · Action bars · Projected (dashed)" />
              <ResponsiveContainer width="100%" height={135}>
                <ComposedChart data={pestActionComboData} margin={{ top: 2, right: 12, left: -30, bottom: 0 }}>
                  <CartesianGrid key="cc-grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis key="cc-x" dataKey="week" tick={{ fontSize: 9 }} />
                  <YAxis key="cc-yl" yAxisId="left"  tick={{ fontSize: 9 }} domain={[0, 100]} />
                  <YAxis key="cc-yr" yAxisId="right" orientation="right" tick={{ fontSize: 9 }} domain={[0, 5]} />
                  <Tooltip key="cc-tip" contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e5e7eb" }} />
                  <ReferenceLine key="cc-ref" yAxisId="left" y={75} stroke="#ef4444" strokeDasharray="3 3" />
                  <ReferenceArea key="cc-ra1" yAxisId="left" y1={75} y2={100} fill="#fee2e2" fillOpacity={0.3} />
                  <ReferenceArea key="cc-ra2" yAxisId="left" y1={40} y2={75} fill="#fefce8" fillOpacity={0.3} />
                  <Bar key="cc-bar" yAxisId="right" dataKey="actions" name="Actions" fill="#8b5cf6" opacity={0.7} radius={[2, 2, 0, 0]} barSize={10} />
                  <Line key="cc-pest" yAxisId="left" type="monotone" dataKey="pestIndex" name="Pest Index" stroke="#f97316" strokeWidth={1.8} dot={{ r: 2 }} connectNulls={false} />
                  <Line key="cc-proj" yAxisId="left" type="monotone" dataKey="projected"  name="Projected"  stroke="#f97316" strokeWidth={1.4} strokeDasharray="5 4" dot={{ r: 1.5 }} connectNulls={false} opacity={0.6} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-3 mt-0.5">
                {[
                  { color: "#f97316", dash: false, label: "Pest Index" },
                  { color: "#f97316", dash: true,  label: "Projected" },
                  { color: "#8b5cf6", dash: false,  label: "Actions", rect: true },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1">
                    {l.rect
                      ? <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: l.color, opacity: 0.7 }} />
                      : <div className="w-4 h-0 border-t" style={{ borderColor: l.color, borderStyle: l.dash ? "dashed" : "solid" }} />}
                    <span className="text-[10px] text-gray-500">{l.label}</span>
                  </div>
                ))}
                <span className="ml-auto text-[10px] text-gray-400">Wk28–30 forecast</span>
              </div>
            </Card>
          </div>

          {/* Risk Forecast */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="p-2 h-full">
              <CH label="Risk Forecast" sub="Next 4 wks · Current vs Projected" />
              <ResponsiveContainer width="100%" height={118}>
                <AreaChart data={riskForecastChartData} margin={{ top: 2, right: 6, left: -30, bottom: 0 }}>
                  <CartesianGrid key="ac-grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis key="ac-x" dataKey="week" tick={{ fontSize: 9 }} />
                  <YAxis key="ac-y" tick={{ fontSize: 9 }} domain={[0, 100]} />
                  <Tooltip key="ac-tip" contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e5e7eb" }} />
                  <ReferenceArea key="ac-ra1" y1={75} y2={100} fill="#fee2e2" fillOpacity={0.5} />
                  <ReferenceArea key="ac-ra2" y1={40} y2={75} fill="#fefce8" fillOpacity={0.4} />
                  <ReferenceArea key="ac-ra3" y1={0}  y2={40} fill="#f0fdf4" fillOpacity={0.4} />
                  <Area key="ac-area" type="monotone" dataKey="projected" name="Projected" stroke="#f97316" fill="#f97316" fillOpacity={0.12} strokeWidth={1.8} strokeDasharray="5 3" dot={{ r: 2.5, fill: "#f97316" }} />
                  <Line key="ac-line" type="monotone" dataKey="current"   name="Current"   stroke="#3b82f6" strokeWidth={1.8} dot={{ r: 2.5, fill: "#3b82f6" }} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-3 mt-1">
                {[
                  { bg: "bg-green-100",  label: "Low (<40)" },
                  { bg: "bg-yellow-100", label: "Med (40–75)" },
                  { bg: "bg-red-100",    label: "High (>75)" },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-sm ${b.bg}`} />
                    <span className="text-[10px] text-gray-500">{b.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Action Impact Summary */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="p-2 h-full flex flex-col gap-1">
              <CH label="Action Impact Summary" sub="Season-to-date · 3 avoided interventions" />
              {[
                { label: "Yield Saved",     value: "1,240 kg", trend: "+14% vs last yr", data: actionImpactData.yieldSaved,      color: "#22c55e", icon: Leaf,       iconCls: "text-green-600" },
                { label: "Cost Saved",       value: "$4,200",  trend: "+$800 vs last mo", data: actionImpactData.costSaved,       color: "#3b82f6", icon: DollarSign, iconCls: "text-blue-600" },
                { label: "Chemical Reduced", value: "38 L",    trend: "68% reduction",    data: actionImpactData.chemicalReduced, color: "#8b5cf6", icon: Droplets,   iconCls: "text-purple-600" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${item.iconCls}`} />
                      <div>
                        <p className="text-[10px] text-gray-500 leading-none">{item.label}</p>
                        <p className="text-sm text-gray-900 leading-tight">{item.value}</p>
                        <p className="text-[10px] text-green-600 flex items-center gap-0.5 leading-none">
                          <TrendingUp className="w-2.5 h-2.5" />{item.trend}
                        </p>
                      </div>
                    </div>
                    <Sparkline data={item.data} color={item.color} />
                  </div>
                );
              })}
            </Card>
          </div>
        </div>

        {/* ── ROW 4: Hotspot Table | Savings Donut + Bar ── */}
        <div className="grid grid-cols-12 gap-1.5">

          {/* Hotspot Detection */}
          <div className="col-span-12 lg:col-span-7">
            <Card className="p-2">
              <div className="flex items-center justify-between mb-1">
                <CH label="Hotspot Detection" sub="Zone-wise pest index · click row to highlight on map" />
                {highlightedZone && (
                  <button onClick={() => setHighlightedZone(null)} className="text-[10px] text-gray-500 bg-gray-100 hover:bg-gray-200 px-1.5 py-px rounded-full flex items-center gap-0.5">
                    <X className="w-2.5 h-2.5" /> Clear
                  </button>
                )}
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-[10px] text-gray-400 pb-1 font-normal">Zone</th>
                    <th className="text-right text-[10px] text-gray-400 pb-1 font-normal pr-2">Pest Index</th>
                    <th className="text-right text-[10px] text-gray-400 pb-1 font-normal">Δ Week</th>
                    <th className="text-right text-[10px] text-gray-400 pb-1 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hotspotZones.map((zone, i) => {
                    const hl = highlightedZone === zone.zone;
                    return (
                      <tr key={i} onClick={() => setHighlightedZone(p => p === zone.zone ? null : zone.zone)}
                        className={`border-b border-gray-50 cursor-pointer transition-colors ${hl ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                        <td className="py-1 text-xs text-gray-900">{zone.zone}</td>
                        <td className="py-1 pr-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-1.5 rounded-full" style={{
                                width: `${zone.pestIndex}%`,
                                backgroundColor: zone.pestIndex > 80 ? "#ef4444" : zone.pestIndex > 55 ? "#f97316" : zone.pestIndex > 35 ? "#eab308" : "#22c55e",
                              }} />
                            </div>
                            <span className="text-xs text-gray-900 w-6 text-right">{zone.pestIndex}</span>
                          </div>
                        </td>
                        <td className="py-1">
                          <span className={`text-xs flex items-center justify-end gap-0.5 ${zone.change > 0 ? "text-red-600" : "text-green-600"}`}>
                            {zone.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {zone.change > 0 ? "+" : ""}{zone.change}%
                          </span>
                        </td>
                        <td className="py-1 text-right">{statusBadge(zone.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Right column: Donut + Bar stacked */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-1.5">

            {/* Donut */}
            <Card className="p-2 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <PieChart width={72} height={72}>
                  <Pie data={donutData} cx={31} cy={31} innerRadius={20} outerRadius={33}
                    startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                    <Cell key="donut-saved" fill="#22c55e" />
                    <Cell key="donut-rest"  fill="#f0fdf4" />
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-xs text-gray-900 leading-none">68%</p>
                  <p className="text-[9px] text-green-600">saved</p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <CH label="Savings Dashboard" />
                <p className="text-xl text-gray-900 leading-none">$4,200</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Total saved this season</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-[10px] text-gray-400">Sprays avoided</p>
                    <p className="text-xs text-gray-900">3</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Chemical ↓</p>
                    <p className="text-xs text-gray-900">38 L</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bar chart */}
            <Card className="p-2 flex-1">
              <CH label="Savings vs Last Season" sub="Chemical · Labor · Yield Loss ($)" />
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm bg-gray-200" /><span className="text-[10px] text-gray-500">Last Season</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm bg-green-500" /><span className="text-[10px] text-gray-500">This Season</span></div>
              </div>
              <ResponsiveContainer width="100%" height={95}>
                <BarChart data={savingsVsLastSeason} margin={{ top: 2, right: 6, left: -30, bottom: 0 }}>
                  <CartesianGrid key="bc-grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis key="bc-x" dataKey="category" tick={{ fontSize: 9 }} />
                  <YAxis key="bc-y" tick={{ fontSize: 9 }} />
                  <Tooltip key="bc-tip" formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e5e7eb" }} />
                  <Bar key="bc-last" dataKey="lastYear" name="Last Season" fill="#e5e7eb" radius={[2, 2, 0, 0]} barSize={14} />
                  <Bar key="bc-this" dataKey="thisYear" name="This Season" fill="#22c55e" radius={[2, 2, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* ── Baseline banner ── */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 flex items-center gap-2 flex-wrap">
          <BarChart2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <p className="text-xs text-blue-900 flex-1">
            <strong>Is this normal for this time of year?</strong> · Codling moth is <strong>18% below the seasonal average</strong> for Week 27.
            Historically, peak activity in Weeks 24–26 for BC orchards — you are past the peak.
          </p>
          <span className="text-xs text-green-700 bg-white border border-green-200 rounded-lg px-2 py-1 flex-shrink-0">↓ 18% vs avg</span>
        </div>

      </div>

      {/* ── Action Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm text-gray-900">Recommended Actions</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Next 5–7 days · Wk 27 · Sunridge Farm</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="mx-4 mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-green-900"><strong>Overall recommendation: Monitor Only</strong></p>
                <p className="text-[10px] text-green-700">Activity below seasonal baseline. No spray intervention needed.</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {recommendedActions.map((a) => (
                <div key={a.id} className={`rounded-lg border p-3 ${
                  a.priority === "high" ? "bg-orange-50 border-orange-200" : a.priority === "medium" ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] ${
                      a.priority === "high" ? "bg-orange-200" : a.priority === "medium" ? "bg-yellow-200" : "bg-gray-200"
                    }`}>{a.id}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className={`text-[9px] border rounded-full px-1.5 py-px ${
                          a.type === "Monitor" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-violet-50 text-violet-700 border-violet-200"
                        }`}>{a.type}</span>
                        <span className={`text-[9px] rounded-full px-1.5 py-px border ${
                          a.priority === "high" ? "bg-orange-100 text-orange-700 border-orange-200" : a.priority === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>{a.priority} priority</span>
                      </div>
                      <p className="text-xs text-gray-900 leading-snug">{a.action}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 italic leading-snug">{a.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
              <p className="text-[10px] text-gray-400 text-center">
                Actions based on BC IPM guidelines · No pesticide application instructions provided by Ramis.
                Always consult your agronomist before applying any chemical treatment.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}