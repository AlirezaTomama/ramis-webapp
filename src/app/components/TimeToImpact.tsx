import { Card } from "./ui/card";
import { Clock } from "lucide-react";

interface TimeToImpactProps {
  days: string; // e.g., "4–6"
  confidence: "high" | "medium" | "low";
}

export function TimeToImpact({ days, confidence }: TimeToImpactProps) {
  const confidenceColors = {
    high: "text-green-700 bg-green-50",
    medium: "text-yellow-700 bg-yellow-50",
    low: "text-gray-700 bg-gray-50",
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-gray-500" />
        <div className="flex-1">
          <p className="text-sm text-gray-600">Time to Impact</p>
          <p className="text-xl text-gray-900 mt-0.5">{days} days</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded capitalize ${confidenceColors[confidence]}`}>
          {confidence} confidence
        </span>
      </div>
    </Card>
  );
}
