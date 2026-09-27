import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface YieldRiskMeterProps {
  riskPercentage: number; // 0-12
}

export function YieldRiskMeter({ riskPercentage }: YieldRiskMeterProps) {
  const getColor = (value: number) => {
    if (value < 3) return "bg-green-500";
    if (value < 6) return "bg-yellow-500";
    if (value < 9) return "bg-orange-500";
    return "bg-red-500";
  };

  const getRiskLabel = (value: number) => {
    if (value < 3) return "Low";
    if (value < 6) return "Moderate";
    if (value < 9) return "High";
    return "Critical";
  };

  const progressValue = (riskPercentage / 12) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-sm text-gray-600">Estimated Yield Risk</h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-3xl text-gray-900">{riskPercentage}%</span>
        <span className="text-sm text-gray-500">/ 12%</span>
      </div>
      <div className="mt-4">
        <Progress value={progressValue} className="h-3" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-600">
          Based on pest pressure, season, and maturity stage
        </span>
        <span className={`text-xs px-2 py-1 rounded ${
          riskPercentage < 3 ? "bg-green-100 text-green-800" :
          riskPercentage < 6 ? "bg-yellow-100 text-yellow-800" :
          riskPercentage < 9 ? "bg-orange-100 text-orange-800" :
          "bg-red-100 text-red-800"
        }`}>
          {getRiskLabel(riskPercentage)}
        </span>
      </div>
    </Card>
  );
}
