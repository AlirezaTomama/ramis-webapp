import { Card } from "./ui/card";
import { DollarSign, Droplet, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

interface ROIPanelProps {
  sprayEventsAvoided: number;
  moneySaved: number;
  moneySavedPerHa: number;
  riskEventsPrevented: number;
}

export function ROIPanel({
  sprayEventsAvoided,
  moneySaved,
  moneySavedPerHa,
  riskEventsPrevented,
}: ROIPanelProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base text-gray-900">Your Savings This Season</h3>
        <Button variant="ghost" size="sm">
          Details
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Droplet className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Spray Events Avoided</p>
            <p className="text-xl text-gray-900 mt-0.5">{sprayEventsAvoided}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Estimated $ Saved</p>
            <p className="text-xl text-gray-900 mt-0.5">
              ${moneySaved.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              ${moneySavedPerHa}/ha
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Risk Events Prevented</p>
            <p className="text-xl text-gray-900 mt-0.5">
              {riskEventsPrevented}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
