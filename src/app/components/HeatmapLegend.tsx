import { Card } from "./ui/card";

export function HeatmapLegend() {
  return (
    <Card className="p-4 bg-white shadow-lg">
      <p className="text-xs text-gray-900 mb-3">Risk Level</p>
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-gray-700">Low (0-5 count)</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 rounded-full bg-yellow-500 flex-shrink-0" />
          <span className="text-gray-700">Moderate (6-15 count)</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 rounded-full bg-orange-500 flex-shrink-0" />
          <span className="text-gray-700">High (16-30 count)</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0" />
          <span className="text-gray-700">Critical (31+ count)</span>
        </div>
      </div>
    </Card>
  );
}
