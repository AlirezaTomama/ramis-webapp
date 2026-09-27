import { Wifi, Battery, Clock, Radio } from "lucide-react";

interface GlobalStatusBarProps {
  compact?: boolean;
}

export function GlobalStatusBar({ compact = false }: GlobalStatusBarProps) {
  const battery = 78;
  const batteryColor = battery > 60 ? "text-green-600" : battery > 30 ? "text-yellow-600" : "text-red-600";

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-gray-600">Monitoring</span>
        </span>
        <span className={`flex items-center gap-0.5 ${batteryColor}`}>
          <Battery className="w-3 h-3" />{battery}%
        </span>
        <span className="flex items-center gap-0.5 text-green-600">
          <Wifi className="w-3 h-3" />Online
        </span>
        <span className="flex items-center gap-0.5">
          <Clock className="w-3 h-3" />2h ago
        </span>
      </div>
    );
  }

  // Sidebar version — compact single row
  return (
    <div className="mx-2.5 my-2 bg-gray-50 border border-gray-100 rounded-md px-2.5 py-1.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-gray-700">Monitoring</span>
        </div>
        <span className="text-[8px] text-gray-400 bg-gray-200 px-1.5 py-px rounded-full">ROBOT</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className={`flex items-center gap-1 text-[9px] ${batteryColor}`}>
          <Battery className="w-2.5 h-2.5" />{battery}%
        </span>
        <span className="flex items-center gap-1 text-[9px] text-green-600">
          <Wifi className="w-2.5 h-2.5" />Online
        </span>
        <span className="flex items-center gap-1 text-[9px] text-gray-500">
          <Radio className="w-2.5 h-2.5" />Strong
        </span>
      </div>
      <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-0.5">
        <Clock className="w-2.5 h-2.5" />
        2h ago · 86% coverage
      </div>
    </div>
  );
}
