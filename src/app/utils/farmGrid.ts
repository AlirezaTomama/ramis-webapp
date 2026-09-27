// ─── Ramis Farm Grid Utility ──────────────────────────────────────────────────
// Generates a raster/grid heat overlay from Gaussian hotspot pressure sources.
// Each GridCell is a 10-20m square coloured by % of IPM threshold.

export interface GridCell {
  id: string;
  x: number; y: number;
  w: number; h: number;
  pct: number;              // % of IPM threshold (0–195+)
  zoneId: string;
  zoneLabel: string;
  pest: string;
  count: number;
  threshold: number;
  trend: "up" | "down" | "stable";
  fieldId: string;
}

export interface PressureSrc {
  cx: number; cy: number;
  peakPct: number;   // max pressure (% threshold) at epicentre
  sigma: number;     // Gaussian spread in SVG px
}

export interface FieldRect {
  id: string;
  xMin: number; yMin: number;
  xMax: number; yMax: number;
}

export interface ZoneLookup {
  id: string;
  label: string;
  pest: string;
  threshold: number;
  trend: "up" | "down" | "stable";
  fieldId: string;
}

/** Deterministic noise in -1..1 range (seeded by col/row) */
export function dNoise(col: number, row: number, seed = 0): number {
  const v =
    Math.sin((col + seed) * 12.9898 + (row + seed * 3) * 78.233 + col * row * 0.1728) *
    43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
}

/** Build all grid cells for a map */
export function buildGrid(
  fieldRects: FieldRect[],
  sources: PressureSrc[],
  zoneLookupFn: (cx: number, cy: number) => ZoneLookup | null,
  cellSize: number,
  noiseAmp = 13,
): GridCell[] {
  const cells: GridCell[] = [];

  for (const field of fieldRects) {
    const cols = Math.ceil((field.xMax - field.xMin) / cellSize);
    const rows = Math.ceil((field.yMax - field.yMin) / cellSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = field.xMin + col * cellSize;
        const y = field.yMin + row * cellSize;
        const cx = x + cellSize * 0.5;
        const cy = y + cellSize * 0.5;

        const zone = zoneLookupFn(cx, cy);
        if (!zone) continue;

        // Sum Gaussian contributions from all pressure sources
        let pressure = 7; // baseline background
        for (const src of sources) {
          const d2 = (cx - src.cx) ** 2 + (cy - src.cy) ** 2;
          pressure += src.peakPct * Math.exp(-d2 / (2 * src.sigma ** 2));
        }
        // Deterministic noise → irregular patch boundaries
        pressure += dNoise(col, row) * noiseAmp;
        pressure = Math.max(2, Math.min(195, pressure));

        cells.push({
          id: `${field.id}-${col}-${row}`,
          x, y,
          w: Math.min(cellSize, field.xMax - x),
          h: Math.min(cellSize, field.yMax - y),
          pct: pressure,
          zoneId: zone.id,
          zoneLabel: zone.label,
          pest: zone.pest,
          count: Math.max(0, Math.round((pressure / 100) * zone.threshold)),
          threshold: zone.threshold,
          trend: zone.trend,
          fieldId: field.id,
        });
      }
    }
  }

  return cells;
}

/** Build an O(1) lookup Map from id → cell */
export function buildCellMap(cells: GridCell[]): Map<string, GridCell> {
  return new Map(cells.map(c => [c.id, c]));
}

/** Find the cell at an SVG point (O(1) using grid math) */
export function findCellAt(
  svgX: number,
  svgY: number,
  fieldRects: FieldRect[],
  cellMap: Map<string, GridCell>,
  cellSize: number,
): GridCell | null {
  for (const f of fieldRects) {
    if (svgX >= f.xMin && svgX < f.xMax && svgY >= f.yMin && svgY < f.yMax) {
      const col = Math.floor((svgX - f.xMin) / cellSize);
      const row = Math.floor((svgY - f.yMin) / cellSize);
      return cellMap.get(`${f.id}-${col}-${row}`) ?? null;
    }
  }
  return null;
}

/** Convert a React mouse event to SVG coordinates */
export function toSvgPoint(
  e: React.MouseEvent,
  svgEl: SVGSVGElement | null,
  vbWidth: number,
  vbHeight: number,
): { svgX: number; svgY: number } | null {
  if (!svgEl) return null;
  const r = svgEl.getBoundingClientRect();
  return {
    svgX: ((e.clientX - r.left) / r.width) * vbWidth,
    svgY: ((e.clientY - r.top) / r.height) * vbHeight,
  };
}

// ─── Color helpers ────────────────────────────────────────────────────────────

export function cellFill(pct: number): { fill: string; opacity: number } {
  if (pct >= 130) return { fill: "#7f1d1d", opacity: 0.86 };
  if (pct >= 100) return { fill: "#dc2626", opacity: 0.78 };
  if (pct >= 70)  return { fill: "#f97316", opacity: 0.70 };
  if (pct >= 40)  return { fill: "#eab308", opacity: 0.64 };
  return               { fill: "#22c55e",  opacity: 0.52 };
}

export function riskLabel(pct: number): string {
  if (pct >= 130) return "Critical";
  if (pct >= 100) return "High";
  if (pct >= 70)  return "Alert";
  if (pct >= 40)  return "Watch";
  return "Low";
}

export function riskColor(pct: number): string {
  if (pct >= 130) return "#ef4444";
  if (pct >= 100) return "#f97316";
  if (pct >= 70)  return "#eab308";
  if (pct >= 40)  return "#84cc16";
  return "#22c55e";
}

export function actionLabel(pct: number): string {
  if (pct >= 130) return "Intervene Now";
  if (pct >= 100) return "Prepare Spray";
  if (pct >= 70)  return "Prepare";
  if (pct >= 40)  return "Monitor Closely";
  return "Monitor";
}

export function riskBadgeCls(pct: number): string {
  if (pct >= 130) return "bg-red-950/30 text-red-400 border-red-800";
  if (pct >= 100) return "bg-red-100 text-red-700 border-red-300";
  if (pct >= 70)  return "bg-orange-100 text-orange-700 border-orange-300";
  if (pct >= 40)  return "bg-yellow-100 text-yellow-700 border-yellow-300";
  return "bg-green-100 text-green-700 border-green-300";
}
