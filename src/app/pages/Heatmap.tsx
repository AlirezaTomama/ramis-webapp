import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import {
  MapPin, TrendingUp, TrendingDown, Clock, CheckCircle, X,
  Layers, ZoomIn, ZoomOut, Bot, ChevronRight, Thermometer,
  Droplets, Leaf, Activity,
} from "lucide-react";
import {
  toSvgPoint,
  riskLabel, riskColor, actionLabel, riskBadgeCls,
  type PressureSrc, type FieldRect,
} from "../utils/farmGrid";

// ─── Zone data ────────────────────────────────────────────────────────────────
interface Zone {
  id: string;
  fieldId: "a" | "b" | "c";
  shortLabel: string;
  fullLabel: string;
  centroid: [number, number];
  pestIndex: number;
  count: number;
  threshold: number;
  pest: string;
  trend: "up" | "down" | "stable";
  trendPct: number;
  timeToImpact: string;
  lastSeen: string;
}

const ZONES: Zone[] = [
  { id: "a-z1", fieldId: "a", shortLabel: "A·Z1", fullLabel: "Field A – Zone 1",
    centroid: [110, 110], pestIndex: 40, count: 6,  threshold: 15, pest: "Codling Moth",
    trend: "down",   trendPct: 8,  timeToImpact: "10+ days", lastSeen: "3h ago" },
  { id: "a-z3", fieldId: "a", shortLabel: "A·Z3", fullLabel: "Field A – Zone 3 ⚠",
    centroid: [293, 108], pestIndex: 80, count: 12, threshold: 15, pest: "Codling Moth",
    trend: "up",     trendPct: 15, timeToImpact: "4–6 days",  lastSeen: "2h ago" },
  { id: "a-z2", fieldId: "a", shortLabel: "A·Z2", fullLabel: "Field A – Zone 2",
    centroid: [110, 255], pestIndex: 20, count: 3,  threshold: 15, pest: "Apple Aphid",
    trend: "stable", trendPct: 1,  timeToImpact: "14+ days", lastSeen: "5h ago" },
  { id: "a-z4", fieldId: "a", shortLabel: "A·Z4", fullLabel: "Field A – Zone 4",
    centroid: [293, 255], pestIndex: 13, count: 2,  threshold: 15, pest: "Leafroller",
    trend: "stable", trendPct: 0,  timeToImpact: "14+ days", lastSeen: "6h ago" },
  { id: "b-z2", fieldId: "b", shortLabel: "B·Z2", fullLabel: "Field B – Zone 2",
    centroid: [540, 108], pestIndex: 33, count: 4,  threshold: 12, pest: "Leafroller",
    trend: "stable", trendPct: 2,  timeToImpact: "8–10 days", lastSeen: "4h ago" },
  { id: "b-z1", fieldId: "b", shortLabel: "B·Z1", fullLabel: "Field B – Zone 1",
    centroid: [472, 255], pestIndex: 33, count: 5,  threshold: 15, pest: "Codling Moth",
    trend: "down",   trendPct: 22, timeToImpact: "14+ days", lastSeen: "5h ago" },
  { id: "b-z3", fieldId: "b", shortLabel: "B·Z3", fullLabel: "Field B – Zone 3",
    centroid: [606, 255], pestIndex: 8,  count: 1,  threshold: 12, pest: "SWD",
    trend: "stable", trendPct: 0,  timeToImpact: "14+ days", lastSeen: "6h ago" },
  { id: "c-z1", fieldId: "c", shortLabel: "C·Z1", fullLabel: "Field C – Zone 1",
    centroid: [180, 422], pestIndex: 20, count: 2,  threshold: 10, pest: "SWD",
    trend: "stable", trendPct: 0,  timeToImpact: "14+ days", lastSeen: "8h ago" },
  { id: "c-z2", fieldId: "c", shortLabel: "C·Z2", fullLabel: "Field C – Zone 2",
    centroid: [510, 420], pestIndex: 10, count: 1,  threshold: 10, pest: "Non-target",
    trend: "stable", trendPct: 0,  timeToImpact: "14+ days", lastSeen: "9h ago" },
];

const FIELD_RECTS: FieldRect[] = [
  { id: "a", xMin: 18,  yMin: 34,  xMax: 384, yMax: 326 },
  { id: "b", xMin: 407, yMin: 27,  xMax: 674, yMax: 326 },
  { id: "c", xMin: 14,  yMin: 350, xMax: 676, yMax: 491 },
];

const PRESSURE_SRCS: PressureSrc[] = [
  { cx: 286, cy: 105, peakPct: 128, sigma: 58 },
  { cx: 340, cy: 142, peakPct: 82,  sigma: 42 },
  { cx: 252, cy: 148, peakPct: 54,  sigma: 36 },
  { cx: 108, cy: 108, peakPct: 52,  sigma: 56 },
  { cx: 108, cy: 258, peakPct: 22,  sigma: 50 },
  { cx: 498, cy: 95,  peakPct: 42,  sigma: 65 },
  { cx: 572, cy: 120, peakPct: 30,  sigma: 45 },
  { cx: 468, cy: 252, peakPct: 25,  sigma: 48 },
  { cx: 175, cy: 418, peakPct: 18,  sigma: 55 },
  { cx: 510, cy: 418, peakPct: 12,  sigma: 50 },
];

// ─── Robot scan data-point markers ───────────────────────────────────────────
// Simulated robot scan stops (train = measured, open = secondary)
const SCAN_POINTS: Array<{ x: number; y: number; open: boolean }> = [
  // Field A – Zone 3 cluster (around epicentre)
  { x: 286, y: 105, open: false }, { x: 310, y: 125, open: false },
  { x: 265, y: 140, open: true  }, { x: 340, y: 98,  open: false },
  { x: 295, y: 152, open: true  }, { x: 253, y: 115, open: false },
  // Field A – Zone 1
  { x: 98,  y: 105, open: false }, { x: 130, y: 88,  open: true  },
  { x: 82,  y: 130, open: false }, { x: 152, y: 122, open: true  },
  // Field A – lower zones
  { x: 88,  y: 258, open: false }, { x: 135, y: 272, open: true  },
  { x: 280, y: 252, open: false }, { x: 320, y: 268, open: true  },
  // Field B
  { x: 498, y: 95,  open: false }, { x: 525, y: 108, open: true  },
  { x: 570, cy: 120, open: false, y: 120 }, { x: 545, y: 88,  open: true  },
  { x: 615, y: 100, open: false }, { x: 475, y: 258, open: true  },
  { x: 610, y: 248, open: false }, { x: 470, y: 120, open: true  },
  // Field C
  { x: 175, y: 418, open: false }, { x: 220, y: 435, open: true  },
  { x: 510, y: 418, open: false }, { x: 555, y: 440, open: true  },
  { x: 130, y: 458, open: true  }, { x: 340, y: 425, open: false },
  { x: 420, y: 460, open: true  }, { x: 600, y: 470, open: false },
];

// ─── Robot path ───────────────────────────────────────────────────────────────
const ROBOT_PATH =
  "M 18,298 L 383,298 L 383,270 L 18,270 L 18,242 L 383,242 L 383,214 L 18,214" +
  " L 18,185 L 383,185 L 383,162 L 202,162 L 202,138 L 383,138 L 383,114 L 278,114";
const ROBOT_POS: [number, number] = [278, 114];

// ─── Canvas smooth heatmap rendering ─────────────────────────────────────────
/** Smooth colour map: green → lime → yellow → orange → red → dark-red */
function pressureToRGB(p: number): [number, number, number] {
  const stops = [
    { at: 0,   r: 34,  g: 197, b: 94  },  // green-500
    { at: 22,  r: 101, g: 163, b: 13  },  // lime-600
    { at: 45,  r: 234, g: 179, b: 8   },  // yellow-500
    { at: 72,  r: 249, g: 115, b: 22  },  // orange-500
    { at: 100, r: 220, g: 38,  b: 38  },  // red-500
    { at: 130, r: 127, g: 29,  b: 29  },  // red-900
  ];
  const clamped = Math.min(Math.max(p, 0), 130);
  for (let i = 0; i < stops.length - 1; i++) {
    if (clamped <= stops[i + 1].at) {
      const t = (clamped - stops[i].at) / (stops[i + 1].at - stops[i].at);
      return [
        Math.round(stops[i].r + t * (stops[i + 1].r - stops[i].r)),
        Math.round(stops[i].g + t * (stops[i + 1].g - stops[i].g)),
        Math.round(stops[i].b + t * (stops[i + 1].b - stops[i].b)),
      ];
    }
  }
  return [127, 29, 29];
}

function inField(svgX: number, svgY: number, id?: string): boolean {
  const inA = svgX >= 18  && svgX <= 384 && svgY >= 34  && svgY <= 326;
  const inB = svgX >= 407 && svgX <= 674 && svgY >= 27  && svgY <= 326;
  const inC = svgX >= 14  && svgX <= 676 && svgY >= 350 && svgY <= 491;
  if (!id) return inA || inB || inC;
  if (id === "a") return inA;
  if (id === "b") return inB;
  if (id === "c") return inC;
  return false;
}

function renderSmoothHeatmap(
  canvas: HTMLCanvasElement,
  showHeat: boolean,
  selField: string,
) {
  const VW = 780, VH = 520;
  const SCALE = 2; // 1 canvas px = 2 SVG units → 390×260 canvas, smooth on upscale
  const W = Math.ceil(VW / SCALE);
  const H = Math.ceil(VH / SCALE);
  canvas.width  = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const d   = img.data;

  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const sx = px * SCALE + SCALE / 2;
      const sy = py * SCALE + SCALE / 2;

      const idx = (py * W + px) * 4;

      // ── Non-field background ──
      if (!inField(sx, sy)) {
        // Satellite green ground + road tones
        const isRoadV = sx >= 385 && sx <= 406;
        const isRoadH = sy >= 328 && sy <= 349;
        if (isRoadV || isRoadH) {
          d[idx]=168; d[idx+1]=152; d[idx+2]=96; d[idx+3]=255; // sandy road
        } else {
          // perimeter / outside — slightly darker green
          const n = ((sx * 7 + sy * 13) % 12) / 12 * 6;
          d[idx]=50+n; d[idx+1]=82+n; d[idx+2]=38+n; d[idx+3]=255;
        }
        continue;
      }

      // ── Determine field id ──
      const fid = inField(sx, sy, "a") ? "a" : inField(sx, sy, "b") ? "b" : "c";
      const dimmed = selField !== "all" && ("field-" + fid) !== selField;

      if (dimmed) {
        d[idx]=40; d[idx+1]=68; d[idx+2]=30; d[idx+3]=255;
        continue;
      }

      // ── Gaussian pressure sum ──
      let pressure = 6; // baseline background
      if (showHeat) {
        for (const src of PRESSURE_SRCS) {
          const dx = sx - src.cx, dy = sy - src.cy;
          pressure += src.peakPct * Math.exp(-(dx * dx + dy * dy) / (2 * src.sigma * src.sigma));
        }
        pressure = Math.min(pressure, 135);
      }

      let r: number, g: number, b: number;

      if (!showHeat || pressure < 8) {
        // Field green base with subtle crop-row texture
        const n = ((sx * 9 + sy * 17) % 18) / 18 * 10;
        r = 52 + n; g = 100 + n; b = 42 + n;
      } else if (pressure < 18) {
        // Gentle fade from green base → colour map
        const t = (pressure - 8) / 10;
        const [pr, pg, pb] = pressureToRGB(pressure);
        const n = ((sx * 9 + sy * 17) % 18) / 18 * 10;
        r = Math.round((52 + n) + t * (pr - (52 + n)));
        g = Math.round((100 + n) + t * (pg - (100 + n)));
        b = Math.round((42 + n) + t * (pb - (42 + n)));
      } else {
        [r, g, b] = pressureToRGB(pressure);
      }

      d[idx]=r; d[idx+1]=g; d[idx+2]=b; d[idx+3]=255;
    }
  }

  ctx.putImageData(img, 0, 0);
}

// ─── Zone risk helper ─────────────────────────────────────────────────────────
function getRisk(idx: number) {
  if (idx >= 100) return {
    label: "Critical", badge: "bg-red-50 border-red-200 text-red-700",
    dot: "#ef4444", bar: "#ef4444", action: "Intervene",
    actionCls: "bg-red-50 border-red-200 text-red-700",
  };
  if (idx >= 70) return {
    label: "High", badge: "bg-orange-50 border-orange-200 text-orange-700",
    dot: "#f97316", bar: "#f97316", action: "Prepare",
    actionCls: "bg-orange-50 border-orange-200 text-orange-700",
  };
  if (idx >= 40) return {
    label: "Moderate", badge: "bg-yellow-50 border-yellow-200 text-yellow-700",
    dot: "#eab308", bar: "#eab308", action: "Monitor+",
    actionCls: "bg-yellow-50 border-yellow-200 text-yellow-700",
  };
  return {
    label: "Low", badge: "bg-green-50 border-green-200 text-green-700",
    dot: "#22c55e", bar: "#22c55e", action: "Monitor",
    actionCls: "bg-green-50 border-green-200 text-green-700",
  };
}

const LAYERS = [
  { id: "pest",     label: "Pest Pressure", icon: Activity,    active: true  },
  { id: "moisture", label: "Soil Moisture", icon: Droplets,    active: false },
  { id: "temp",     label: "Temperature",   icon: Thermometer, active: false },
  { id: "nutrient", label: "Nutrients",     icon: Leaf,        active: false },
];

const rightTrees  = Array.from({ length: 22 }, (_, i) => ({ cx: 687, cy: 28 + i * 14 })).filter(t => t.cy <= 326);
const topTrees    = Array.from({ length: 15 }, (_, i) => ({ cx: 18 + i * 46, cy: 18 }));
const bottomTrees = Array.from({ length: 9  }, (_, i) => ({ cx: 50 + i * 74, cy: 504 }));

// ─── Component ────────────────────────────────────────────────────────────────
export function Heatmap() {
  const [selField, setSelField] = useState("all");
  const [selPest,  setSelPest]  = useState("all");
  const [period,   setPeriod]   = useState("week");
  const [overlay,  setOverlay]  = useState(true);
  const [showRobot, setShowRobot] = useState(true);
  const [showNT,   setShowNT]   = useState(false);
  const [showDots, setShowDots] = useState(true);
  const [legendMode, setLegendMode] = useState<"threshold" | "count">("threshold");
  const [selZone,  setSelZone]  = useState<Zone | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [tooltip, setTooltip]   = useState<{ zone: Zone; x: number; y: number } | null>(null);

  const svgRef    = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Re-render canvas when heatmap state changes
  useEffect(() => {
    if (canvasRef.current) {
      renderSmoothHeatmap(canvasRef.current, overlay, selField);
    }
  }, [overlay, selField]);

  const svgPoint = useCallback((e: React.MouseEvent) =>
    toSvgPoint(e, svgRef.current, 780, 520), []);

  function zoneAt(svgX: number, svgY: number): Zone | null {
    if (svgX >= 18  && svgX < 202 && svgY >= 34  && svgY < 185) return ZONES[0];
    if (svgX >= 202 && svgX < 384 && svgY >= 34  && svgY < 185) return ZONES[1];
    if (svgX >= 18  && svgX < 202 && svgY >= 185 && svgY < 326) return ZONES[2];
    if (svgX >= 202 && svgX < 384 && svgY >= 185 && svgY < 326) return ZONES[3];
    if (svgX >= 407 && svgX < 674 && svgY >= 27  && svgY < 185) return ZONES[4];
    if (svgX >= 407 && svgX < 537 && svgY >= 185 && svgY < 326) return ZONES[5];
    if (svgX >= 537 && svgX < 674 && svgY >= 185 && svgY < 326) return ZONES[6];
    if (svgX >= 14  && svgX < 346 && svgY >= 350 && svgY < 491) return ZONES[7];
    if (svgX >= 346 && svgX < 676 && svgY >= 350 && svgY < 491) return ZONES[8];
    return null;
  }

  const onMove = useCallback((e: React.MouseEvent) => {
    const pt = svgPoint(e);
    if (!pt) { setTooltip(null); return; }
    const zone = zoneAt(pt.svgX, pt.svgY);
    setTooltip(zone ? { zone, x: e.clientX, y: e.clientY } : null);
  }, [svgPoint]);

  const onLeave = useCallback(() => setTooltip(null), []);

  const onMapClick = useCallback((e: React.MouseEvent) => {
    const pt = svgPoint(e);
    if (!pt) return;
    const zone = zoneAt(pt.svgX, pt.svgY);
    setSelZone(prev => (prev?.id === zone?.id ? null : zone ?? null));
  }, [svgPoint]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-2">
        <div className="max-w-[1440px] mx-auto flex items-center gap-3">
          <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <div>
            <h1 className="text-sm text-gray-900">Pest Activity Map</h1>
            <p className="text-[10px] text-gray-400 leading-none">
              Smooth spatial interpolation · hover any zone · click to inspect
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live · 2h ago
            </span>
            <span className="text-[10px] text-gray-500 border border-gray-200 rounded-full px-2 py-px">
              Wk 27 · Sunridge Farm
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-2.5">

        {/* ── Decision banner ── */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 flex items-center gap-2 mb-2.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <p className="text-[11px] text-green-900 flex-1">
            <strong>Monitor Only</strong> · Next 5–7 days: Field A – Zone 3 approaching threshold.
            Codling moth at 80% IPM, concentrated in rows 4–6. No immediate spray required.
          </p>
          <span className="text-[9px] border px-1.5 py-px rounded-full text-orange-700 border-orange-200 bg-orange-50 flex-shrink-0">
            1 zone elevated
          </span>
        </div>

        {/* ── 2-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-2.5 items-start">

          {/* ════ Map card ════ */}
          <Card className="overflow-hidden p-0">

            {/* Toolbar */}
            <div className="px-3 py-2 border-b border-gray-100 bg-white flex flex-wrap items-center gap-2">
              <Select value={selField} onValueChange={setSelField}>
                <SelectTrigger className="h-6 text-[11px] w-auto min-w-[88px] border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="field-a">Field A</SelectItem>
                  <SelectItem value="field-b">Field B</SelectItem>
                  <SelectItem value="field-c">Field C</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selPest} onValueChange={setSelPest}>
                <SelectTrigger className="h-6 text-[11px] w-auto min-w-[96px] border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pests</SelectItem>
                  <SelectItem value="codling">Codling Moth</SelectItem>
                  <SelectItem value="leafroller">Leafroller</SelectItem>
                  <SelectItem value="swd">SWD</SelectItem>
                </SelectContent>
              </Select>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-6 text-[11px] w-auto min-w-[84px] border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="season">Season</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1.5">
                <Switch checked={overlay} onCheckedChange={setOverlay} id="sw-ov" />
                <label htmlFor="sw-ov" className="text-[10px] text-gray-600 cursor-pointer">Heat map</label>
              </div>
              <div className="flex items-center gap-1.5">
                <Switch checked={showRobot} onCheckedChange={setShowRobot} id="sw-rb" />
                <label htmlFor="sw-rb" className="text-[10px] text-gray-600 cursor-pointer">Robot</label>
              </div>
              <div className="flex items-center gap-1.5">
                <Switch checked={showDots} onCheckedChange={setShowDots} id="sw-dt" />
                <label htmlFor="sw-dt" className="text-[10px] text-gray-600 cursor-pointer">Scan points</label>
              </div>
              <div className="flex items-center gap-1.5">
                <Switch checked={showNT} onCheckedChange={setShowNT} id="sw-nt" />
                <label htmlFor="sw-nt" className="text-[10px] text-gray-600 cursor-pointer">Non-target</label>
              </div>
              <div className="ml-auto flex gap-px bg-gray-100 rounded p-0.5">
                {(["threshold", "count"] as const).map(m => (
                  <button key={m} onClick={() => setLegendMode(m)}
                    className={`px-2 py-px rounded text-[9px] transition-all ${legendMode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                    {m === "threshold" ? "% Threshold" : "By count"}
                  </button>
                ))}
              </div>
              {/* Layers panel */}
              <div className="relative">
                <Button variant="outline" size="sm" className="h-6 gap-1 text-[11px] px-2"
                  onClick={() => setLayerPanelOpen(p => !p)}>
                  <Layers className="w-3 h-3" /> Layers
                </Button>
                {layerPanelOpen && (
                  <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-2 min-w-[180px]">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1.5 px-1">Map layers</p>
                    {LAYERS.map(l => {
                      const Icon = l.icon;
                      return (
                        <div key={l.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${l.active ? "bg-blue-50" : "opacity-50"}`}>
                          <Icon className={`w-3 h-3 ${l.active ? "text-blue-600" : "text-gray-400"}`} />
                          <span className="text-[10px] text-gray-700 flex-1">{l.label}</span>
                          {l.active  && <span className="text-[8px] text-blue-600 border border-blue-200 bg-blue-50 px-1 rounded">ON</span>}
                          {!l.active && <span className="text-[8px] text-gray-400">soon</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Map viewport ── */}
            <div
              className="relative cursor-crosshair"
              style={{ background: "#2e4a28" }}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              onClick={onMapClick}
            >
              {/* ── Canvas layer: smooth gradient heatmap ── */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ imageRendering: "auto", display: "block" }}
              />

              {/* ── SVG overlay: borders, labels, robot, UI ── */}
              <svg
                ref={svgRef}
                className="w-full select-none relative"
                viewBox="0 0 780 520"
                preserveAspectRatio="xMidYMid meet"
                style={{ display: "block" }}
              >
                <defs>
                  <linearGradient id="hp-road" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#c4ac7a" />
                    <stop offset="100%" stopColor="#a8935a" />
                  </linearGradient>
                  <filter id="hp-zone-sel" x="-15%" y="-15%" width="130%" height="130%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="hp-robot-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="hp-road-shadow">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.22" />
                  </filter>
                  {/* Vertical colour scale gradient */}
                  <linearGradient id="hp-vscale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#7f1d1d" />
                    <stop offset="20%"  stopColor="#dc2626" />
                    <stop offset="45%"  stopColor="#f97316" />
                    <stop offset="65%"  stopColor="#eab308" />
                    <stop offset="82%"  stopColor="#65a30d" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  {/* Subtle dot grid for field texture */}
                  <pattern id="hp-crop-rows" x="0" y="0" width="1" height="8" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="780" y2="0" stroke="rgba(0,0,0,0.06)" strokeWidth="0.7" />
                  </pattern>
                </defs>

                {/* Crop-row texture lines */}
                {Array.from({ length: 62 }, (_, i) => (
                  <line key={`row-${i}`} x1="10" y1={26 + i * 8} x2="680" y2={26 + i * 8}
                    stroke="rgba(0,0,0,0.055)" strokeWidth="0.8" />
                ))}

                {/* GIS reference grid */}
                {[130, 260, 390, 520, 650].map(x => (
                  <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="520" stroke="rgba(255,255,255,0.032)" strokeWidth="0.5" />
                ))}
                {[130, 260, 390].map(y => (
                  <line key={`gy-${y}`} x1="0" y1={y} x2="780" y2={y} stroke="rgba(255,255,255,0.032)" strokeWidth="0.5" />
                ))}

                {/* Roads */}
                <rect x="385" y="26" width="20" height="304" fill="url(#hp-road)" filter="url(#hp-road-shadow)" opacity="0.92" />
                <line x1="395" y1="26" x2="395" y2="330" stroke="rgba(255,255,255,0.38)" strokeWidth="1.2" strokeDasharray="10 7" />
                <rect x="12" y="328" width="664" height="22" fill="url(#hp-road)" filter="url(#hp-road-shadow)" opacity="0.92" />
                <line x1="12" y1="339" x2="676" y2="339" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="12 8" />

                {/* Irrigation channels */}
                <line x1="18"  y1="108" x2="383" y2="106" stroke="#93c5fd" strokeWidth="1.4" strokeDasharray="9 6" opacity="0.40" />
                <line x1="18"  y1="250" x2="383" y2="250" stroke="#93c5fd" strokeWidth="1.0" strokeDasharray="7 6" opacity="0.28" />
                <line x1="407" y1="106" x2="674" y2="104" stroke="#93c5fd" strokeWidth="1.2" strokeDasharray="9 6" opacity="0.36" />
                <line x1="12"  y1="422" x2="676" y2="420" stroke="#93c5fd" strokeWidth="1.1" strokeDasharray="9 6" opacity="0.32" />

                {/* Field outer boundaries */}
                <polygon points="16,34 384,30 383,326 16,327"
                  fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="2.0" strokeLinejoin="round" />
                <polygon points="407,29 674,25 675,326 407,327"
                  fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="2.0" strokeLinejoin="round" />
                <polygon points="12,352 676,347 678,492 10,496"
                  fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.0" strokeLinejoin="round" />

                {/* Zone dividers */}
                <line x1="202" y1="33"  x2="202" y2="326" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="5 4" />
                <line x1="16"  y1="185" x2="384" y2="185" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="5 4" />
                <line x1="407" y1="185" x2="675" y2="185" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="5 4" />
                <line x1="537" y1="185" x2="537" y2="326" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="5 4" />
                <line x1="346" y1="349" x2="346" y2="492" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="5 4" />

                {/* ── Zone click-target polygons (transparent) ── */}
                {ZONES.map(zone => {
                  const isSel = selZone?.id === zone.id;
                  const isFiltered = selField !== "all" && zone.fieldId !== selField.replace("field-", "");
                  const zonesPolygons: Record<string, string> = {
                    "a-z1": "18,36 202,34 202,185 18,185",
                    "a-z3": "202,34 384,31 383,185 202,185",
                    "a-z2": "18,185 202,185 202,325 16,327",
                    "a-z4": "202,185 383,185 383,325 202,325",
                    "b-z2": "407,31 674,27 674,185 407,185",
                    "b-z1": "407,185 537,185 537,325 407,327",
                    "b-z3": "537,185 674,185 675,325 537,325",
                    "c-z1": "16,354 345,350 345,490 14,494",
                    "c-z2": "347,350 674,347 676,490 346,490",
                  };
                  return (
                    <polygon key={`hit-${zone.id}`}
                      points={zonesPolygons[zone.id]}
                      fill={isSel ? "rgba(255,255,255,0.08)" : "transparent"}
                      stroke={isSel ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.0)"}
                      strokeWidth={isSel ? 2.5 : 0}
                      strokeLinejoin="round"
                      opacity={isFiltered ? 0.25 : 1}
                      filter={isSel ? "url(#hp-zone-sel)" : undefined}
                      className="pointer-events-none"
                    />
                  );
                })}

                {/* ── Zone labels ── */}
                {ZONES.map(zone => {
                  const [cx, cy] = zone.centroid;
                  const isFiltered = selField !== "all" && zone.fieldId !== selField.replace("field-", "");
                  const isSel = selZone?.id === zone.id;
                  const rc = riskColor(zone.pestIndex);
                  return (
                    <g key={`lbl-${zone.id}`} opacity={isFiltered ? 0.20 : 1} className="pointer-events-none">
                      <rect x={cx - 24} y={cy - 15} width="48" height="23" rx="5"
                        fill={isSel ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0.50)"}
                        stroke={isSel ? "rgba(255,255,255,0.30)" : "none"}
                        strokeWidth="0.8"
                      />
                      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="8.5"
                        fill="white" fontWeight="700" opacity="0.96">
                        {zone.shortLabel}{zone.pestIndex >= 70 ? " ⚠" : ""}
                      </text>
                      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="7"
                        fill={rc} fontWeight="600" opacity="0.92">
                        {zone.pestIndex}%
                      </text>
                    </g>
                  );
                })}

                {/* ── Robot scan data points ── */}
                {showDots && SCAN_POINTS.map((pt, i) => {
                  const fid = inField(pt.x, pt.y, "a") ? "a" : inField(pt.x, pt.y, "b") ? "b" : "c";
                  const dimmed = selField !== "all" && ("field-" + fid) !== selField;
                  return (
                    <circle key={`dp-${i}`}
                      cx={pt.x} cy={pt.y} r={pt.open ? 3.5 : 3}
                      fill={pt.open ? "none" : "white"}
                      stroke="white"
                      strokeWidth={pt.open ? 1.2 : 0}
                      opacity={dimmed ? 0.12 : (pt.open ? 0.55 : 0.72)}
                      className="pointer-events-none"
                    />
                  );
                })}

                {/* ── Robot coverage path ── */}
                {showRobot && (
                  <path d={ROBOT_PATH}
                    stroke="#60a5fa" strokeWidth="1.6" strokeDasharray="4 5"
                    fill="none" opacity="0.48" strokeLinecap="square" />
                )}

                {/* ── Robot position marker ── */}
                {showRobot && (
                  <g transform={`translate(${ROBOT_POS[0]},${ROBOT_POS[1]})`} filter="url(#hp-robot-glow)">
                    <circle fill="none" stroke="#3b82f6" strokeWidth="1.4" opacity="0">
                      <animate attributeName="r"       from="10" to="26"  dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.55" to="0" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                    <circle r="9" fill="#2563eb" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
                    <circle r="4.5" fill="white" opacity="0.9" />
                    <circle r="1.8" fill="#1e40af" />
                    <line x1="0" y1="0" x2="7" y2="0" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
                  </g>
                )}
                {showRobot && (
                  <g className="pointer-events-none" transform={`translate(${ROBOT_POS[0] + 14},${ROBOT_POS[1] - 9})`}>
                    <rect x="0" y="0" width="56" height="15" rx="3" fill="rgba(37,99,235,0.92)" />
                    <text x="5" y="11" fontSize="7.5" fill="white" fontFamily="monospace">Ramis-01</text>
                    <circle cx="49" cy="7.5" r="2.8" fill="white" opacity="0.9">
                      <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}

                {/* ── Non-target insects ── */}
                {showNT && (
                  <g opacity="0.60">
                    {[[85,416],[146,452],[224,438],[418,422],[516,458]].map(([x,y], i) => (
                      <g key={`nt-${i}`}>
                        <circle cx={x} cy={y} r="5" fill="rgba(156,163,175,0.50)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                        <text x={x} y={y+10} textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.80)">NT</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* ── Tree windbreak ── */}
                {rightTrees.map((t, i) => (
                  <g key={`tr-r-${i}`} transform={`translate(${t.cx},${t.cy})`}>
                    <circle r="6.5" fill="#1a3d16" opacity="0.90" />
                    <circle r="3.5" fill="#2d6a24" opacity="0.55" cx="0.5" cy="-1.2" />
                  </g>
                ))}
                {topTrees.map((t, i) => (
                  <g key={`tr-t-${i}`} transform={`translate(${t.cx},${t.cy})`}>
                    <circle r="5.5" fill="#1a3d16" opacity="0.82" />
                    <circle r="3"   fill="#2d6a24" opacity="0.50" cy="-0.8" />
                  </g>
                ))}
                {bottomTrees.map((t, i) => (
                  <g key={`tr-b-${i}`} transform={`translate(${t.cx},${t.cy})`}>
                    <circle r="5" fill="#1a3d16" opacity="0.60" />
                  </g>
                ))}

                {/* ── Farm infrastructure ── */}
                <rect x="702" y="36" width="52" height="38" rx="2" fill="#b0bec8" stroke="rgba(255,255,255,0.40)" strokeWidth="1.2" />
                <line x1="702" y1="55" x2="754" y2="55" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
                <rect x="720" y="63" width="16" height="11" rx="1" fill="#8fa0b0" />
                <rect x="702" y="72" width="52" height="4" fill="rgba(0,0,0,0.18)" />
                <text x="728" y="90" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.60)" fontWeight="600">Barn</text>
                <ellipse cx="728" cy="428" rx="26" ry="18" fill="#1e6091" stroke="#60a5fa" strokeWidth="1.4" opacity="0.85" />
                <ellipse cx="728" cy="428" rx="19" ry="12" fill="#2980b9" opacity="0.55" />
                <text x="728" y="432" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.88)" fontWeight="600">Reservoir</text>

                {/* ── Field labels ── */}
                <text x="200" y="49"  textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,0.82)" fontWeight="700" letterSpacing="0.6">Field A · Apple · 18 ha</text>
                <text x="540" y="46"  textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,0.82)" fontWeight="700" letterSpacing="0.6">Field B · Mixed Orchard · 15 ha</text>
                <text x="344" y="368" textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,0.76)" fontWeight="700" letterSpacing="0.6">Field C · Young Pear · 9 ha</text>

                {/* ── GPS strip ── */}
                <text x="14" y="512" fontSize="7.5" fill="rgba(255,255,255,0.36)">49°28.234′N · 119°35.871′W</text>
                <text x="766" y="14" textAnchor="end" fontSize="7.5" fill="rgba(255,255,255,0.45)">Updated 2h ago</text>

                {/* ═══════════════════════════════════════════════════════
                    VERTICAL COLOUR SCALE BAR  (like image-3 reference)
                    Right edge of the map — gradient from green→red with tick labels
                    ═══════════════════════════════════════════════════════ */}
                <g transform="translate(755, 50)">
                  {/* Background pill */}
                  <rect x="-6" y="-8" width="32" height="350" rx="6"
                    fill="rgba(0,0,0,0.62)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                  {/* Gradient bar */}
                  <rect x="0" y="0" width="14" height="310" rx="3" fill="url(#hp-vscale)" />
                  {/* Tick marks + labels */}
                  {[
                    { y: 0,   label: ">130%", sub: "Crit.",  color: "#fca5a5" },
                    { y: 62,  label: "100%",  sub: "High",   color: "#fdba74" },
                    { y: 140, label: "70%",   sub: "Alert",  color: "#fde047" },
                    { y: 200, label: "40%",   sub: "Watch",  color: "#bef264" },
                    { y: 270, label: "< 20%", sub: "Low",    color: "#86efac" },
                    { y: 310, label: "0%",    sub: "",       color: "#86efac" },
                  ].map(({ y, label, sub, color }) => (
                    <g key={y}>
                      <line x1="14" y1={y} x2="20" y2={y} stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                      <text x="22" y={y + 3.5} fontSize="7.5" fill={color} fontFamily="monospace">{label}</text>
                      {sub && (
                        <text x="22" y={y + 12} fontSize="6" fill="rgba(255,255,255,0.42)">{sub}</text>
                      )}
                    </g>
                  ))}
                  {/* Title */}
                  <text
                    x="7" y="330" textAnchor="middle" fontSize="7"
                    fill="rgba(255,255,255,0.55)" fontWeight="600"
                    transform="rotate(-90, 7, 330)"
                    style={{ writingMode: "horizontal-tb" }}
                  >IPM %</text>
                  <text x="7" y="340" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.40)">IPM %</text>
                </g>

                {/* ── Scan-points legend ── */}
                <g transform="translate(690, 370)">
                  <rect x="-4" y="-4" width="72" height="48" rx="4" fill="rgba(0,0,0,0.58)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                  <text x="32" y="7" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.75)" fontWeight="600">Scan Points</text>
                  <circle cx="8"  cy="20" r="3"   fill="white" opacity="0.72" />
                  <text x="15" y="23" fontSize="7" fill="rgba(255,255,255,0.65)">Measured</text>
                  <circle cx="8"  cy="34" r="3.5" fill="none" stroke="white" strokeWidth="1.2" opacity="0.55" />
                  <text x="15" y="37" fontSize="7" fill="rgba(255,255,255,0.55)">Secondary</text>
                </g>

                {/* ── Robot legend ── */}
                {showRobot && (
                  <g transform="translate(690, 290)">
                    <rect x="-4" y="-4" width="72" height="26" rx="4" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                    <circle cx="8" cy="9" r="5.5" fill="#2563eb" stroke="rgba(255,255,255,0.80)" strokeWidth="1.2" />
                    <circle cx="8" cy="9" r="2.2" fill="white" />
                    <text x="18" y="13" fontSize="7.5" fill="rgba(255,255,255,0.80)">Robot · Row scan</text>
                  </g>
                )}

                {/* ── Compass ── */}
                <g transform="translate(718, 478)">
                  <circle r="18" fill="rgba(0,0,0,0.58)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
                  <polygon points="0,-14 3.8,0 0,-4 -3.8,0"  fill="#ef4444" opacity="0.92" />
                  <polygon points="0,14 3.8,0 0,4 -3.8,0"   fill="rgba(255,255,255,0.55)" />
                  <circle r="2.5" fill="rgba(255,255,255,0.72)" />
                  <text x="0" y="-18" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="700">N</text>
                  <text x="0"  y="24" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.55)">S</text>
                  <text x="-22" y="3" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.55)">W</text>
                  <text x="22"  y="3" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.55)">E</text>
                </g>

                {/* ── Scale bar ── */}
                <g transform="translate(640, 456)">
                  <rect x="-2" y="-13" width="58" height="18" rx="3" fill="rgba(0,0,0,0.48)" />
                  <line x1="2"  y1="0" x2="52" y2="0" stroke="rgba(255,255,255,0.72)" strokeWidth="1.6" />
                  <line x1="2"  y1="-3" x2="2"  y2="3" stroke="rgba(255,255,255,0.72)" strokeWidth="1.6" />
                  <line x1="52" y1="-3" x2="52" y2="3" stroke="rgba(255,255,255,0.72)" strokeWidth="1.6" />
                  <text x="27" y="-4" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.82)">100 m</text>
                </g>
              </svg>

              {/* Hover tooltip */}
              {tooltip && (
                <div
                  className="fixed z-50 pointer-events-none bg-gray-900/92 border border-gray-700 text-white rounded-lg px-3 py-2 shadow-xl"
                  style={{ left: tooltip.x + 14, top: tooltip.y - 40, minWidth: 160 }}
                >
                  <p className="text-[10px] font-semibold leading-tight">{tooltip.zone.fullLabel}</p>
                  <p className="text-[9px] text-gray-300 leading-tight">{tooltip.zone.pest}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full"
                        style={{ width: `${Math.min(tooltip.zone.pestIndex, 100)}%`, backgroundColor: riskColor(tooltip.zone.pestIndex) }} />
                    </div>
                    <span className="text-[9px]" style={{ color: riskColor(tooltip.zone.pestIndex) }}>
                      {tooltip.zone.pestIndex}%
                    </span>
                  </div>
                  <p className="text-[8px] text-gray-400 mt-0.5">{actionLabel(tooltip.zone.pestIndex)}</p>
                </div>
              )}

              {/* Zoom controls */}
              <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                <Button size="sm" variant="secondary" className="w-7 h-7 p-0 shadow-sm bg-white/90">
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="secondary" className="w-7 h-7 p-0 shadow-sm bg-white/90">
                  <ZoomOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* ════ Right panel ════ */}
          <div className="space-y-2">

            {/* Zone detail (selected) or hint */}
            {selZone ? (() => {
              const risk = getRisk(selZone.pestIndex);
              return (
                <Card className={`p-3 border ${risk.badge.split(" ").slice(0, 2).join(" ")}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <h3 className="text-[11px] text-gray-900">{selZone.fullLabel}</h3>
                        <span className={`text-[9px] border px-1.5 py-px rounded-full ${risk.badge}`}>{risk.label}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-none">{selZone.pest}</p>
                    </div>
                    <button onClick={() => setSelZone(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* IPM bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-[9px] text-gray-500 mb-0.5">
                      <span>Zone IPM avg.</span>
                      <span style={{ color: riskColor(selZone.pestIndex) }}>{selZone.pestIndex}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(selZone.pestIndex, 100)}%`, backgroundColor: risk.bar }} />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      {selZone.count} / {selZone.threshold} insects · zone average
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {[
                      { label: "Trend",
                        value: `${selZone.trend === "up" ? "↑ +" : selZone.trend === "down" ? "↓ −" : "→ "}${selZone.trendPct}%`,
                        cls: selZone.trend === "up" ? "text-red-600" : selZone.trend === "down" ? "text-green-600" : "text-gray-600" },
                      { label: "Time to impact", value: selZone.timeToImpact, cls: "text-gray-900" },
                      { label: "Last scan",       value: selZone.lastSeen,     cls: "text-gray-500" },
                      { label: "Field",            value: `Field ${selZone.fieldId.toUpperCase()}`, cls: "text-gray-900" },
                    ].map(s => (
                      <div key={s.label} className="bg-white/60 rounded px-2 py-1.5 border border-white/80">
                        <p className="text-[8px] text-gray-400 leading-none">{s.label}</p>
                        <p className={`text-[10px] leading-tight mt-0.5 ${s.cls}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action recommendation */}
                  <div className={`rounded-md px-2.5 py-2 border text-center ${risk.actionCls}`}>
                    <p className="text-[9px] font-semibold">{risk.action} · {actionLabel(selZone.pestIndex)}</p>
                  </div>
                </Card>
              );
            })() : (
              <Card className="p-3 bg-white border border-gray-100">
                <div className="flex items-start gap-1.5 mb-1">
                  <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-gray-500">
                    Hover any zone to see pest data. Click a zone to inspect details.
                  </p>
                </div>
              </Card>
            )}

            {/* All zones list */}
            <Card className="p-0 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-700">All Zones</span>
                <div className="flex items-center gap-2 text-[9px] text-gray-400">
                  <span>{ZONES.length} zones</span>
                  <span className="text-orange-500">· {ZONES.filter(z => z.pestIndex >= 70).length} elevated</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50 max-h-[380px] overflow-y-auto">
                {ZONES.map(zone => {
                  const risk = getRisk(zone.pestIndex);
                  const isSel = selZone?.id === zone.id;
                  return (
                    <button key={zone.id}
                      onClick={() => setSelZone(prev => prev?.id === zone.id ? null : zone)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2.5 ${isSel ? "bg-blue-50" : ""}`}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: risk.dot }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[10px] text-gray-800 leading-none">{zone.shortLabel}</p>
                          <span className={`text-[8px] border px-1.5 py-px rounded-full ${risk.badge}`}>{risk.label}</span>
                        </div>
                        <p className="text-[8.5px] text-gray-400 leading-none truncate">{zone.pest}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-1 rounded-full transition-all"
                              style={{ width: `${Math.min(zone.pestIndex, 100)}%`, backgroundColor: risk.bar }} />
                          </div>
                          <span className="text-[8px] text-gray-500">{zone.pestIndex}%</span>
                        </div>
                      </div>
                      {isSel && <ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Robot status strip */}
            {showRobot && (
              <Card className="p-2.5 bg-blue-50 border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-blue-900">Ramis-01 · Field A – Zone 3</p>
                    <p className="text-[8.5px] text-blue-600 leading-tight">
                      Row-by-row scan · 86% coverage · Row 8 of 12
                    </p>
                  </div>
                  <span className="text-[8px] text-blue-500 border border-blue-200 rounded-full px-1.5 py-px bg-white">
                    scanning
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
