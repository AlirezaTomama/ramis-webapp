// Mock data for the Ramis application

export const mockPestData = {
  codlingMoth: {
    currentCount: 23,
    trend: "down" as const,
    trendValue: "15% vs last week",
    threshold: 15,
    status: "under" as const,
  },
  leafroller: {
    currentCount: 13,
    trend: "up" as const,
    trendValue: "8% vs last week",
    threshold: 12,
    status: "approaching" as const,
  },
};

export const mockFieldData = {
  fields: [
    { id: "field-a", name: "Field A", area: 18, zones: 4 },
    { id: "field-b", name: "Field B", area: 15, zones: 3 },
    { id: "field-c", name: "Field C", area: 9, zones: 2 },
  ],
  totalArea: 42,
};

export const mockRobotData = {
  battery: 78,
  connectivity: "excellent" as const,
  mode: "monitoring" as const,
  lastAction: "Trap scan - 2h ago",
  location: "Field A - Zone 3",
};

export const mockROIData = {
  sprayEventsAvoided: 3,
  moneySaved: 4200,
  moneySavedPerHa: 100,
  riskEventsPrevented: 2,
  chemicalReduced: 68,
  yieldSavedKg: 1240,
};

export const mockTrustData = {
  lastScan: "2 hours ago",
  coverage: 86,
  confidence: "high" as const,
};

export const mockSeasonalData = {
  pestName: "Codling moth",
  weekComparison: {
    difference: -18,
    week: 27,
  },
  seasonComparison: {
    difference: -12,
  },
};

// 8-week infestation trend
export const infestationTrendData = [
  { week: "Wk 20", count: 8, threshold: 15 },
  { week: "Wk 21", count: 11, threshold: 15 },
  { week: "Wk 22", count: 18, threshold: 15 },
  { week: "Wk 23", count: 22, threshold: 15 },
  { week: "Wk 24", count: 27, threshold: 15 },
  { week: "Wk 25", count: 19, threshold: 15 },
  { week: "Wk 26", count: 26, threshold: 15 },
  { week: "Wk 27", count: 23, threshold: 15 },
];

// Active pest types top 5
export const activePestTypes = [
  { name: "Codling Moth", count: 23, share: 45, color: "#f97316" },
  { name: "Leafroller", count: 13, share: 26, color: "#eab308" },
  { name: "Apple Aphid", count: 8, share: 16, color: "#3b82f6" },
  { name: "Spotted Wing Drosophila", count: 5, share: 10, color: "#8b5cf6" },
  { name: "Non-target", count: 2, share: 3, color: "#9ca3af" },
];

// Hotspot detection zones
export const hotspotZones = [
  { zone: "Field A – Zone 3", pestIndex: 87, change: +12, status: "Alert" as const },
  { zone: "Field A – Zone 1", pestIndex: 61, change: -8, status: "Watch" as const },
  { zone: "Field B – Zone 2", pestIndex: 55, change: +3, status: "Watch" as const },
  { zone: "Field C – Zone 1", pestIndex: 32, change: -15, status: "Watch" as const },
  { zone: "Field B – Zone 1", pestIndex: 18, change: -22, status: "Watch" as const },
];

// Risk forecast next 4 weeks
export const riskForecastData = [
  { week: "Wk 28", risk: 35, level: "Low" },
  { week: "Wk 29", risk: 52, level: "Medium" },
  { week: "Wk 30", risk: 71, level: "High" },
  { week: "Wk 31", risk: 58, level: "Medium" },
];

// Savings vs last season
export const savingsVsLastSeason = [
  { category: "Chemical", thisYear: 2100, lastYear: 3800 },
  { category: "Labor", thisYear: 1400, lastYear: 2200 },
  { category: "Yield Loss", thisYear: 700, lastYear: 2900 },
];

// Action impact sparklines (mini weekly trends)
export const actionImpactData = {
  yieldSaved: [120, 180, 210, 190, 240, 280, 310, 290],
  costSaved: [300, 450, 520, 480, 610, 720, 810, 780],
  chemicalReduced: [12, 18, 22, 20, 28, 35, 40, 38],
};
