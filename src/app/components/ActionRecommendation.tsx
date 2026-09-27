import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export type ActionType = "monitor" | "prepare" | "intervene";

interface ActionRecommendationProps {
  action: ActionType;
  reasoning: string;
  timeframe?: string;
}

export function ActionRecommendation({
  action,
  reasoning,
  timeframe = "Next 5–7 days",
}: ActionRecommendationProps) {
  const config = {
    monitor: {
      title: "Monitor Only",
      icon: CheckCircle,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    prepare: {
      title: "Prepare Intervention",
      icon: Clock,
      color: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    intervene: {
      title: "Intervention Recommended",
      icon: AlertCircle,
      color: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
  };

  const { title, icon: Icon, color, bg, border } = config[action];

  return (
    <Card className={`p-6 border-2 ${border} ${bg}`}>
      <div className="flex items-start gap-4">
        <div className={`${color} mt-0.5`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg ${color}`}>What should I do now?</h3>
          <p className="text-xs text-gray-600 mt-0.5">{timeframe}</p>
          <div className={`mt-3 text-base ${color}`}>{title}</div>
          <p className="text-sm text-gray-700 mt-2">{reasoning}</p>
          {action !== "monitor" && (
            <Button className="mt-4" variant="outline">
              View Recommendations
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
