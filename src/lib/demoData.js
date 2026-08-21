// =============================================================================
// SIMULATED / DEMO DATA LAYER
// All data in this module is clearly labeled SIMULATED for demonstration.
// The architecture is designed so real APIs (news, AIS/shipping, sanctions,
// crude-price, weather, government/open-data) can be connected later by
// replacing the data sources without changing the consuming UI.
// =============================================================================

export const DATA_DISCLAIMER =
  "Simulation / Demo Data — AI recommendations are decision-support outputs and require human validation. Values shown are simulated for demonstration and are not live intelligence.";

// --- National baseline parameters (simulated) ---
export const NATIONAL = {
  country: "India",
  dailyCrudeDemand_mbd: 5.0, // million barrels/day
  dailyImport_mbd: 4.35, // ~87% import dependency
  domesticProduction_mbd: 0.65,
  importDependencyPct: 87,
  refineryCapacity_mbd: 5.0,
  strategicReserve_mbl: 5.33, // million barrels (SPR phase I+II approx, simulated)
  strategicReserveDays: 9.7, // days of import cover
  averageImportCost_usd: 84.2, // $/barrel (simulated)
  gdp_usd_trillion: 3.9,
  energySecurityScore: 62, // 0-100
  supplyDisruptionRisk: 58, // 0-100
};

// --- Supplier countries (simulated contribution & risk) ---
export const SUPPLIERS = [
  { country: "Iraq", region: "Persian Gulf", contribution_pct: 22, risk_score: 41, reliability: 78, sanctions_exposure: "Low", transit_time_days: 8, cost_per_barrel: 82, lat: 30.5, lng: 47.8, corridor: "Strait of Hormuz", status: "At Risk", alternatives: ["Saudi Arabia", "UAE", "USA"] },
  { country: "Saudi Arabia", region: "Persian Gulf", contribution_pct: 18, risk_score: 38, reliability: 85, sanctions_exposure: "None", transit_time_days: 7, cost_per_barrel: 81, lat: 26.6, lng: 50.0, corridor: "Strait of Hormuz", status: "At Risk", alternatives: ["Iraq", "UAE", "Kuwait"] },
  { country: "UAE", region: "Persian Gulf", contribution_pct: 11, risk_score: 35, reliability: 88, sanctions_exposure: "None", transit_time_days: 7, cost_per_barrel: 82, lat: 25.2, lng: 55.3, corridor: "Strait of Hormuz", status: "At Risk", alternatives: ["Saudi Arabia", "Iraq"] },
  { country: "USA", region: "Atlantic / Pacific", contribution_pct: 8, risk_score: 18, reliability: 90, sanctions_exposure: "None", transit_time_days: 24, cost_per_barrel: 86, lat: 29.7, lng: -95.3, corridor: "Cape of Good Hope", status: "Normal", alternatives: ["Brazil", "Canada"] },
  { country: "Nigeria", region: "West Africa", contribution_pct: 7, risk_score: 52, reliability: 64, sanctions_exposure: "Low", transit_time_days: 18, cost_per_barrel: 83, lat: 6.0, lng: 6.5, corridor: "Cape of Good Hope", status: "At Risk", alternatives: ["USA", "Brazil", "Angola"] },
  { country: "Kuwait", region: "Persian Gulf", contribution_pct: 6, risk_score: 37, reliability: 84, sanctions_exposure: "None", transit_time_days: 8, cost_per_barrel: 81, lat: 29.3, lng: 47.9, corridor: "Strait of Hormuz", status: "At Risk", alternatives: ["Saudi Arabia", "UAE"] },
  { country: "Brazil", region: "South America", contribution_pct: 4, risk_score: 22, reliability: 80, sanctions_exposure: "None", transit_time_days: 26, cost_per_barrel: 85, lat: -22.9, lng: -43.2, corridor: "Cape of Good Hope", status: "Normal", alternatives: ["USA", "Nigeria"] },
  { country: "Russia", region: "Pacific / ESPO", contribution_pct: 3, risk_score: 48, reliability: 72, sanctions_exposure: "High", transit_time_days: 20, cost_per_barrel: 78, lat: 42.8, lng: 132.9, corridor: "Pacific Route", status: "At Risk", alternatives: ["USA", "Brazil"] },
  { country: "Venezuela", region: "South America", contribution_pct: 2, risk_score: 78, reliability: 40, sanctions_exposure: "Critical", transit_time_days: 28, cost_per_barrel: 79, lat: 10.5, lng: -66.9, corridor: "Cape of Good Hope", status: "Disrupted", alternatives: ["Brazil", "USA"] },
  { country: "Iran", region: "Persian Gulf", contribution_pct: 1, risk_score: 88, reliability: 35, sanctions_exposure: "Critical", transit_time_days: 9, cost_per_barrel: 76, lat: 26.5, lng: 53.0, corridor: "Strait of Hormuz", status: "Blocked", alternatives: ["Iraq", "Saudi Arabia"] },
];

// --- Shipping corridors / straits / canals (simulated) ---
export const ROUTES = [
  {
    name: "Strait of Hormuz", type: "Strait", distance_km: 0, transit_time_days: 0, capacity_mbd: 21, current_risk: 74, status: "At Risk",
    path: [[26.5, 56.3], [25.2, 55.3], [22.8, 69.7]],
    historical_disruptions: 6, rerouting_cost: 4.5, alternative_routes: ["Cape of Good Hope", "Sumed Pipeline"],
    description: "Primary chokepoint for ~60% of Gulf crude. Carries Iraq, Saudi, UAE, Kuwait, Iran flows to India.",
  },
  {
    name: "Red Sea / Bab el-Mandeb", type: "Strait", distance_km: 0, transit_time_days: 0, capacity_mbd: 9, current_risk: 68, status: "At Risk",
    path: [[12.6, 43.3], [18.0, 39.0], [22.8, 69.7]],
    historical_disruptions: 5, rerouting_cost: 3.8, alternative_routes: ["Cape of Good Hope"],
    description: "Connects Indian Ocean to Suez. Affected by regional conflict and Houthi activity.",
  },
  {
    name: "Suez Canal", type: "Canal", distance_km: 193, transit_time_days: 1, capacity_mbd: 7, current_risk: 55, status: "At Risk",
    path: [[30.0, 32.5], [31.4, 32.3]],
    historical_disruptions: 3, rerouting_cost: 3.0, alternative_routes: ["Cape of Good Hope"],
    description: "Mediterranean–Red Sea shortcut. Disruption forces Cape rerouting adding ~10 days.",
  },
  {
    name: "Arabian Sea Corridor", type: "Sea Corridor", distance_km: 2400, transit_time_days: 7, capacity_mbd: 16, current_risk: 48, status: "At Risk",
    path: [[26.5, 56.3], [15.0, 65.0], [22.8, 69.7]],
    historical_disruptions: 2, rerouting_cost: 1.5, alternative_routes: ["Cape of Good Hope"],
    description: "Primary west-coast approach to Indian refineries from the Gulf.",
  },
  {
    name: "Cape of Good Hope", type: "Alternative", distance_km: 11000, transit_time_days: 24, capacity_mbd: 8, current_risk: 22, status: "Normal",
    path: [[6.0, 6.5], [-10.0, 5.0], [-34.3, 18.4], [-20.0, 60.0], [22.8, 69.7]],
    historical_disruptions: 1, rerouting_cost: 0, alternative_routes: ["Suez Canal"],
    description: "Long-haul alternative bypassing Suez/Red Sea. Higher transit time, lower geopolitical risk.",
  },
  {
    name: "Pacific Route (ESPO)", type: "Sea Corridor", distance_km: 9000, transit_time_days: 20, capacity_mbd: 3, current_risk: 30, status: "Normal",
    path: [[42.8, 132.9], [20.0, 120.0], [13.0, 80.2]],
    historical_disruptions: 1, rerouting_cost: 2.0, alternative_routes: ["Arabian Sea Corridor"],
    description: "East-coast approach for Russian (ESPO) and some Pacific crude.",
  },
];

// --- Indian ports (simulated) ---
export const PORTS = [
  { name: "Vadinar", lat: 22.3, lng: 69.7, capacity_mbd: 1.0, status: "At Risk" },
  { name: "Mundra", lat: 22.8, lng: 69.7, capacity_mbd: 0.9, status: "Normal" },
  { name: "Sikka", lat: 22.4, lng: 69.8, capacity_mbd: 0.6, status: "At Risk" },
  { name: "Mumbai (JNPT)", lat: 18.9, lng: 72.9, capacity_mbd: 0.5, status: "Normal" },
  { name: "Kochi", lat: 9.93, lng: 76.26, capacity_mbd: 0.4, status: "Normal" },
  { name: "Mangalore", lat: 12.9, lng: 74.8, capacity_mbd: 0.5, status: "Normal" },
  { name: "Chennai", lat: 13.08, lng: 80.27, capacity_mbd: 0.4, status: "Normal" },
  { name: "Visakhapatnam", lat: 17.68, lng: 83.21, capacity_mbd: 0.5, status: "Normal" },
  { name: "Paradip", lat: 20.3, lng: 86.6, capacity_mbd: 0.6, status: "Normal" },
];

// --- Refineries (simulated) ---
export const REFINERIES = [
  { name: "Jamnagar (Reliance)", lat: 22.4, lng: 69.9, capacity_mbd: 1.24, utilization: 96, vulnerability: 72, corridor: "Strait of Hormuz" },
  { name: "Vadinar (Essar/Nayara)", lat: 22.3, lng: 69.7, capacity_mbd: 0.4, utilization: 92, vulnerability: 70, corridor: "Strait of Hormuz" },
  { name: "Mangalore (MRPL)", lat: 12.9, lng: 74.8, capacity_mbd: 0.37, utilization: 88, vulnerability: 58, corridor: "Arabian Sea Corridor" },
  { name: "Kochi (BPCL)", lat: 9.93, lng: 76.26, capacity_mbd: 0.31, utilization: 85, vulnerability: 50, corridor: "Arabian Sea Corridor" },
  { name: "Chennai (CPCL)", lat: 13.08, lng: 80.27, capacity_mbd: 0.23, utilization: 90, vulnerability: 45, corridor: "Pacific Route (ESPO)" },
  { name: "Paradip (IOCL)", lat: 20.3, lng: 86.6, capacity_mbd: 0.6, utilization: 94, vulnerability: 38, corridor: "Pacific Route (ESPO)" },
  { name: "Mathura (IOCL)", lat: 27.5, lng: 77.7, capacity_mbd: 0.16, utilization: 86, vulnerability: 40, corridor: "Strait of Hormuz" },
  { name: "Panipat (IOCL)", lat: 29.4, lng: 76.97, capacity_mbd: 0.31, utilization: 89, vulnerability: 42, corridor: "Strait of Hormuz" },
];

// --- Strategic petroleum reserves (simulated) ---
export const RESERVES = [
  { name: "Visakhapatnam SPR", lat: 17.68, lng: 83.21, capacity_mbl: 1.33, current_mbl: 1.18, fillPct: 88 },
  { name: "Padur SPR", lat: 12.9, lng: 74.8, capacity_mbl: 1.5, current_mbl: 1.42, fillPct: 95 },
  { name: "Mangalore SPR", lat: 12.9, lng: 74.8, capacity_mbl: 1.5, current_mbl: 1.3, fillPct: 87 },
  { name: "Chandikhol (Planned)", lat: 20.4, lng: 85.6, capacity_mbl: 1.0, current_mbl: 0.43, fillPct: 43 },
];

// --- Seed alerts (simulated geopolitical / logistics events) ---
export const SEED_ALERTS = [
  {
    title: "Elevated naval activity reported near Strait of Hormuz",
    category: "Geopolitical", severity: "High", source: "Simulated Intelligence Feed",
    affected_assets: ["Strait of Hormuz", "Iraq", "Saudi Arabia", "UAE", "Kuwait"],
    risk_score: 74, status: "Active",
    impact_assessment: "Increased military presence raises probability of temporary transit disruption. Estimated 12-18% flow reduction risk over 30 days.",
    recommended_action: "Pre-position alternative procurement from Atlantic basin suppliers; review Hormuz-dependent refinery throughput.",
    timestamp: "2026-08-18T08:12:00Z",
  },
  {
    title: "Red Sea shipping advisories renewed — vessel rerouting ongoing",
    category: "Shipping", severity: "High", source: "Simulated Maritime AIS",
    affected_assets: ["Red Sea / Bab el-Mandeb", "Suez Canal"],
    risk_score: 68, status: "Active",
    impact_assessment: "Suez-transiting crude facing rerouting via Cape of Good Hope. Transit time +10 days, freight premium ~$3.8/bbl.",
    recommended_action: "Confirm Cape of Good Hope charter availability; hedge freight exposure for next 60 days.",
    timestamp: "2026-08-18T06:40:00Z",
  },
  {
    title: "New sanctions package targeting Iranian crude exports",
    category: "Sanctions", severity: "Critical", source: "Simulated Sanctions Monitor",
    affected_assets: ["Iran", "Strait of Hormuz"],
    risk_score: 88, status: "Active",
    impact_assessment: "Iranian flows already minimal; secondary risk of retaliatory disruption to Gulf shipping. Confidence: High.",
    recommended_action: "Maintain zero Iranian exposure; monitor Gulf supplier contingency plans.",
    timestamp: "2026-08-17T22:05:00Z",
  },
  {
    title: "Venezuela production decline accelerates",
    category: "Supplier Risk", severity: "Moderate", source: "Simulated Supplier Monitor",
    affected_assets: ["Venezuela"],
    risk_score: 78, status: "Active",
    impact_assessment: "Venezuela contribution (2%) at risk; limited near-term impact due to diversification.",
    recommended_action: "Shift residual Venezuelan volumes to Brazil and USA.",
    timestamp: "2026-08-17T15:20:00Z",
  },
  {
    title: "Brent crude price spike — +6.2% on supply concerns",
    category: "Price Shock", severity: "High", source: "Simulated Price Feed",
    affected_assets: ["National Import Bill"],
    risk_score: 64, status: "Active",
    impact_assessment: "Estimated +$5.2/bbl increase raises monthly import bill by ~$680M if sustained.",
    recommended_action: "Consider term-contract hedging; accelerate strategic reserve review.",
    timestamp: "2026-08-17T11:00:00Z",
  },
  {
    title: "Cyclone advisory — Arabian Sea, low impact forecast",
    category: "Weather", severity: "Low", source: "Simulated Met Service",
    affected_assets: ["Arabian Sea Corridor", "Mumbai (JNPT)"],
    risk_score: 28, status: "Resolved",
    impact_assessment: "Minor vessel delays of 24-48h expected. No structural disruption.",
    recommended_action: "No action required; monitor port schedules.",
    timestamp: "2026-08-16T09:30:00Z",
  },
];

// --- Preconfigured demo scenario ---
export const DEMO_SCENARIO = {
  name: "Strait of Hormuz — 30-Day Partial Disruption",
  disruption_type: "Partial Hormuz Disruption",
  severity: "High",
  duration_days: 30,
  affected_corridor: "Strait of Hormuz",
  affected_supplier: "Iraq",
  reduction_pct: 35,
};

// --- Risk classification helper ---
export function classifyRisk(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Moderate";
  return "Low";
}

export const RISK_COLORS = {
  Low: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/40", dot: "bg-emerald-400", hex: "#10b981" },
  Moderate: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/40", dot: "bg-amber-400", hex: "#f59e0b" },
  High: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/40", dot: "bg-orange-400", hex: "#f97316" },
  Critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40", dot: "bg-red-500", hex: "#ef4444" },
};

export const STATUS_COLORS = {
  Normal: { text: "text-emerald-400", dot: "bg-emerald-400", hex: "#10b981" },
  "At Risk": { text: "text-amber-400", dot: "bg-amber-400", hex: "#f59e0b" },
  Disrupted: { text: "text-orange-400", dot: "bg-orange-400", hex: "#f97316" },
  Blocked: { text: "text-red-500", dot: "bg-red-500", hex: "#ef4444" },
};

// --- Simulated time-series for analytics ---
export function genSeries(base, points, volatility, trend = 0) {
  const out = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v = v + (Math.random() - 0.5) * volatility + trend;
    out.push(Math.round(v * 100) / 100);
  }
  return out;
}

export const ANALYTICS = {
  crudePrice: {
    history: [78, 79, 81, 80, 82, 84, 83, 85, 87, 86, 88, 84, 82, 84, 84.2],
    forecast: [85, 86, 88, 90, 92, 89, 87, 86, 88, 90, 91, 89],
  },
  importVolume: {
    history: [4.4, 4.38, 4.42, 4.4, 4.35, 4.33, 4.36, 4.35, 4.34, 4.35, 4.36, 4.35],
    forecast: [4.35, 4.32, 4.28, 4.3, 4.34, 4.38, 4.4, 4.39, 4.37, 4.36, 4.35, 4.35],
  },
  shippingCost: {
    history: [3.2, 3.4, 3.8, 4.1, 4.5, 4.8, 5.1, 5.4, 5.2, 5.5, 5.8, 6.0],
    forecast: [6.0, 6.2, 6.5, 6.3, 6.1, 5.9, 5.7, 5.5, 5.4, 5.3, 5.2, 5.1],
  },
  reserveLevel: {
    history: [5.33, 5.33, 5.33, 5.3, 5.3, 5.28, 5.28, 5.27, 5.27, 5.33, 5.33, 5.33],
    forecast: [5.33, 5.33, 5.33, 5.33, 5.33, 5.33, 5.33, 5.33, 5.33, 5.33, 5.33, 5.33],
  },
  riskTrend: {
    history: [42, 44, 46, 48, 50, 52, 49, 51, 54, 56, 58, 58],
    forecast: [58, 60, 62, 64, 63, 61, 59, 57, 55, 54, 53, 52],
  },
  supplyDemandGap: {
    history: [0, 0, 0, -0.02, -0.01, 0, 0, -0.03, -0.02, 0, 0, 0],
    forecast: [0, -0.05, -0.1, -0.15, -0.12, -0.08, -0.04, 0, 0, 0, 0, 0],
  },
};
