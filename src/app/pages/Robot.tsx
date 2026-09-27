import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import {
  Battery, Wifi, Radio, MapPin, Camera, Zap, Wind, Clock, ChevronRight,
  Bot, Maximize2, Download, Activity, CheckCircle, AlertTriangle,
  RefreshCw, X,
} from "lucide-react";
import uvTrapPhoto from "../../imports/image-4.png";
import pheroTrapPhoto from "../../imports/image-5.png";
import pheroTrapPhoto2 from "../../imports/image-6.png";

// ─── Types ────────────────────────────────────────────────────────────────────
type CameraId = "front" | "uv" | "phero";
type FanSpeed = "low" | "medium" | "high";
type CmdStatus = "ready" | "sending" | "active" | "error";

// ─── Wavelength definitions ───────────────────────────────────────────────────
const WAVELENGTHS = [
  { id: "365", label: "UV-A 365",  nm: 365, hue: "#6d28d9", activeBg: "bg-violet-700 border-violet-500 text-white", inactiveBg: "bg-white border-gray-200 text-gray-600" },
  { id: "385", label: "385 nm",    nm: 385, hue: "#7c3aed", activeBg: "bg-violet-600 border-violet-400 text-white", inactiveBg: "bg-white border-gray-200 text-gray-600" },
  { id: "395", label: "395 nm",    nm: 395, hue: "#8b5cf6", activeBg: "bg-violet-500 border-violet-300 text-white", inactiveBg: "bg-white border-gray-200 text-gray-600" },
  { id: "450", label: "Blue 450",  nm: 450, hue: "#1d4ed8", activeBg: "bg-blue-700 border-blue-500 text-white",     inactiveBg: "bg-white border-gray-200 text-gray-600" },
  { id: "525", label: "Green 525", nm: 525, hue: "#15803d", activeBg: "bg-green-700 border-green-500 text-white",   inactiveBg: "bg-white border-gray-200 text-gray-600" },
  { id: "590", label: "Amber 590", nm: 590, hue: "#b45309", activeBg: "bg-amber-600 border-amber-400 text-white",   inactiveBg: "bg-white border-gray-200 text-gray-600" },
];



// ─── Camera views ─────────────────────────────────────────────────────────────

/** Front Navigation Camera — real blueberry orchard row image with nav HUD */
function FrontCameraView({ ts }: { ts: string }) {
  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden" style={{ background: "#1a2a18" }}>
      {/* Blueberry orchard forward-facing row photo */}
      <img
        src="https://images.unsplash.com/photo-1705364292288-a0288f9047d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlYmVycnklMjBvcmNoYXJkJTIwYWlzbGUlMjBjb3JyaWRvciUyMGJldHdlZW4lMjBidXNoZXN8ZW58MXx8fHwxNzc3OTUyMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Front navigation camera — blueberry orchard row"
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.85) saturate(0.80)" }}
      />

      {/* Edge vignette for display realism */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Navigation guide overlay — SVG row-path lines + crosshair */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 640 360"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Row corridor guide */}
        <path
          d="M 200,360 L 305,178 L 320,160 L 335,178 L 440,360"
          fill="none"
          stroke="rgba(34,197,94,0.40)"
          strokeWidth="1.8"
          strokeDasharray="13 9"
        />
        {/* Soft horizon line */}
        <line x1="90" y1="163" x2="550" y2="163" stroke="rgba(34,197,94,0.18)" strokeWidth="0.8" />
        {/* Crosshair at vanishing point */}
        <line x1="305" y1="160" x2="335" y2="160" stroke="rgba(34,197,94,0.65)" strokeWidth="1.5" />
        <line x1="320" y1="145" x2="320" y2="175" stroke="rgba(34,197,94,0.65)" strokeWidth="1.5" />
        <circle cx="320" cy="160" r="22" fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="1.2" />
        <circle cx="320" cy="160" r="5"  fill="none" stroke="rgba(34,197,94,0.50)" strokeWidth="1.0" />
      </svg>

      {/* HUD — top-left: LIVE badge + camera name + timestamp */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 bg-black/62 rounded px-2 py-1 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-[10px] text-green-400 font-mono font-bold tracking-wide">LIVE</span>
          <span className="text-[9px] text-white/70 font-mono ml-0.5">Front Navigation Camera</span>
        </div>
        <div className="bg-black/50 rounded px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[8.5px] text-white/55 font-mono">{ts} &nbsp;&nbsp; Field A · Zone 3</span>
        </div>
      </div>

      {/* HUD — top-right: signal */}
      <div className="absolute top-2 right-2 bg-black/58 rounded px-2 py-1 backdrop-blur-sm">
        <span className="text-[8px] text-green-400 font-mono tracking-wide">ONLINE</span>
      </div>

      {/* HUD — bottom-left: speed / row */}
      <div className="absolute bottom-2 left-2 bg-black/55 rounded px-2 py-0.5 backdrop-blur-sm">
        <span className="text-[8px] text-white/55 font-mono">0.4 m/s &nbsp; Row 8 / 12</span>
      </div>

      {/* HUD — bottom-right: GPS */}
      <div className="absolute bottom-2 right-2 bg-black/55 rounded px-2 py-0.5 backdrop-blur-sm">
        <span className="text-[8px] text-white/55 font-mono">49°28.21′N &nbsp;119°35.87′W</span>
      </div>
    </div>
  );
}

/** UV Trap Internal Camera — real photo with detection HUD overlay */
function UVTrapView({ ts }: { ts: string }) {
  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden bg-gray-950">

      {/* Real trap photo — moth inside white cylinder */}
      <img
        src={uvTrapPhoto}
        alt="UV trap interior — pest detected"
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.92) saturate(0.88)" }}
      />

      {/* Subtle violet UV tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(76,29,149,0.12)", mixBlendMode: "normal" }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.52) 100%)" }}
      />

      {/* Scan-line texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(80,0,160,0.035) 6px, rgba(80,0,160,0.035) 7px)" }}
      />

      {/* ── Detection bounding box — positioned over the moth ── */}
      {/* The moth sits in the lower-left quadrant of the cylinder at ~28–52% x, 57–80% y */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "26%", top: "55%", width: "26%", height: "22%" }}
      >
        {/* Animated corner brackets instead of full rect — more HUD-like */}
        {/* Top-left */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-400" style={{ borderRadius: "2px 0 0 0" }} />
        {/* Top-right */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-400" style={{ borderRadius: "0 2px 0 0" }} />
        {/* Bottom-left */}
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-400" style={{ borderRadius: "0 0 0 2px" }} />
        {/* Bottom-right */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-400" style={{ borderRadius: "0 0 2px 0" }} />

        {/* Label above box */}
        <div
          className="absolute -top-6 left-0 flex items-center gap-1.5 bg-orange-500/90 backdrop-blur-sm rounded px-1.5 py-0.5"
          style={{ whiteSpace: "nowrap" }}
        >
          <span className="text-white text-[8.5px] font-mono font-bold">Codling Moth</span>
          <span className="text-orange-100 text-[8px] font-mono">94%</span>
        </div>

        {/* Crosshair at center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3 h-px bg-orange-400/70" />
          <div className="absolute w-px h-3 bg-orange-400/70" />
        </div>
      </div>

      {/* ── HUD: top-left — LIVE badge + timestamp ── */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 bg-black/65 rounded px-2 py-1 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" style={{ animation: "pulse 1.4s infinite" }} />
          <span className="text-[10px] text-violet-300 font-mono font-bold tracking-wide">LIVE · UV</span>
        </div>
        <div className="bg-black/52 rounded px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[8.5px] text-violet-200/55 font-mono">{ts} &nbsp;&nbsp; 3 insects</span>
        </div>
      </div>

      {/* ── HUD: top-right — UV ACTIVE warning ── */}
      <div className="absolute top-2 right-2 bg-purple-900/72 border border-purple-500/45 rounded px-2 py-1 backdrop-blur-sm">
        <span className="text-[8px] text-yellow-400 font-mono">⚠ UV ACTIVE — Avoid direct exposure</span>
      </div>

      {/* ── HUD: bottom-left — catch count ── */}
      <div className="absolute bottom-2 left-2 bg-black/65 rounded px-2.5 py-1.5 backdrop-blur-sm">
        <p className="text-[8.5px] text-violet-300/70 font-mono leading-none">Caught:</p>
        <p className="text-[11px] text-violet-300 font-mono font-bold leading-tight">7 insects</p>
      </div>

      {/* ── HUD: bottom-right — wavelength active ── */}
      <div className="absolute bottom-2 right-2 bg-black/55 rounded px-2 py-1 backdrop-blur-sm">
        <span className="text-[8px] text-violet-300/70 font-mono">365 nm &nbsp;·&nbsp; 395 nm</span>
      </div>

      {/* ── Camera corner brackets ── */}
      <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-violet-400/40" />
      <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-violet-400/40" />
      <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-violet-400/40" />
      <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-violet-400/40" />
    </div>
  );
}

/** Pheromone Trap Internal Camera — real photo with detection HUD overlay */
function PheromoneView({ ts }: { ts: string }) {
  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden bg-gray-950">

      {/* Real pheromone trap photo */}
      <img
        src={pheroTrapPhoto}
        alt="Pheromone trap interior — pest detected"
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.90) saturate(0.85)" }}
      />

      {/* Warm amber tint overlay — pheromone trap feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(120,53,15,0.10)", mixBlendMode: "normal" }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Scan-line texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(120,60,0,0.03) 6px, rgba(120,60,0,0.03) 7px)" }}
      />

      {/* ── Detection bounding box ── */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "38%", top: "42%", width: "24%", height: "20%" }}
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400" style={{ borderRadius: "2px 0 0 0" }} />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400" style={{ borderRadius: "0 2px 0 0" }} />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400" style={{ borderRadius: "0 0 0 2px" }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400" style={{ borderRadius: "0 0 2px 0" }} />
        <div
          className="absolute -top-6 left-0 flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-sm rounded px-1.5 py-0.5"
          style={{ whiteSpace: "nowrap" }}
        >
          <span className="text-white text-[8.5px] font-mono font-bold">Japanese Beetle</span>
          <span className="text-amber-100 text-[8px] font-mono">91%</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3 h-px bg-amber-400/70" />
          <div className="absolute w-px h-3 bg-amber-400/70" />
        </div>
      </div>

      {/* ── HUD: top-left ── */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 bg-black/65 rounded px-2 py-1 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" style={{ animation: "pulse 1.6s infinite" }} />
          <span className="text-[10px] text-amber-300 font-mono font-bold tracking-wide">LIVE · Phero</span>
        </div>
        <div className="bg-black/52 rounded px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[8.5px] text-amber-200/55 font-mono">{ts} &nbsp;&nbsp; 9 trapped</span>
        </div>
      </div>

      {/* ── HUD: top-right ── */}
      <div className="absolute top-2 right-2 bg-amber-950/72 border border-amber-700/45 rounded px-2 py-1 backdrop-blur-sm">
        <span className="text-[8px] text-amber-400 font-mono">⚠ Pheromone lure active</span>
      </div>

      {/* ── HUD: bottom-left ── */}
      <div className="absolute bottom-2 left-2 bg-black/65 rounded px-2.5 py-1.5 backdrop-blur-sm">
        <p className="text-[8.5px] text-amber-300/70 font-mono leading-none">Caught:</p>
        <p className="text-[11px] text-amber-300 font-mono font-bold leading-tight">9 insects</p>
      </div>

      {/* ── HUD: bottom-right ── */}
      <div className="absolute bottom-2 right-2 bg-black/55 rounded px-2 py-1 backdrop-blur-sm">
        <span className="text-[8px] text-amber-300/70 font-mono">Lure age: 18 days</span>
      </div>

      {/* ── Camera corner brackets ── */}
      <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-amber-400/40" />
      <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-amber-400/40" />
      <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-amber-400/40" />
      <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-amber-400/40" />
    </div>
  );
}



// ─── Fan & Suction Schematic ──────────────────────────────────────────────────
/**
 * Simple, clear schematic showing:
 * - Trap body in the center
 * - Directional airflow arrows converging inward
 * - Animated dashes when ON, static dotted when OFF
 * - Speed-dependent animation rate
 */
function AirflowDiagram({ fanOn, speed }: { fanOn: boolean; speed: FanSpeed }) {
  const animDur = speed === "high" ? "0.65s" : speed === "medium" ? "1.1s" : "1.9s";
  const stroke  = fanOn ? "#3b82f6" : "#cbd5e1";
  const opacity = fanOn ? 0.80 : 0.35;

  // 8 flow lines: top, bottom, left, right, 4 diagonals
  const lines = [
    { x1: 110, y1:  6, x2: 110, y2: 44 },   // top
    { x1: 110, y1: 94, x2: 110, y2: 56 },   // bottom
    { x1:  10, y1: 50, x2:  68, y2: 50 },   // left
    { x1: 210, y1: 50, x2: 152, y2: 50 },   // right
    { x1:  18, y1: 12, x2:  70, y2: 44 },   // top-left
    { x1: 202, y1: 12, x2: 150, y2: 44 },   // top-right
    { x1:  18, y1: 88, x2:  70, y2: 56 },   // bottom-left
    { x1: 202, y1: 88, x2: 150, y2: 56 },   // bottom-right
  ];

  return (
    <svg viewBox="0 0 220 100" className="w-full" style={{ maxHeight: 110 }}>
      <defs>
        <marker id="fan-arr" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
          <polygon
            points="0,0.5 6.5,3.5 0,6.5"
            fill={fanOn ? "#3b82f6" : "#9ca3af"}
            opacity={fanOn ? "0.90" : "0.40"}
          />
        </marker>
        <radialGradient id="trap-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor={fanOn ? "#dbeafe" : "#f8fafc"} />
          <stop offset="100%" stopColor={fanOn ? "#bfdbfe" : "#f1f5f9"} />
        </radialGradient>
      </defs>

      {/* Airflow lines — 8 directions converging toward trap */}
      {lines.map(({ x1, y1, x2, y2 }, i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={stroke}
          strokeWidth={fanOn ? (i < 4 ? 2.0 : 1.5) : 1.2}
          strokeDasharray={fanOn ? "5 3" : "3 5"}
          markerEnd="url(#fan-arr)"
          opacity={fanOn ? (i < 4 ? opacity : opacity * 0.75) : 0.30}
        >
          {fanOn && (
            <animate
              attributeName="stroke-dashoffset"
              from="16" to="0"
              dur={i < 4 ? animDur : `${parseFloat(animDur) * 1.15}s`}
              repeatCount="indefinite"
            />
          )}
        </line>
      ))}

      {/* Trap body — rounded rectangle */}
      <rect
        x="68" y="25" width="84" height="50" rx="8"
        fill="url(#trap-fill)"
        stroke={fanOn ? "#3b82f6" : "#cbd5e1"}
        strokeWidth="2"
      />

      {/* Fan intake ring inside trap */}
      <circle
        cx="110" cy="43" r="9"
        fill={fanOn ? "#eff6ff" : "#f1f5f9"}
        stroke={fanOn ? "#93c5fd" : "#e2e8f0"}
        strokeWidth="1.5"
      />
      {/* Fan cross-vanes */}
      <line x1="110" y1="36" x2="110" y2="50" stroke={fanOn ? "#60a5fa" : "#cbd5e1"} strokeWidth="1.5" opacity={fanOn ? 0.9 : 0.4} />
      <line x1="103" y1="43" x2="117" y2="43" stroke={fanOn ? "#60a5fa" : "#cbd5e1"} strokeWidth="1.5" opacity={fanOn ? 0.9 : 0.4} />
      <line x1="105" y1="38" x2="115" y2="48" stroke={fanOn ? "#93c5fd" : "#e2e8f0"} strokeWidth="1.0" opacity={fanOn ? 0.7 : 0.3} />
      <line x1="115" y1="38" x2="105" y2="48" stroke={fanOn ? "#93c5fd" : "#e2e8f0"} strokeWidth="1.0" opacity={fanOn ? 0.7 : 0.3} />

      {/* TRAP label + status */}
      <text x="110" y="63" textAnchor="middle" fontSize="8.5" fontWeight="700"
        fill={fanOn ? "#1d4ed8" : "#94a3b8"}>TRAP</text>
      <text x="110" y="72" textAnchor="middle" fontSize="7"
        fill={fanOn ? "#3b82f6" : "#94a3b8"}>
        {fanOn ? "● SUCTION" : "○ OFF"}
      </text>
    </svg>
  );
}

// ─── Mini location map SVG ────────────────────────────────────────────────────
function MiniLocationMap() {
  return (
    <svg viewBox="0 0 280 140" className="w-full" style={{ background: "#2e4a28" }}>
      <defs>
        <linearGradient id="ml-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d6535" />
          <stop offset="100%" stopColor="#3a5e30" />
        </linearGradient>
        <linearGradient id="ml-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4ac7a" />
          <stop offset="100%" stopColor="#a8935a" />
        </linearGradient>
      </defs>
      <rect width="280" height="140" fill="url(#ml-bg)" />
      {Array.from({ length: 17 }, (_, i) => (
        <line key={`r-${i}`} x1="0" y1={4 + i * 8} x2="280" y2={4 + i * 8}
          stroke="rgba(20,60,12,0.18)" strokeWidth="1" />
      ))}
      <rect x="126" y="0" width="10" height="140" fill="url(#ml-road)" opacity="0.90" />
      <line x1="131" y1="0" x2="131" y2="140" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" strokeDasharray="6 4" />
      <polygon points="4,4 124,3 124,134 4,136"
        fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
      <polygon points="138,3 274,2 274,134 138,136"
        fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
      <line x1="64" y1="3" x2="64" y2="134" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="4" y1="70" x2="124" y2="70" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="138" y1="70" x2="274" y2="70" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" strokeDasharray="4 3" />
      {[
        { x: 34, y: 37, label: "A·Z1" },
        { x: 94, y: 37, label: "A·Z3", warn: true },
        { x: 34, y: 105, label: "A·Z2" },
        { x: 94, y: 105, label: "A·Z4" },
        { x: 206, y: 37, label: "B·Z2" },
      ].map(z => (
        <text key={z.label} x={z.x} y={z.y} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.75)" fontWeight="700">
          {z.label}{z.warn ? " ⚠" : ""}
        </text>
      ))}
      <text x="64"  y="14" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.70)" fontWeight="600">Field A</text>
      <text x="206" y="13" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.70)" fontWeight="600">Field B</text>
      {/* Robot pulse ring */}
      <circle cx="94" cy="36" r="4" fill="none" stroke="#3b82f6" strokeWidth="1.0" opacity="0">
        <animate attributeName="r"       from="4"    to="14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.65" to="0"  dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="94" cy="36" r="6" fill="#2563eb" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" />
      <circle cx="94" cy="36" r="2.5" fill="white" />
      <rect x="102" y="28" width="50" height="12" rx="2.5" fill="rgba(37,99,235,0.90)" />
      <text x="127" y="38" textAnchor="middle" fontSize="7" fill="white" fontFamily="monospace">Ramis-01</text>
      <text x="4" y="138" fontSize="6" fill="rgba(255,255,255,0.38)">49°28.21′N · 119°35.87′W</text>
    </svg>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CmdStatus }) {
  const cfg = {
    ready:   { cls: "bg-green-50 border-green-200 text-green-700",   dot: "bg-green-500",            label: "Ready"    },
    sending: { cls: "bg-yellow-50 border-yellow-200 text-yellow-700", dot: "bg-yellow-400 animate-pulse", label: "Sending…" },
    active:  { cls: "bg-blue-50 border-blue-200 text-blue-700",      dot: "bg-blue-500 animate-pulse", label: "Active"   },
    error:   { cls: "bg-red-50 border-red-200 text-red-700",         dot: "bg-red-500",              label: "Error"    },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function Robot() {
  const [activeCamera, setActiveCamera] = useState<CameraId>("front");
  const [lampOn, setLampOn]             = useState(true);
  const [activeWLs, setActiveWLs]       = useState<string[]>(["365", "395"]);
  const [intensity, setIntensity]       = useState(60);
  const [lampStatus, setLampStatus]     = useState<CmdStatus>("active");
  const [fanOn, setFanOn]               = useState(true);
  const [fanSpeed, setFanSpeed]         = useState<FanSpeed>("medium");
  const [fanStatus, setFanStatus]       = useState<CmdStatus>("active");
  const [ts, setTs]                     = useState("14:35:22");
  const [snapshotFlash, setSnapshotFlash] = useState(false);

  // Live timestamp
  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      setTs(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const toggleWL = useCallback((id: string) => {
    setLampStatus("sending");
    setTimeout(() => setLampStatus("active"), 900);
    setActiveWLs(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  }, []);

  const handleLampToggle = (v: boolean) => {
    setLampOn(v);
    setLampStatus("sending");
    setTimeout(() => setLampStatus(v ? "active" : "ready"), 900);
    if (!v) setActiveWLs([]);
  };

  const handleFanToggle = (v: boolean) => {
    setFanOn(v);
    setFanStatus("sending");
    setTimeout(() => setFanStatus(v ? "active" : "ready"), 900);
  };

  const handleFanSpeed = (s: FanSpeed) => {
    setFanSpeed(s);
    setFanStatus("sending");
    setTimeout(() => setFanStatus("active"), 700);
  };

  const handleSnapshot = () => {
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 280);
  };

  const cameras = [
    { id: "front" as CameraId, label: "Front Camera",          short: "Front Nav",  icon: "🎥", desc: "Forward navigation" },
    { id: "uv"    as CameraId, label: "UV Trap Camera",        short: "UV Trap",    icon: "🔵", desc: "UV trap interior"   },
    { id: "phero" as CameraId, label: "Pheromone Trap Camera", short: "Phero Trap", icon: "🟡", desc: "Phero trap interior" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══ STATUS STRIP ══ */}
      <div className="bg-gray-950 border-b border-gray-800 px-4 md:px-6 py-2">
        <div className="max-w-[1440px] mx-auto flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <span className="text-[11px] text-white">Ramis-01</span>
          </div>
          <span className="text-gray-600 hidden sm:block">|</span>
          <span className="flex items-center gap-1.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
            <span className="text-blue-400">Active · Monitoring</span>
          </span>
          <span className="text-gray-600 hidden sm:block">|</span>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <MapPin className="w-3 h-3 text-gray-500" />
            Field A – Zone 3
          </div>
          {[
            { icon: Battery, val: "78%",          color: "text-green-400" },
            { icon: Wifi,    val: "Excellent",     color: "text-green-400" },
            { icon: Radio,   val: "86% coverage",  color: "text-gray-400"  },
          ].map(({ icon: Icon, val, color }) => (
            <div key={val} className="flex items-center gap-1 text-[10px]">
              <Icon className={`w-3 h-3 ${color} flex-shrink-0`} />
              <span className={color}>{val}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Clock className="w-3 h-3" />
            Last cmd: Trap scan 14:32
          </div>
          <div className="ml-auto">
            <Link to="/heatmap">
              <Button variant="outline" size="sm"
                className="h-6 text-[10px] gap-1 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 bg-transparent">
                Full Map <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 items-start">

          {/* ════ LEFT COLUMN ════ */}
          <div className="space-y-3">

            {/* ── Main Camera Viewer ── */}
            <Card className="p-0 overflow-hidden shadow-sm">
              <div className="px-3 py-2 border-b border-gray-100 bg-white flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[11px] text-gray-700">
                  {cameras.find(c => c.id === activeCamera)?.label}
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  <button onClick={handleSnapshot}
                    className="text-[10px] text-gray-500 hover:text-gray-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                    <Download className="w-3 h-3" /> Snapshot
                  </button>
                  <button className="text-[10px] text-gray-500 hover:text-gray-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                    <Maximize2 className="w-3 h-3" /> Fullscreen
                  </button>
                </div>
              </div>

              {/* Viewport */}
              <div className="relative bg-black" style={{ aspectRatio: "16/9", maxHeight: 440 }}>
                {snapshotFlash && (
                  <div className="absolute inset-0 bg-white z-20" style={{ opacity: 0.85 }} />
                )}
                {activeCamera === "front" && <FrontCameraView ts={ts} />}
                {activeCamera === "uv"    && <UVTrapView ts={ts} />}
                {activeCamera === "phero" && <PheromoneView ts={ts} />}
              </div>
            </Card>

            {/* ── Camera Selector ── */}
            <Card className="px-3 py-2.5">
              <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-2">Select Camera Source</p>
              <div className="grid grid-cols-3 gap-2">
                {cameras.map(cam => (
                  <button key={cam.id} onClick={() => setActiveCamera(cam.id)}
                    className={`rounded-lg px-3 py-2.5 border text-left transition-all ${
                      activeCamera === cam.id
                        ? "bg-gray-900 border-gray-700 shadow-md"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base leading-none">{cam.icon}</span>
                      {activeCamera === cam.id && (
                        <span className="flex items-center gap-0.5 text-[8px] text-green-400 bg-green-900/40 border border-green-800 px-1.5 py-px rounded-full ml-auto">
                          <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" /> LIVE
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] leading-tight ${activeCamera === cam.id ? "text-white" : "text-gray-700"}`}>
                      {cam.short}
                    </p>
                    <p className={`text-[8.5px] mt-0.5 leading-tight text-gray-400`}>{cam.desc}</p>
                  </button>
                ))}
              </div>
            </Card>

          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="space-y-2.5">

            {/* ── Robot Location Card ── */}
            <Card className="p-0 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] text-gray-700">Live Location</span>
                </div>
                <Link to="/heatmap" className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5">
                  Full map <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <MiniLocationMap />
              <div className="px-3 py-2 bg-white border-t border-gray-100">
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Field",    value: "Field A – Zone 3"  },
                    { label: "Status",   value: "Row-scan active"   },
                    { label: "Coverage", value: "86% · Row 8/12"    },
                    { label: "ETA",      value: "~22 min"           },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded px-2 py-1">
                      <p className="text-[8px] text-gray-400 leading-none">{s.label}</p>
                      <p className="text-[10px] text-gray-800 leading-snug mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ── Lamp Control Card ── */}
            <Card className="p-0 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap className={`w-3.5 h-3.5 ${lampOn ? "text-violet-500" : "text-gray-400"}`} />
                    <div>
                      <p className="text-[11px] text-gray-700">Lamp Control</p>
                      <p className="text-[9px] text-gray-400 leading-none">Multi-wavelength UV &amp; visible</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={lampStatus} />
                    <Switch checked={lampOn} onCheckedChange={handleLampToggle} id="sw-lamp" />
                  </div>
                </div>
              </div>

              <div className={`px-3 py-2.5 transition-opacity ${!lampOn ? "opacity-40 pointer-events-none" : ""}`}>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-2">Wavelengths</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {WAVELENGTHS.map(wl => {
                    const isActive = activeWLs.includes(wl.id);
                    return (
                      <button key={wl.id} onClick={() => toggleWL(wl.id)}
                        className={`px-2 py-1.5 rounded-lg border text-center transition-all ${
                          isActive ? wl.activeBg : wl.inactiveBg
                        }`}>
                        <p className="text-[8px] leading-none mb-0.5" style={isActive ? {} : { color: wl.hue }}>
                          {wl.nm} nm
                        </p>
                        <p className={`text-[9px] leading-tight ${isActive ? "text-white" : "text-gray-600"}`}>
                          {wl.label.split(" ")[0]}
                        </p>
                        {isActive && <p className="text-[7px] mt-0.5 opacity-80 leading-none">ON</p>}
                      </button>
                    );
                  })}
                </div>

                {activeWLs.some(w => ["365","385","395"].includes(w)) && (
                  <div className="mt-2 flex items-center gap-1.5 text-[9px] text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    Avoid human exposure during UV operation
                  </div>
                )}

                {/* Intensity slider */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Intensity</p>
                    <span className="text-[11px] text-gray-800">{intensity}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={intensity}
                    onChange={e => setIntensity(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #7c3aed ${intensity}%, #e5e7eb ${intensity}%)`,
                      accentColor: "#7c3aed",
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] text-gray-400">0%</span>
                    <span className="text-[8px] text-gray-400">50%</span>
                    <span className="text-[8px] text-gray-400">100%</span>
                  </div>
                </div>

                {/* Active wavelength chips */}
                {activeWLs.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {activeWLs.map(id => {
                      const wl = WAVELENGTHS.find(w => w.id === id)!;
                      return (
                        <span key={id} className={`text-[8px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${wl.activeBg}`}>
                          {wl.label}
                          <button onClick={() => toggleWL(id)} className="hover:opacity-70">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            {/* ── Fan & Suction Card ── */}
            <Card className="p-0 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Wind className={`w-3.5 h-3.5 ${fanOn ? "text-blue-500" : "text-gray-400"}`} />
                    <div>
                      <p className="text-[11px] text-gray-700">Fan &amp; Suction</p>
                      <p className="text-[9px] text-gray-400 leading-none">Insect capture system</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={fanStatus} />
                    <Switch checked={fanOn} onCheckedChange={handleFanToggle} id="sw-fan" />
                  </div>
                </div>
              </div>

              <div className="px-3 py-2.5">
                {/* Airflow schematic */}
                <div className="flex justify-center mb-1">
                  <div className="w-full max-w-[220px]">
                    <AirflowDiagram fanOn={fanOn} speed={fanSpeed} />
                  </div>
                </div>

                {/* Status description */}
                <p className={`text-[9px] text-center mb-2.5 leading-snug transition-colors ${fanOn ? "text-blue-600" : "text-gray-400"}`}>
                  {fanOn
                    ? "Suction active — insects drawn into trap chamber"
                    : "Fan off — suction not active"}
                </p>

                {/* Speed selector */}
                <div className={`transition-opacity ${!fanOn ? "opacity-40 pointer-events-none" : ""}`}>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">Suction Power</p>
                  <div className="flex gap-1.5">
                    {(["low", "medium", "high"] as FanSpeed[]).map(s => (
                      <button key={s} onClick={() => handleFanSpeed(s)}
                        className={`flex-1 py-1.5 rounded-lg border text-[9px] capitalize transition-all ${
                          fanSpeed === s
                            ? s === "high"   ? "bg-blue-700 border-blue-600 text-white shadow-sm"
                            : s === "medium" ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                            :                  "bg-blue-500 border-blue-400 text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-1.5 mt-2">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1"
                      onClick={() => { setFanOn(true); setFanStatus("sending"); setTimeout(() => setFanStatus("active"), 900); }}>
                      <Activity className="w-3 h-3" /> Run 60 sec
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1"
                      onClick={() => { setFanStatus("sending"); setTimeout(() => setFanStatus("ready"), 1800); }}>
                      <RefreshCw className="w-3 h-3" /> Clean trap
                    </Button>
                  </div>
                </div>

                {/* Status row */}
                <div className={`mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[9px] ${fanOn ? "text-blue-600" : "text-gray-400"}`}>
                  <div className="flex items-center gap-1">
                    {fanOn
                      ? <CheckCircle className="w-3 h-3" />
                      : <Wind className="w-3 h-3" />}
                    <span>{fanOn ? `Running · ${fanSpeed.charAt(0).toUpperCase() + fanSpeed.slice(1)} power` : "System ready"}</span>
                  </div>
                  {fanOn && (
                    <span className="text-gray-400">
                      {fanSpeed === "high" ? "~2400 RPM" : fanSpeed === "medium" ? "~1600 RPM" : "~900 RPM"}
                    </span>
                  )}
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}