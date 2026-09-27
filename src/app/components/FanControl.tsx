import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { cn } from "./ui/utils";
import { Wind, CheckCircle2, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

type FlowLevel = "Low" | "Med" | "High";
type CommandStatus = "idle" | "sending" | "running" | "error";

const flowColors: Record<FlowLevel, string> = {
  Low: "text-blue-500",
  Med: "text-blue-600",
  High: "text-blue-700",
};

const flowBars: Record<FlowLevel, number> = {
  Low: 1,
  Med: 2,
  High: 3,
};

export function FanControl() {
  const [fanOn, setFanOn] = useState(false);
  const [flowLevel, setFlowLevel] = useState<FlowLevel>("Med");
  const [commandStatus, setCommandStatus] = useState<CommandStatus>("idle");
  const [cleaningDown, setCleaningDown] = useState<number | null>(null);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    if (!fanOn) return;
    const interval = setInterval(() => setAnimFrame((f) => (f + 1) % 4), 400);
    return () => clearInterval(interval);
  }, [fanOn]);

  useEffect(() => {
    if (cleaningDown === null) return;
    if (cleaningDown <= 0) { setCleaningDown(null); setCommandStatus("idle"); return; }
    const t = setTimeout(() => setCleaningDown((c) => (c ?? 0) - 1), 1000);
    return () => clearTimeout(t);
  }, [cleaningDown]);

  const simulateCommand = (ms: number) => {
    setCommandStatus("sending");
    setTimeout(() => setCommandStatus("running"), 500);
    setTimeout(() => setCommandStatus("idle"), 500 + ms);
  };

  const handleToggle = (on: boolean) => {
    setFanOn(on);
    simulateCommand(1200);
  };

  const handleClean = () => {
    if (!fanOn) setFanOn(true);
    setCleaningDown(60);
    setCommandStatus("running");
  };

  const statusIcon = {
    idle: <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />,
    sending: <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />,
    running: <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600" />,
    error: <AlertTriangle className="w-3.5 h-3.5 text-red-600" />,
  }[commandStatus];

  const statusLabel = {
    idle: "Ready",
    sending: "Sending command...",
    running: cleaningDown !== null ? `Cleaning... ${cleaningDown}s` : "Running",
    error: "Error – retry",
  }[commandStatus];

  const statusColor = {
    idle: "text-gray-500",
    sending: "text-blue-600",
    running: "text-orange-600",
    error: "text-red-600",
  }[commandStatus];

  // Arrow animation offset per frame
  const arrowOffsets = [0, 6, 12, 18];

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", fanOn ? "bg-blue-100" : "bg-gray-100")}>
            <Wind className={cn("w-4 h-4", fanOn ? "text-blue-600" : "text-gray-400")} />
          </div>
          <div>
            <h3 className="text-sm text-gray-900">Fan & Suction</h3>
            <p className="text-xs text-gray-500">Trap airflow control</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {fanOn && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Suction Active
            </span>
          )}
          <Switch checked={fanOn} onCheckedChange={handleToggle} />
        </div>
      </div>

      {/* Suction Schematic */}
      <div className="bg-gray-950 rounded-xl p-4 mb-4 relative overflow-hidden" style={{ minHeight: 120 }}>
        <div className="flex items-center justify-center gap-2">
          {/* Airflow arrows */}
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-1">
                {[0, 1, 2, 3].map((col) => {
                  const offset = (row + col) % 4;
                  const active = fanOn && animFrame === offset;
                  return (
                    <svg
                      key={col}
                      width="18"
                      height="12"
                      viewBox="0 0 18 12"
                      className={cn("transition-all duration-200", fanOn ? "opacity-100" : "opacity-20")}
                    >
                      <path
                        d="M0 6 L12 6 M8 2 L14 6 L8 10"
                        stroke={active ? "#60a5fa" : "#374151"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Trap schematic */}
          <svg width="72" height="88" viewBox="0 0 72 88" className="mx-2">
            {/* Outer trap body */}
            <rect x="8" y="4" width="56" height="72" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
            {/* Funnel top */}
            <polygon points="8,4 64,4 52,24 20,24" fill="#111827" stroke="#374151" strokeWidth="1" />
            {/* Inlet holes */}
            <circle cx="24" cy="14" r="3" fill={fanOn ? "#60a5fa" : "#374151"} className="transition-colors" />
            <circle cx="36" cy="14" r="3" fill={fanOn ? "#60a5fa" : "#374151"} className="transition-colors" />
            <circle cx="48" cy="14" r="3" fill={fanOn ? "#60a5fa" : "#374151"} className="transition-colors" />
            {/* Fan blades */}
            <g transform="translate(36, 48)">
              <circle r="14" fill="#111827" stroke="#4b5563" strokeWidth="1" />
              <g style={{ transformOrigin: "0 0", transform: fanOn ? `rotate(${animFrame * 90}deg)` : "rotate(0deg)", transition: "transform 0.4s" }}>
                <ellipse cx="0" cy="-8" rx="4" ry="7" fill={fanOn ? "#3b82f6" : "#374151"} opacity="0.9" />
                <ellipse cx="8" cy="0" rx="7" ry="4" fill={fanOn ? "#3b82f6" : "#374151"} opacity="0.9" />
                <ellipse cx="0" cy="8" rx="4" ry="7" fill={fanOn ? "#3b82f6" : "#374151"} opacity="0.9" />
                <ellipse cx="-8" cy="0" rx="7" ry="4" fill={fanOn ? "#3b82f6" : "#374151"} opacity="0.9" />
              </g>
              <circle r="3" fill="#6b7280" />
            </g>
            {/* Collection chamber */}
            <rect x="16" y="68" width="40" height="12" rx="4" fill="#111827" stroke="#4b5563" strokeWidth="1" />
            <text x="36" y="77" textAnchor="middle" fill="#6b7280" fontSize="7">COLLECT</text>
          </svg>

          {/* Flow level indicator */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-gray-500">Flow</p>
            {(["Low", "Med", "High"] as FlowLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => { setFlowLevel(level); if (fanOn) simulateCommand(600); }}
                disabled={!fanOn}
                className={cn(
                  "w-12 py-1 rounded text-[10px] border transition-all",
                  fanOn && flowLevel === level
                    ? "bg-blue-600 border-blue-600 text-white"
                    : fanOn
                    ? "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                    : "bg-gray-900 border-gray-800 text-gray-700 cursor-not-allowed"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Active overlay text */}
        {fanOn && (
          <div className="absolute top-2 left-3 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] text-blue-400">ACTIVE</span>
          </div>
        )}
      </div>

      {/* Auto Clean */}
      <div className="flex items-center justify-between mb-4">
        <Button
          size="sm"
          variant="outline"
          className="text-xs gap-1.5"
          onClick={handleClean}
          disabled={commandStatus === "running" && cleaningDown !== null}
        >
          <RefreshCw className={cn("w-3.5 h-3.5", cleaningDown !== null && "animate-spin")} />
          {cleaningDown !== null ? `Cleaning... ${cleaningDown}s` : "Clean trap now (60 sec)"}
        </Button>
      </div>

      {/* Status */}
      <div className={cn("flex items-center gap-1.5 text-xs", statusColor)}>
        {statusIcon}
        <span>{statusLabel}</span>
      </div>
    </Card>
  );
}
