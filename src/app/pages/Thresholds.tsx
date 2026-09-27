import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  X,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

/* ─── Data ─── */
const pests = [
  {
    id: "codling-moth",
    name: "Codling Moth",
    shortName: "Codling Moth",
    rule: "5 moths/trap/week for 2 consecutive weeks triggers spray",
    threshold: 15,
    unit: "moths/trap/week",
    fields: [
      {
        id: "fa",
        name: "Field A",
        count: 12,
        status: "under" as const,
        action: "Monitor only",
        weeklyData: [
          { week: "Wk 20", count: 6 }, { week: "Wk 21", count: 9 },
          { week: "Wk 22", count: 14 }, { week: "Wk 23", count: 18 },
          { week: "Wk 24", count: 22 }, { week: "Wk 25", count: 16 },
          { week: "Wk 26", count: 14 }, { week: "Wk 27", count: 12 },
        ],
        timeToImpact: "10+ days",
        baseline: "18% below seasonal average for Week 27 — activity is declining.",
      },
      {
        id: "fb",
        name: "Field B",
        count: 5,
        status: "under" as const,
        action: "Monitor only",
        weeklyData: [
          { week: "Wk 20", count: 3 }, { week: "Wk 21", count: 5 },
          { week: "Wk 22", count: 8 }, { week: "Wk 23", count: 9 },
          { week: "Wk 24", count: 11 }, { week: "Wk 25", count: 8 },
          { week: "Wk 26", count: 6 }, { week: "Wk 27", count: 5 },
        ],
        timeToImpact: "14+ days",
        baseline: "Well below seasonal average. No concern for this field.",
      },
      {
        id: "fc",
        name: "Field C",
        count: 3,
        status: "under" as const,
        action: "Monitor only",
        weeklyData: [
          { week: "Wk 20", count: 1 }, { week: "Wk 21", count: 2 },
          { week: "Wk 22", count: 4 }, { week: "Wk 23", count: 5 },
          { week: "Wk 24", count: 6 }, { week: "Wk 25", count: 4 },
          { week: "Wk 26", count: 3 }, { week: "Wk 27", count: 3 },
        ],
        timeToImpact: "14+ days",
        baseline: "32% below seasonal average. Very low activity.",
      },
    ],
  },
  {
    id: "leafroller",
    name: "Leafroller",
    shortName: "Leafroller",
    rule: "12 adults per trap per week — immediate monitoring recommended",
    threshold: 12,
    unit: "adults/trap/week",
    fields: [
      {
        id: "fa",
        name: "Field A",
        count: 13,
        status: "approaching" as const,
        action: "Prepare intervention",
        weeklyData: [
          { week: "Wk 20", count: 4 }, { week: "Wk 21", count: 6 },
          { week: "Wk 22", count: 8 }, { week: "Wk 23", count: 10 },
          { week: "Wk 24", count: 13 }, { week: "Wk 25", count: 10 },
          { week: "Wk 26", count: 12 }, { week: "Wk 27", count: 13 },
        ],
        timeToImpact: "4–6 days",
        baseline: "8% above seasonal average for Week 27 — trending toward threshold.",
      },
      {
        id: "fb",
        name: "Field B",
        count: 4,
        status: "under" as const,
        action: "Monitor only",
        weeklyData: [
          { week: "Wk 20", count: 2 }, { week: "Wk 21", count: 3 },
          { week: "Wk 22", count: 4 }, { week: "Wk 23", count: 5 },
          { week: "Wk 24", count: 6 }, { week: "Wk 25", count: 5 },
          { week: "Wk 26", count: 4 }, { week: "Wk 27", count: 4 },
        ],
        timeToImpact: "14+ days",
        baseline: "Low activity, within normal range for this time of year.",
      },
    ],
  },
  {
    id: "swd",
    name: "Spotted Wing Drosophila",
    shortName: "SWD",
    rule: "Any SWD adult detection triggers immediate action in stone fruits",
    threshold: 1,
    unit: "adults detected",
    fields: [
      {
        id: "fa",
        name: "Field A",
        count: 0,
        status: "under" as const,
        action: "Monitor only",
        weeklyData: [
          { week: "Wk 20", count: 0 }, { week: "Wk 21", count: 0 },
          { week: "Wk 22", count: 0 }, { week: "Wk 23", count: 0 },
          { week: "Wk 24", count: 0 }, { week: "Wk 25", count: 0 },
          { week: "Wk 26", count: 0 }, { week: "Wk 27", count: 0 },
        ],
        timeToImpact: "N/A",
        baseline: "No SWD detected this season. This is normal for Week 27 in apple orchards.",
      },
      {
        id: "fb",
        name: "Field B",
        count: 0,
        status: "under" as const,
        action: "Monitor only",
        weeklyData: [
          { week: "Wk 20", count: 0 }, { week: "Wk 21", count: 0 },
          { week: "Wk 22", count: 0 }, { week: "Wk 23", count: 0 },
          { week: "Wk 24", count: 0 }, { week: "Wk 25", count: 0 },
          { week: "Wk 26", count: 0 }, { week: "Wk 27", count: 0 },
        ],
        timeToImpact: "N/A",
        baseline: "No SWD detected this season. Consistent with historical data.",
      },
    ],
  },
];

/* ─── Helpers ─── */
type Status = "under" | "approaching" | "above";

const statusConfig: Record<Status, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  under: {
    label: "Under control",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle,
  },
  approaching: {
    label: "Approaching threshold",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: TrendingUp,
  },
  above: {
    label: "Above threshold",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: AlertCircle,
  },
};

const summaryStats = (pest: typeof pests[0]) => {
  const under = pest.fields.filter((f) => f.status === "under").length;
  const approaching = pest.fields.filter((f) => f.status === "approaching").length;
  const above = pest.fields.filter((f) => f.status === "above").length;
  return { under, approaching, above };
};

/* ─── Component ─── */
export function Thresholds() {
  const [selectedPestId, setSelectedPestId] = useState("codling-moth");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const pest = pests.find((p) => p.id === selectedPestId)!;
  const stats = summaryStats(pest);
  const selectedField = pest.fields.find((f) => f.id === selectedFieldId) || null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl text-gray-900">IPM Threshold Planner</h1>
          <p className="text-xs text-gray-500 mt-1">Is it time to intervene? Monitor thresholds and plan treatments by field.</p>
        </div>

        {/* Decision box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 flex items-center gap-3 mb-5">
          <TrendingUp className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <span className="text-xs text-yellow-900">
            <strong>Prepare</strong> · Leafroller in Field A is approaching threshold (108%). Monitor closely and prepare treatment plan.
          </span>
        </div>

        {/* Pest Selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {pests.map((p) => {
            const hasApproaching = p.fields.some((f) => f.status === "approaching");
            const hasAbove = p.fields.some((f) => f.status === "above");
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedPestId(p.id); setSelectedFieldId(null); }}
                className={`px-4 py-2 rounded-lg text-sm transition-all border flex items-center gap-2 ${
                  selectedPestId === p.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p.shortName}
                {hasAbove && <span className="w-2 h-2 rounded-full bg-red-500" />}
                {!hasAbove && hasApproaching && <span className="w-2 h-2 rounded-full bg-yellow-500" />}
              </button>
            );
          })}
        </div>

        <div className={`grid grid-cols-1 ${selectedField ? "lg:grid-cols-5" : "lg:grid-cols-1"} gap-6`}>
          {/* Left: Master card + table */}
          <div className={selectedField ? "lg:col-span-3" : ""}>

            {/* Master Pest Card */}
            <Card className="p-5 mb-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-base text-gray-900">{pest.name}</h2>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">IPM Rule</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Rule: <em>{pest.rule}</em></p>
                  </div>
                </div>
                {/* Summary counts */}
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-xl text-green-700">{stats.under}</p>
                    <p className="text-[10px] text-gray-500">Under control</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-yellow-600">{stats.approaching}</p>
                    <p className="text-[10px] text-gray-500">Approaching</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-red-600">{stats.above}</p>
                    <p className="text-[10px] text-gray-500">Above</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Field Comparison Table */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-900">Field Comparison</h3>
                <span className="text-xs text-gray-400">Threshold: {pest.threshold} {pest.unit}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs text-gray-400 pb-3 font-normal">Field</th>
                      <th className="text-right text-xs text-gray-400 pb-3 font-normal">Current</th>
                      <th className="text-right text-xs text-gray-400 pb-3 font-normal">Threshold</th>
                      <th className="text-center text-xs text-gray-400 pb-3 font-normal">Status</th>
                      <th className="text-left text-xs text-gray-400 pb-3 font-normal pl-4">Action</th>
                      <th className="text-right text-xs text-gray-400 pb-3 font-normal">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pest.fields.map((field) => {
                      const cfg = statusConfig[field.status];
                      const StatusIcon = cfg.icon;
                      const pct = Math.round((field.count / pest.threshold) * 100);
                      const isSelected = selectedFieldId === field.id;
                      return (
                        <tr
                          key={field.id}
                          className={`border-b border-gray-50 transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                        >
                          <td className="py-3 pr-3">
                            <div>
                              <span className="text-sm text-gray-900">{field.name}</span>
                              {/* Mini bar */}
                              <div className="mt-1 w-20 h-1 bg-gray-100 rounded-full">
                                <div
                                  className="h-1 rounded-full"
                                  style={{
                                    width: `${Math.min(pct, 100)}%`,
                                    backgroundColor: field.status === "above" ? "#ef4444" : field.status === "approaching" ? "#eab308" : "#22c55e"
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span className="text-sm text-gray-900">{field.count}</span>
                          </td>
                          <td className="py-3 text-right">
                            <span className="text-sm text-gray-500">{pest.threshold}</span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`inline-flex items-center gap-1 text-xs border px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-3 pl-4">
                            <span className="text-xs text-gray-700">{field.action}</span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedFieldId(isSelected ? null : field.id)}
                              className={`flex items-center gap-1 text-xs transition-colors ml-auto ${isSelected ? "text-blue-600" : "text-gray-400 hover:text-gray-700"}`}
                            >
                              {isSelected ? <X className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right: Details Drawer */}
          {selectedField && (
            <div className="lg:col-span-2">
              <Card className="p-5 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{pest.name}</p>
                    <h3 className="text-base text-gray-900">{selectedField.name} — Details</h3>
                  </div>
                  <button
                    onClick={() => setSelectedFieldId(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status */}
                {(() => {
                  const cfg = statusConfig[selectedField.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <div className={`flex items-center gap-2 p-3 rounded-lg border mb-4 ${cfg.bg} ${cfg.border}`}>
                      <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                      <span className={`text-sm ${cfg.color}`}>{cfg.label}</span>
                    </div>
                  );
                })()}

                {/* Weekly chart vs threshold */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">8-week trend vs IPM threshold</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart
                      data={selectedField.weeklyData.map((d) => ({ ...d, threshold: pest.threshold }))}
                      margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e5e7eb" }} />
                      <ReferenceLine
                        y={pest.threshold}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        label={{ value: "Threshold", position: "right", fontSize: 9, fill: "#ef4444" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={selectedField.status === "approaching" ? "#f59e0b" : selectedField.status === "above" ? "#ef4444" : "#22c55e"}
                        strokeWidth={2}
                        dot={{ r: 2.5 }}
                        name="Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Time to impact */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Estimated time to impact</p>
                    <p className="text-base text-gray-900">{selectedField.timeToImpact}</p>
                    <p className="text-[10px] text-gray-400">if current trend continues</p>
                  </div>
                </div>

                {/* Baseline comparison */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-700 mb-1">Is this normal for Week 27?</p>
                  <p className="text-xs text-blue-900">{selectedField.baseline}</p>
                </div>

                {/* Action button */}
                {selectedField.status === "approaching" && (
                  <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white">
                    Plan Intervention
                  </Button>
                )}
                {selectedField.status === "under" && (
                  <Button variant="outline" className="w-full mt-4">
                    Schedule Next Check
                  </Button>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* IPM Note */}
        <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              IPM thresholds are established levels where pest populations cause economic damage. Ramis monitors these to help you decide when treatment is truly necessary — reducing unnecessary sprays and saving costs.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
