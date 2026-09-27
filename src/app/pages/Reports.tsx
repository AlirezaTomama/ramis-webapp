import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  FileText,
  Download,
  Share2,
  Lock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Radio,
  Clock,
  Leaf,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Badge } from "../components/ui/badge";

const previousReports = [
  { id: 2, title: "Week 26 — Jun 24–30, 2026", highlights: "Codling moth peak observed. 1 zone alert.", status: "completed" },
  { id: 3, title: "Week 25 — Jun 17–23, 2026", highlights: "Normal activity. No threshold breaches.", status: "completed" },
  { id: 4, title: "Week 24 — Jun 10–16, 2026", highlights: "Codling moth rising in Field A. Prepare advisory issued.", status: "completed" },
];

const weekHighlights = [
  {
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-50",
    text: "1 high-risk zone detected — Field A, Zone 3 (Codling Moth at 80% of IPM threshold).",
  },
  {
    icon: TrendingUp,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    text: "Leafroller trending upward in Field A — approaching threshold (108%). Monitor closely.",
  },
  {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    text: "No threshold breaches this week. All counts within acceptable range.",
  },
  {
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    text: "Recommended monitoring window: Continue daily checks in Field A – Zone 3 for next 7 days.",
  },
  {
    icon: TrendingDown,
    color: "text-green-600",
    bg: "bg-green-50",
    text: "Change since last week: Codling moth -15% (improving). Leafroller +8% (watch closely).",
  },
];

export function Reports() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-xl text-gray-900">Weekly Farm Report</h1>
            <p className="text-xs text-gray-500 mt-1">Auto-generated · Sunridge Farm · Week 27</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 opacity-60" disabled>
              <Download className="w-3.5 h-3.5" />
              Export PDF
              <Lock className="w-3 h-3 text-gray-400" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2 opacity-60" disabled>
              <Share2 className="w-3.5 h-3.5" />
              Share
              <Lock className="w-3 h-3 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Decision box (compact) */}
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-3 mb-5">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-xs text-green-900">
            <strong>Monitor Only</strong> · Next 5–7 days: No intervention required. Continue regular surveillance.
          </span>
        </div>

        {/* Latest Report Card */}
        <Card className="p-6 mb-5">
          <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <h2 className="text-base text-gray-900">Weekly Summary — Week 27</h2>
                <Badge className="bg-green-100 text-green-800 text-[10px]">Latest</Badge>
              </div>
              <p className="text-xs text-gray-500">July 1 – July 7, 2026</p>
            </div>
          </div>

          {/* Week Highlights */}
          <div className="mb-6">
            <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-3">This Week's Highlights</h3>
            <div className="space-y-2.5">
              {weekHighlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${item.bg}`}>
                    <Icon className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />
                    <p className="text-sm text-gray-800">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-orange-600">1</p>
              <p className="text-xs text-gray-500 mt-1">High-Risk Zones</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-green-600">0</p>
              <p className="text-xs text-gray-500 mt-1">Threshold Breaches</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-blue-600">3</p>
              <p className="text-xs text-gray-500 mt-1">Sprays Avoided</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-gray-900">$4,200</p>
              <p className="text-xs text-gray-500 mt-1">Saved This Season</p>
            </div>
          </div>

          {/* Top Pest Trends */}
          <div className="mb-6">
            <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-3">Top Pest Trends This Week</h3>
            <div className="space-y-2">
              {[
                { name: "Codling Moth", count: 11, threshold: 15, change: -15, dir: "down" },
                { name: "Leafroller", count: 13, threshold: 12, change: +8, dir: "up" },
                { name: "Apple Aphid", count: 8, threshold: 25, change: -5, dir: "down" },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-700 w-40">{p.name}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${Math.min((p.count / p.threshold) * 100, 100)}%`,
                        backgroundColor: p.count >= p.threshold ? "#eab308" : "#22c55e"
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-20 text-right">{p.count}/{p.threshold}</span>
                  <span className={`text-xs flex items-center gap-0.5 w-14 justify-end ${p.change > 0 ? "text-red-600" : "text-green-600"}`}>
                    {p.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {p.change > 0 ? "+" : ""}{p.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <Button className="gap-2 bg-green-600 hover:bg-green-700">
              <FileText className="w-4 h-4" />
              View Full Report
            </Button>
            <Button variant="outline" className="gap-2 opacity-60 cursor-not-allowed" disabled>
              <Download className="w-4 h-4" />
              Export PDF
              <Lock className="w-3 h-3" />
            </Button>
            <Button variant="outline" className="gap-2 opacity-60 cursor-not-allowed" disabled>
              <Share2 className="w-4 h-4" />
              Share with Advisor
              <Lock className="w-3 h-3" />
            </Button>
          </div>
        </Card>

        {/* Service Proof */}
        <Card className="p-5 mb-5">
          <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-4">Service Proof — This Week</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Radio className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Coverage</p>
                <p className="text-base text-gray-900">86%</p>
                <p className="text-[10px] text-gray-400">of field area scanned</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Last Scan</p>
                <p className="text-base text-gray-900">2h ago</p>
                <p className="text-[10px] text-gray-400">Jul 7, 2026 · 14:23</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Leaf className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Actions Executed</p>
                <p className="text-base text-gray-900">3 scans</p>
                <p className="text-[10px] text-gray-400">0 spray events triggered</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Previous Reports */}
        <div className="mb-5">
          <h3 className="text-sm text-gray-700 mb-3">Previous Reports</h3>
          <div className="space-y-2">
            {previousReports.map((report) => (
              <Card key={report.id} className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{report.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{report.highlights}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pro Upsell */}
        <Card className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-green-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">Unlock Pro Report Features</p>
              <div className="grid grid-cols-2 gap-1 mb-3">
                {["PDF export", "Share with advisor", "14-day forecast", "Historical comparison", "Multi-farm view", "Custom date ranges"].map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <Lock className="w-2.5 h-2.5 text-gray-400" />
                    <span className="text-[10px] text-gray-500">{f}</span>
                  </div>
                ))}
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-sm">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
