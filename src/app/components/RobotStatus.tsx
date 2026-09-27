import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Battery, Wifi, Circle } from "lucide-react";
import { Badge } from "./ui/badge";

interface RobotStatusProps {
  battery: number;
  connectivity: "excellent" | "good" | "poor";
  mode: "monitoring" | "control" | "standby";
  lastAction?: string;
  location?: string;
}

export function RobotStatus({
  battery,
  connectivity,
  mode,
  lastAction,
  location = "Field A - Zone 3",
}: RobotStatusProps) {
  const modeConfig = {
    monitoring: { color: "bg-blue-500", label: "Monitoring" },
    control: { color: "bg-orange-500", label: "Control Active" },
    standby: { color: "bg-gray-400", label: "Standby" },
  };

  const connectivityConfig = {
    excellent: { color: "text-green-600", label: "Excellent" },
    good: { color: "text-yellow-600", label: "Good" },
    poor: { color: "text-red-600", label: "Poor" },
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600";
    if (level > 20) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base text-gray-900">Robot Status</h3>
        <Badge className={modeConfig[mode].color}>
          <Circle className="w-2 h-2 mr-1.5 fill-current" />
          {modeConfig[mode].label}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Location</span>
          <span className="text-gray-900">{location}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Battery className={`w-4 h-4 ${getBatteryColor(battery)}`} />
            <span className="text-gray-600">Battery</span>
          </div>
          <span className={`${getBatteryColor(battery)}`}>{battery}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${connectivityConfig[connectivity].color}`} />
            <span className="text-gray-600">Connectivity</span>
          </div>
          <span className={connectivityConfig[connectivity].color}>
            {connectivityConfig[connectivity].label}
          </span>
        </div>

        {lastAction && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Action</span>
            <span className="text-gray-900 text-xs">{lastAction}</span>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm">
          View Map
        </Button>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          Start Monitoring
        </Button>
      </div>
    </Card>
  );
}
