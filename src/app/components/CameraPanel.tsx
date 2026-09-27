import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Maximize2, Camera, Video, VideoOff, Bug,
  ChevronLeft, ChevronRight, Wifi, Signal,
} from "lucide-react";
import { cn } from "./ui/utils";

// ─── Camera definitions ───────────────────────────────────────────────────────
// img: null  →  use the built-in SVG feed (trap camera)
// Future integration: swap img with an RTSP / WebRTC stream URL
type CamId = "front" | "left" | "right" | "rear" | "trap";

interface Detection {
  x: number;  // % from left
  y: number;  // % from top
  w: number;  // % width
  h: number;  // % height
  pest: string;
  confidence: number;
}

interface CamDef {
  id: CamId;
  label: string;
  short: string;
  img: string | null;
  imgPosition?: string;   // CSS object-position
  detections: Detection[];
}

const CAMERAS: CamDef[] = [
  {
    id: "front",
    label: "Front Camera",
    short: "FRONT",
    img: "https://images.unsplash.com/photo-1568765477949-f5a1696a26e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMG9yY2hhcmQlMjByb3clMjB0cmVlcyUyMHBlcnNwZWN0aXZlJTIwZ3JvdW5kJTIwbGV2ZWx8ZW58MXx8fHwxNzc0NzcwMDUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imgPosition: "center center",
    detections: [],
  },
  {
    id: "left",
    label: "Left Camera",
    short: "LEFT",
    img: "https://images.unsplash.com/photo-1722336476723-e8171ffe6c6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHRyZWUlMjBicmFuY2glMjBsZWF2ZXMlMjBjbG9zZSUyMHJvYm90JTIwZXllJTIwbGV2ZWx8ZW58MXx8fHwxNzc0NzcwMDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imgPosition: "center 40%",
    detections: [
      { x: 48, y: 35, w: 14, h: 18, pest: "Leafroller", confidence: 91 },
    ],
  },
  {
    id: "right",
    label: "Right Camera",
    short: "RIGHT",
    img: "https://images.unsplash.com/photo-1717980650436-a53a25ab86bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG9yY2hhcmQlMjB0cmVlcyUyMHNpZGUlMjB2aWV3JTIwYmV0d2VlbiUyMHJvd3N8ZW58MXx8fHwxNzc0NzcwMDU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imgPosition: "center 50%",
    detections: [],
  },
  {
    id: "rear",
    label: "Rear Camera",
    short: "REAR",
    img: "https://images.unsplash.com/photo-1620671146891-7ab300758b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoYXJkJTIwcGF0aCUyMHRyZWVzJTIwYmVoaW5kJTIwcmVjZWRpbmclMjBwZXJzcGVjdGl2ZXxlbnwxfHx8fDE3NzQ3NzAwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imgPosition: "center center",
    detections: [],
  },
  {
    id: "trap",
    label: "Trap Interior",
    short: "TRAP",
    img: null, // SVG-rendered
    detections: [
      { x: 29, y: 52, w: 12, h: 10, pest: "Codling Moth", confidence: 97 },
      { x: 50, y: 60, w: 11, h: 9,  pest: "Codling Moth", confidence: 94 },
      { x: 40, y: 42, w: 10, h: 10, pest: "Codling Moth", confidence: 89 },
    ],
  },
];

// ─── Trap interior SVG ────────────────────────────────────────────────────────
// Simulates an internal view of a transparent delta/box trap
// Structure: glass walls → UV lamp → light cone → sticky board → insects
function TrapInteriorFeed({ tick }: { tick: number }) {
  const glowPulse = 0.75 + Math.sin(tick * 0.12) * 0.1;
  const wingFlap  = Math.sin(tick * 0.5) * 3;

  return (
    <svg viewBox="0 0 640 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Background — deep inside-trap darkness */}
        <linearGradient id="trapBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#05050e" />
          <stop offset="100%" stopColor="#0a0c08" />
        </linearGradient>
        {/* UV lamp radial glow */}
        <radialGradient id="uvGlow" cx="50%" cy="0%" r="60%">
          <stop offset="0%"   stopColor="#c4b5fd" stopOpacity={glowPulse * 0.6} />
          <stop offset="35%"  stopColor="#7c3aed" stopOpacity={glowPulse * 0.18} />
          <stop offset="100%" stopColor="#000010" stopOpacity="0" />
        </radialGradient>
        {/* Light cone down from lamp */}
        <linearGradient id="lightCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e9d5ff" stopOpacity={glowPulse * 0.28} />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
        {/* Sticky board surface */}
        <linearGradient id="stickyBoard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c8a84b" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9a7c30" stopOpacity="0.75" />
        </linearGradient>
        {/* Glass reflection top */}
        <linearGradient id="glassReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {/* Left wall glass */}
        <linearGradient id="glassLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(200,210,255,0.12)" />
          <stop offset="100%" stopColor="rgba(200,210,255,0)" />
        </linearGradient>
        {/* Right wall glass */}
        <linearGradient id="glassRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%"   stopColor="rgba(200,210,255,0.12)" />
          <stop offset="100%" stopColor="rgba(200,210,255,0)" />
        </linearGradient>
        {/* Moth wing texture */}
        <radialGradient id="mothWing" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#4a3820" />
          <stop offset="100%" stopColor="#1a130a" />
        </radialGradient>
        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lampBloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Background ── */}
      <rect width="640" height="400" fill="url(#trapBg)" />

      {/* ── Trap glass enclosure walls ── */}
      {/* Left wall (angled, trapezoidal) */}
      <polygon points="80,0 200,0 200,400 0,400"
        fill="url(#glassLeft)" />
      <line x1="200" y1="0" x2="200" y2="400"
        stroke="rgba(180,200,255,0.25)" strokeWidth="1.5" />
      {/* Horizontal glass shelf lines (giving depth) */}
      <line x1="0"  y1="140" x2="200" y2="140" stroke="rgba(180,200,255,0.08)" strokeWidth="0.8" />
      <line x1="0"  y1="270" x2="200" y2="270" stroke="rgba(180,200,255,0.06)" strokeWidth="0.8" />

      {/* Right wall */}
      <polygon points="440,0 560,0 640,400 440,400"
        fill="url(#glassRight)" />
      <line x1="440" y1="0" x2="440" y2="400"
        stroke="rgba(180,200,255,0.25)" strokeWidth="1.5" />
      <line x1="440" y1="140" x2="640" y2="140" stroke="rgba(180,200,255,0.08)" strokeWidth="0.8" />
      <line x1="440" y1="270" x2="640" y2="270" stroke="rgba(180,200,255,0.06)" strokeWidth="0.8" />

      {/* Top glass ceiling reflection strip */}
      <rect x="0" y="0" width="640" height="28" fill="url(#glassReflect)" />
      <line x1="0" y1="0" x2="640" y2="0" stroke="rgba(220,230,255,0.3)" strokeWidth="1.5" />

      {/* ── UV lamp light cone ── */}
      <polygon points="280,0 360,0 520,400 120,400"
        fill="url(#lightCone)" />

      {/* ── UV Lamp bar at top ── */}
      {/* Ambient glow behind lamp */}
      <ellipse cx="320" cy="8" rx="160" ry="40" fill="url(#uvGlow)" filter="url(#lampBloom)" />
      {/* Lamp tube */}
      <rect x="210" y="2" width="220" height="12" rx="6"
        fill={`rgba(220,200,255,${glowPulse * 0.95})`}
        filter="url(#lampBloom)" />
      {/* Lamp highlight */}
      <rect x="212" y="3" width="218" height="4" rx="3"
        fill={`rgba(255,255,255,${glowPulse * 0.7})`} />
      {/* Lamp end caps */}
      <circle cx="210" cy="8" r="7" fill="rgba(160,140,200,0.6)" />
      <circle cx="430" cy="8" r="7" fill="rgba(160,140,200,0.6)" />
      {/* UV-A 365nm label */}
      <text x="320" y="9" textAnchor="middle" fontSize="6.5"
        fill={`rgba(230,220,255,${glowPulse * 0.9})`} letterSpacing="1.2"
        fontFamily="monospace">UV-A 365 nm</text>

      {/* ── Sticky board / floor ── */}
      <rect x="120" y="340" width="400" height="55" rx="4" fill="url(#stickyBoard)" />
      {/* Board grid lines */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <line key={`bg-h${i}`}
          x1="120" y1={344 + i * 7} x2="520" y2={344 + i * 7}
          stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <line key={`bg-v${i}`}
          x1={122 + i * 36} y1="340" x2={122 + i * 36} y2="395"
          stroke="rgba(0,0,0,0.10)" strokeWidth="0.5" />
      ))}
      {/* Board edge highlight */}
      <line x1="120" y1="340" x2="520" y2="340" stroke="rgba(220,180,80,0.5)" strokeWidth="1" />
      {/* Board sheen */}
      <rect x="120" y="340" width="400" height="12" rx="4"
        fill="rgba(255,240,160,0.08)" />

      {/* ── Insects on sticky board (moths caught) ── */}
      {/* Moth 1 — folded wings, near center-left */}
      <g transform="translate(192, 352)">
        {/* Body */}
        <ellipse cx="0" cy="0" rx="5" ry="9" fill="#2a1f10" />
        {/* Left wing (folded, triangular) */}
        <path d="M0,-6 L-18,2 L-12,12 L0,8 Z" fill="#3d2e18" opacity="0.92" />
        <path d="M0,-4 L-14,1 L-10,9 L0,6 Z" fill="#4a3820" opacity="0.6" />
        {/* Right wing */}
        <path d="M0,-6 L18,2 L12,12 L0,8 Z" fill="#3d2e18" opacity="0.92" />
        <path d="M0,-4 L14,1 L10,9 L0,6 Z" fill="#4a3820" opacity="0.6" />
        {/* Wing markings */}
        <ellipse cx="-9" cy="3" rx="3" ry="2" fill="rgba(220,180,100,0.2)" />
        <ellipse cx="9" cy="3" rx="3" ry="2" fill="rgba(220,180,100,0.2)" />
        {/* Antenna */}
        <line x1="0" y1="-9" x2="-6" y2="-16" stroke="#1a1208" strokeWidth="0.8" />
        <line x1="0" y1="-9" x2="6"  y2="-16" stroke="#1a1208" strokeWidth="0.8" />
      </g>

      {/* Moth 2 — slightly splayed, right of center */}
      <g transform="translate(322, 356) rotate(20)">
        <ellipse cx="0" cy="0" rx="4.5" ry="8" fill="#241a0d" />
        <path d="M0,-5 L-16,3 L-10,11 L0,7 Z" fill="#352818" opacity="0.9" />
        <path d="M0,-5 L16,3 L10,11 L0,7 Z"  fill="#352818" opacity="0.9" />
        <path d="M0,-3 L-12,2 L-8,8 L0,5 Z"  fill="#40311e" opacity="0.5" />
        <path d="M0,-3 L12,2 L8,8 L0,5 Z"   fill="#40311e" opacity="0.5" />
        <ellipse cx="-8" cy="4" rx="2.5" ry="1.8" fill="rgba(200,160,80,0.18)" />
        <ellipse cx="8" cy="4"  rx="2.5" ry="1.8" fill="rgba(200,160,80,0.18)" />
        <line x1="0" y1="-8" x2="-5" y2="-14" stroke="#1a1208" strokeWidth="0.7" />
        <line x1="0" y1="-8" x2="5"  y2="-14" stroke="#1a1208" strokeWidth="0.7" />
      </g>

      {/* Moth 3 — dead, wings spread flat on board */}
      <g transform="translate(260, 370)">
        <ellipse cx="0" cy="0" rx="4" ry="7" fill="#1e1608" />
        {/* Wings spread wide */}
        <path d="M0,-4 L-22,0 L-18,8 L0,5 Z"  fill="#2e2312" opacity="0.85" />
        <path d="M0,-4 L22,0 L18,8 L0,5 Z"   fill="#2e2312" opacity="0.85" />
        <path d="M0,-2 L-17,1 L-14,6 L0,4 Z" fill="#3c2f1a" opacity="0.5" />
        <path d="M0,-2 L17,1 L14,6 L0,4 Z"  fill="#3c2f1a" opacity="0.5" />
        <ellipse cx="-11" cy="2" rx="4" ry="2.2" fill="rgba(230,190,100,0.15)" />
        <ellipse cx="11"  cy="2" rx="4" ry="2.2" fill="rgba(230,190,100,0.15)" />
        <line x1="0" y1="-7" x2="-4" y2="-12" stroke="#140f05" strokeWidth="0.7" />
        <line x1="0" y1="-7" x2="4"  y2="-12" stroke="#140f05" strokeWidth="0.7" />
      </g>

      {/* Small stuck specks (other insects or debris) */}
      {[[155,360],[380,348],[420,367],[168,378],[450,355]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx={1.8} ry={1.2}
          fill="rgba(20,14,5,0.7)" />
      ))}

      {/* ── In-flight moth near UV lamp (attracted, wings flapping) ── */}
      <g transform={`translate(380, 120) rotate(${-15 + wingFlap})`}
        opacity="0.75">
        <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="#1e160a" />
        {/* Wings spread during flight */}
        <path d={`M0,-3 L${-14 + wingFlap},-8 L${-16 + wingFlap},4 L0,4 Z`}
          fill="#2d2210" opacity="0.8" />
        <path d={`M0,-3 L${14 - wingFlap},-8 L${16 - wingFlap},4 L0,4 Z`}
          fill="#2d2210" opacity="0.8" />
        <line x1="0" y1="-6" x2="-4" y2="-12" stroke="#10090300" strokeWidth="0.6" />
        <line x1="0" y1="-6" x2="4"  y2="-12" stroke="#10090300" strokeWidth="0.6" />
      </g>

      {/* ── Glass reflections (diagonal streaks) ── */}
      {/* Left pane */}
      <line x1="60" y1="20" x2="140" y2="200" stroke="rgba(200,220,255,0.06)" strokeWidth="8" strokeLinecap="round" />
      <line x1="40" y1="60" x2="100" y2="280" stroke="rgba(200,220,255,0.04)" strokeWidth="4" strokeLinecap="round" />
      {/* Right pane */}
      <line x1="580" y1="20" x2="500" y2="200" stroke="rgba(200,220,255,0.06)" strokeWidth="8" strokeLinecap="round" />
      <line x1="600" y1="60" x2="540" y2="280" stroke="rgba(200,220,255,0.04)" strokeWidth="4" strokeLinecap="round" />

      {/* ── Trap wall frame ── */}
      <rect x="0" y="0" width="640" height="400"
        fill="none" stroke="rgba(180,200,255,0.15)" strokeWidth="2" />

      {/* ── HUD: detection count ── */}
      <rect x="8" y="22" width="106" height="20" rx="3" fill="rgba(0,0,0,0.72)" />
      <circle cx="20" cy="32" r="4" fill="#f97316">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="29" y="36" fill="#f97316" fontSize="9" fontFamily="monospace" letterSpacing="0.5">
        3 DETECTIONS
      </text>

      {/* ── HUD: camera label ── */}
      <rect x="8" y="8" width="50" height="12" rx="2" fill="rgba(0,0,0,0.65)" />
      <text x="12" y="17" fill="rgba(255,255,255,0.75)" fontSize="8" fontFamily="monospace">TRAP</text>

      {/* ── Scale bar (mm scale) ── */}
      <g transform="translate(530, 380)">
        <line x1="0" y1="0" x2="40" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <line x1="40" y1="-3" x2="40" y2="3" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <text x="20" y="-5" textAnchor="middle" fontSize="7"
          fill="rgba(255,255,255,0.5)" fontFamily="monospace">10 mm</text>
      </g>
    </svg>
  );
}

// ─── Outdoor camera feed (photo-based) ────────────────────────────────────────
function OutdoorFeed({
  cam,
  tick,
  snapping,
  time,
}: {
  cam: CamDef;
  tick: number;
  snapping: boolean;
  time: Date;
}) {
  const scanY = ((tick * 0.4) % 85) + 5; // 5–90%

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden transition-all duration-75",
      snapping && "brightness-150"
    )}>
      {/* ── Photo background ── */}
      <img
        src={cam.img!}
        alt={cam.label}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: cam.imgPosition ?? "center" }}
        draggable={false}
      />

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.62) 100%)" }} />

      {/* ── Subtle color grade (security-cam tint) ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(20,30,10,0.15)", mixBlendMode: "multiply" }} />

      {/* ── Corner brackets (CCTV frame) ── */}
      {[
        { t: 8, l: 8 },   // top-left
        { t: 8, r: 8 },   // top-right
        { b: 8, l: 8 },   // bottom-left
        { b: 8, r: 8 },   // bottom-right
      ].map((pos, i) => {
        const h = pos.t !== undefined ? "top" : "bottom";
        const v = pos.l !== undefined ? "left" : "right";
        return (
          <div key={i} className="absolute pointer-events-none" style={{
            [h]: pos.t ?? pos.b,
            [v]: pos.l ?? pos.r,
            width: 20, height: 20,
            borderTopWidth:    (h === "top")    ? 2 : 0,
            borderBottomWidth: (h === "bottom") ? 2 : 0,
            borderLeftWidth:   (v === "left")   ? 2 : 0,
            borderRightWidth:  (v === "right")  ? 2 : 0,
            borderColor: "rgba(255,255,255,0.45)",
            borderStyle: "solid",
          }} />
        );
      })}

      {/* ── Horizontal scanline ── */}
      <div className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: `${scanY}%`,
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), rgba(255,255,255,0.12), rgba(255,255,255,0.08), transparent)",
        }} />

      {/* ── Detection bounding boxes ── */}
      {cam.detections.map((det, i) => (
        <div key={i} className="absolute pointer-events-none"
          style={{ left: `${det.x}%`, top: `${det.y}%`, width: `${det.w}%`, paddingTop: `${det.h}%` }}>
          {/* Corner marks */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-400" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-400" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-400" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-400" />
          {/* Label */}
          <div className="absolute left-0 text-nowrap"
            style={{ bottom: "calc(100% + 2px)" }}>
            <span className="text-[9px] bg-orange-500/90 text-white px-1 py-px rounded-sm leading-none font-mono">
              {det.pest} {det.confidence}%
            </span>
          </div>
        </div>
      ))}

      {/* ── Top-left: LIVE + timestamp ── */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1 bg-red-600/90 rounded px-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white">
          </span>
          <span className="text-white text-[9px] font-mono tracking-widest">LIVE</span>
        </div>
        <div className="bg-black/60 rounded px-1.5 py-0.5">
          <span className="text-[9px] text-gray-200 font-mono">
            {time.toLocaleTimeString("en-CA", { hour12: false })}
          </span>
        </div>
      </div>

      {/* ── Top-right: camera label + signal ── */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 pointer-events-none">
        <div className="bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1">
          <Signal className="w-2.5 h-2.5 text-green-400" />
          <span className="text-[9px] text-green-300 font-mono">STRONG</span>
        </div>
        <div className="bg-black/60 rounded px-1.5 py-0.5">
          <span className="text-[9px] text-gray-200 font-mono">{cam.short}</span>
        </div>
      </div>

      {/* ── Bottom HUD bar ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)", paddingBottom: 8, paddingTop: 24, paddingLeft: 10, paddingRight: 10 }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] text-gray-300 font-mono leading-none">Sunridge Farm · Field A · Zone 3</p>
            <p className="text-[8px] text-gray-500 font-mono leading-none mt-0.5">49°28.234′N · 119°35.871′W</p>
          </div>
          <p className="text-[9px] text-gray-400 font-mono">Wk 27 · Jul 7, 2026</p>
        </div>
      </div>

      {/* ── Detection count badge (if any) ── */}
      {cam.detections.length > 0 && (
        <div className="absolute top-9 left-2 pointer-events-none">
          <div className="flex items-center gap-1 bg-black/70 border border-orange-500/50 rounded px-1.5 py-0.5">
            <Bug className="w-2.5 h-2.5 text-orange-400" />
            <span className="text-[9px] text-orange-300 font-mono">
              {cam.detections.length} DETECTED
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Thumbnail ─────────────────────────────────────────────────────────────────
function Thumbnail({ cam, isActive }: { cam: CamDef; isActive: boolean }) {
  if (cam.img === null) {
    // Trap thumbnail — minimal SVG preview
    return (
      <div className="relative w-full h-full bg-[#06060e] overflow-hidden">
        {/* UV glow */}
        <div className="absolute inset-x-0 top-0 h-1/2"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.35) 0%, transparent 75%)" }} />
        {/* Sticky board */}
        <div className="absolute bottom-0 inset-x-2 h-2.5 rounded-sm"
          style={{ background: "rgba(180,140,50,0.7)" }} />
        {/* Moths */}
        <div className="absolute" style={{ left: "30%", bottom: "14%", width: 7, height: 5, borderRadius: "50% 50% 50% 50%", background: "#2a1e0c", transform: "rotate(-10deg)" }} />
        <div className="absolute" style={{ left: "50%", bottom: "12%", width: 6, height: 4, borderRadius: "50%", background: "#241808" }} />
        {/* Label */}
        <div className="absolute top-1 left-1 bg-black/60 rounded px-1 py-px">
          <span className="text-[7px] text-gray-300 font-mono">TRAP</span>
        </div>
        {/* Detection dot */}
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 border border-gray-900" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img src={cam.img} alt={cam.short}
        className="w-full h-full object-cover"
        style={{ objectPosition: cam.imgPosition ?? "center" }}
        draggable={false} />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />
      {/* Vignette */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
      {/* Label */}
      <div className="absolute top-0.5 left-0.5 bg-black/60 rounded px-1 py-px">
        <span className="text-[7px] text-gray-300 font-mono">{cam.short}</span>
      </div>
      {/* Detection dot */}
      {cam.detections.length > 0 && (
        <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-orange-500 border border-gray-900" />
      )}
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
        </div>
      )}
    </div>
  );
}

// ─── Main CameraPanel export ──────────────────────────────────────────────────
export function CameraPanel({ className }: { className?: string }) {
  const [activeCamId, setActiveCamId] = useState<CamId>("front");
  const [enabled, setEnabled]         = useState(true);
  const [tick, setTick]               = useState(0);
  const [snapping, setSnapping]       = useState(false);
  const [time, setTime]               = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1);
      setTime(new Date());
    }, 150);
    return () => clearInterval(iv);
  }, []);

  const cam     = CAMERAS.find(c => c.id === activeCamId)!;
  const camIdx  = CAMERAS.findIndex(c => c.id === activeCamId);

  const prevCam = () => setActiveCamId(CAMERAS[(camIdx - 1 + CAMERAS.length) % CAMERAS.length].id);
  const nextCam = () => setActiveCamId(CAMERAS[(camIdx + 1) % CAMERAS.length].id);

  const handleSnapshot = () => {
    setSnapping(true);
    setTimeout(() => setSnapping(false), 250);
  };

  return (
    <Card className={cn("p-0 bg-gray-950 overflow-hidden border-gray-800", className)}>

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d0d12] border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          {/* LIVE pill */}
          <div className="flex items-center gap-1 bg-red-600 rounded px-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
            </span>
            <span className="text-white text-[9px] font-mono tracking-widest">LIVE</span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          {/* Camera name */}
          <div>
            <p className="text-white text-xs leading-none">{cam.label}</p>
            <p className="text-gray-500 text-[9px] leading-none mt-0.5 font-mono">
              Field A · Zone 3 · Robot Cam
            </p>
          </div>
          {/* Detection alert */}
          {cam.detections.length > 0 && (
            <div className="flex items-center gap-1 bg-orange-950/60 border border-orange-700/40 rounded px-1.5 py-0.5">
              <Bug className="w-2.5 h-2.5 text-orange-400" />
              <span className="text-orange-300 text-[9px] font-mono">{cam.detections.length} detected</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Connection */}
          <div className="flex items-center gap-1 mr-1">
            <Wifi className="w-3 h-3 text-green-500" />
            <span className="text-[9px] text-green-500 font-mono">Online</span>
          </div>
          <Button variant="ghost" size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800 w-7 h-7 p-0"
            onClick={() => setEnabled(e => !e)}>
            {enabled ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800 w-7 h-7 p-0"
            onClick={handleSnapshot}>
            <Camera className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800 w-7 h-7 p-0">
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Main feed ── */}
      <div className={cn(
        "relative bg-black overflow-hidden",
        snapping && "brightness-[1.8]",
        "transition-all duration-75"
      )} style={{ aspectRatio: "16/9" }}>
        {enabled ? (
          cam.img === null ? (
            // Trap camera — SVG interior
            <div className="absolute inset-0">
              <TrapInteriorFeed tick={tick} />
              {/* Trap detection overlays using % positioning */}
              {cam.detections.map((det, i) => (
                <div key={i} className="absolute pointer-events-none"
                  style={{ left: `${det.x}%`, top: `${det.y}%`, width: `${det.w}%`, paddingTop: `${det.h}%` }}>
                  <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-400" />
                  <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-400" />
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-400" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-400" />
                  <div className="absolute left-0 text-nowrap" style={{ bottom: "calc(100% + 2px)" }}>
                    <span className="text-[9px] bg-orange-500/90 text-white px-1 py-px rounded-sm leading-none font-mono">
                      {det.pest} {det.confidence}%
                    </span>
                  </div>
                </div>
              ))}
              {/* HUD bottom bar */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)", paddingBottom: 8, paddingTop: 24, paddingLeft: 10, paddingRight: 10 }}>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] text-gray-300 font-mono">Trap Internal · Zone 3 · Delta trap #2</p>
                    <p className="text-[8px] text-gray-500 font-mono mt-0.5">Sticky board session 14:00–14:32</p>
                  </div>
                  <p className="text-[9px] text-gray-400 font-mono">{time.toLocaleTimeString("en-CA", { hour12: false })}</p>
                </div>
              </div>
            </div>
          ) : (
            // Outdoor cameras — photo + HUD
            <div className="absolute inset-0">
              <OutdoorFeed cam={cam} tick={tick} snapping={snapping} time={time} />
            </div>
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950">
            <VideoOff className="w-8 h-8 text-gray-700 mb-2" />
            <p className="text-gray-600 text-xs font-mono">FEED PAUSED</p>
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      <div className="grid grid-cols-5 gap-1 p-2 bg-[#0d0d12] border-t border-gray-800">
        {CAMERAS.map((c) => {
          const isActive = c.id === activeCamId;
          return (
            <button key={c.id} onClick={() => setActiveCamId(c.id)}
              className={cn(
                "relative aspect-video rounded overflow-hidden border-2 transition-all",
                isActive
                  ? "border-white/80 ring-1 ring-white/20 opacity-100"
                  : "border-gray-700/60 hover:border-gray-500 opacity-60 hover:opacity-90"
              )}>
              <Thumbnail cam={c} isActive={isActive} />
            </button>
          );
        })}
      </div>

      {/* ── Nav footer ── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d0d12] border-t border-gray-800">
        <button onClick={prevCam}
          className="flex items-center gap-1 text-gray-500 hover:text-white text-[10px] font-mono transition-colors">
          <ChevronLeft className="w-3 h-3" /> PREV
        </button>
        <div className="flex items-center gap-1.5">
          {CAMERAS.map((_, i) => (
            <div key={i}
              className={cn("rounded-full transition-all", CAMERAS[i].id === activeCamId
                ? "w-3 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-gray-700")} />
          ))}
        </div>
        <button onClick={nextCam}
          className="flex items-center gap-1 text-gray-500 hover:text-white text-[10px] font-mono transition-colors">
          NEXT <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </Card>
  );
}