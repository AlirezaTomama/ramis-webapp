import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { cn } from "./ui/utils";
import { Zap, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

type WavelengthMode = "UV-A 365" | "385" | "395" | "Blue 450" | "Green 525" | "Amber 590";
type CommandStatus = "idle" | "sending" | "executing" | "completed" | "error";

const wavelengthModes: { id: WavelengthMode; color: string; bgColor: string; activeBg: string }[] = [
  { id: "UV-A 365", color: "text-violet-700", bgColor: "bg-violet-50 border-violet-200", activeBg: "bg-violet-600 border-violet-600 text-white" },
  { id: "385", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200", activeBg: "bg-purple-600 border-purple-600 text-white" },
  { id: "395", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200", activeBg: "bg-blue-600 border-blue-600 text-white" },
  { id: "Blue 450", color: "text-sky-700", bgColor: "bg-sky-50 border-sky-200", activeBg: "bg-sky-500 border-sky-500 text-white" },
  { id: "Green 525", color: "text-green-700", bgColor: "bg-green-50 border-green-200", activeBg: "bg-green-600 border-green-600 text-white" },
  { id: "Amber 590", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200", activeBg: "bg-amber-500 border-amber-500 text-white" },
];

const statusConfig: Record<CommandStatus, { label: string; icon: React.ReactNode; color: string }> = {
  idle: { label: "Ready", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-gray-500" },
  sending: { label: "Command sent", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: "text-blue-600" },
  executing: { label: "Executing", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: "text-orange-600" },
  completed: { label: "Completed", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-green-600" },
  error: { label: "Error", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-red-600" },
};

export function LampControl() {
  const [lampOn, setLampOn] = useState(false);
  const [activeMode, setActiveMode] = useState<WavelengthMode>("UV-A 365");
  const [intensity, setIntensity] = useState([60]);
  const [commandStatus, setCommandStatus] = useState<CommandStatus>("idle");

  const simulateCommand = (duration: number) => {
    setCommandStatus("sending");
    setTimeout(() => setCommandStatus("executing"), 600);
    setTimeout(() => setCommandStatus("completed"), 600 + duration);
    setTimeout(() => setCommandStatus("idle"), 600 + duration + 2000);
  };

  const handleToggle = (on: boolean) => {
    setLampOn(on);
    simulateCommand(1500);
  };

  const handleModeSelect = (mode: WavelengthMode) => {
    setActiveMode(mode);
    if (lampOn) simulateCommand(800);
  };

  const handleSchedule = (minutes: number) => {
    if (!lampOn) setLampOn(true);
    simulateCommand(minutes === 0 ? 1200 : 1000);
  };

  const status = statusConfig[commandStatus];

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", lampOn ? "bg-yellow-100" : "bg-gray-100")}>
            <Zap className={cn("w-4 h-4", lampOn ? "text-yellow-600" : "text-gray-400")} />
          </div>
          <div>
            <h3 className="text-sm text-gray-900">Lamp Control</h3>
            <p className="text-xs text-gray-500">Multi-wavelength UV & visible</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">{lampOn ? "ON" : "OFF"}</span>
          <Switch checked={lampOn} onCheckedChange={handleToggle} />
        </div>
      </div>

      {/* Wavelength Mode Chips */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Wavelength mode</p>
        <div className="flex flex-wrap gap-1.5">
          {wavelengthModes.map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeSelect(m.id)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs border transition-all",
                activeMode === m.id && lampOn
                  ? m.activeBg
                  : lampOn
                  ? m.bgColor + " " + m.color
                  : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
              )}
              disabled={!lampOn}
            >
              {m.id}
            </button>
          ))}
        </div>
      </div>

      {/* Intensity Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Intensity</p>
          <span className="text-xs text-gray-900">{intensity[0]}%</span>
        </div>
        <Slider
          value={intensity}
          onValueChange={setIntensity}
          min={0}
          max={100}
          step={5}
          disabled={!lampOn}
          className={!lampOn ? "opacity-40" : ""}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Schedule Buttons */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Quick schedule</p>
        <div className="flex gap-2">
          {[
            { label: "Run 10 min", value: 10 },
            { label: "Run 30 min", value: 30 },
            { label: "Auto (smart)", value: 0 },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => handleSchedule(s.value)}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs border transition-all",
                s.value === 0
                  ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status + Safety */}
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-1.5 text-xs", status.color)}>
          {status.icon}
          <span>{status.label}</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span className="text-[10px] text-amber-700">Avoid human exposure</span>
        </div>
      </div>
    </Card>
  );
}
