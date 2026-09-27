import { Card } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SeasonalBaselineProps {
  pestName: string;
  weekComparison: {
    difference: number; // positive or negative percentage
    week: number;
  };
  seasonComparison: {
    difference: number;
  };
}

export function SeasonalBaseline({
  pestName,
  weekComparison,
  seasonComparison,
}: SeasonalBaselineProps) {
  const formatDifference = (diff: number) => {
    const abs = Math.abs(diff);
    const sign = diff > 0 ? "+" : "";
    return `${sign}${abs}%`;
  };

  const getColor = (diff: number) => {
    if (diff > 20) return "text-red-600";
    if (diff > 0) return "text-orange-600";
    if (diff > -20) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="p-6">
      <h3 className="text-base text-gray-900">
        Is this normal for this time of year?
      </h3>
      <Tabs defaultValue="week" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="season">Season-to-Date</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="mt-4">
          <div className="flex items-start gap-3">
            {weekComparison.difference > 0 ? (
              <TrendingUp className={`w-5 h-5 mt-0.5 ${getColor(weekComparison.difference)}`} />
            ) : (
              <TrendingDown className={`w-5 h-5 mt-0.5 ${getColor(weekComparison.difference)}`} />
            )}
            <div>
              <p className={`text-sm ${getColor(weekComparison.difference)}`}>
                {pestName} activity is{" "}
                <span className="font-medium">
                  {formatDifference(weekComparison.difference)}
                </span>{" "}
                {weekComparison.difference > 0 ? "above" : "below"} seasonal
                average for Week {weekComparison.week}
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="season" className="mt-4">
          <div className="flex items-start gap-3">
            {seasonComparison.difference > 0 ? (
              <TrendingUp className={`w-5 h-5 mt-0.5 ${getColor(seasonComparison.difference)}`} />
            ) : (
              <TrendingDown className={`w-5 h-5 mt-0.5 ${getColor(seasonComparison.difference)}`} />
            )}
            <div>
              <p className={`text-sm ${getColor(seasonComparison.difference)}`}>
                Season-to-date {pestName} activity is{" "}
                <span className="font-medium">
                  {formatDifference(seasonComparison.difference)}
                </span>{" "}
                {seasonComparison.difference > 0 ? "above" : "below"} historical
                average
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
