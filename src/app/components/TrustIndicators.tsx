import { Card } from "./ui/card";
import { Clock, MapPin, CheckCircle } from "lucide-react";

interface TrustIndicatorsProps {
  lastScan: string; // e.g., "2 hours ago"
  coverage: number; // percentage
  confidence: "high" | "medium" | "low";
}

export function TrustIndicators({
  lastScan,
  coverage,
  confidence,
}: TrustIndicatorsProps) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Last Scan</p>
          <p className="text-sm text-gray-900 mt-0.5">{lastScan}</p>
        </div>
        <div>
          <MapPin className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Coverage</p>
          <p className="text-sm text-gray-900 mt-0.5">{coverage}%</p>
        </div>
        <div>
          <CheckCircle className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Confidence</p>
          <p className="text-sm text-gray-900 mt-0.5 capitalize">{confidence}</p>
        </div>
      </div>
    </Card>
  );
}
