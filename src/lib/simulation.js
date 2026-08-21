// =============================================================================
// SIMULATION ENGINE — Scenario impact modelling, procurement scoring,
// strategic reserve optimisation. All outputs are SIMULATED demo calculations.
// Designed so a real quantitative model / external API can replace these
// functions without changing the consuming UI.
// =============================================================================
import { NATIONAL, SUPPLIERS, ROUTES, REFINERIES } from "./demoData";

// --- Scenario impact model (simulated) ---
export function runScenario(params) {
  const {
    disruption_type, severity, duration_days, affected_corridor,
    affected_supplier, reduction_pct,
  } = params;

  const sevFactor = { Low: 0.3, Moderate: 0.55, High: 0.8, Critical: 1.0 }[severity] ?? 0.6;
  const redPct = (reduction_pct ?? 0) / 100;

  // Determine affected flow through the corridor
  const corridor = ROUTES.find((r) => r.name === affected_corridor);
  const corridorFlow = corridor ? corridor.capacity_mbd : 0;
  const affectedFlow = corridorFlow * redPct * sevFactor;

  // Suppliers dependent on this corridor
  const dependentSuppliers = SUPPLIERS.filter((s) => s.corridor === affected_corridor);
  const corridorContribution = dependentSuppliers.reduce((a, s) => a + s.contribution_pct, 0);

  // Supply gap (mbd) — share of national imports affected
  const importDependency = NATIONAL.importDependencyPct / 100;
  const supplyGap_mbd = +(affectedFlow * (corridorContribution / 100) * importDependency).toFixed(2);
  const totalImport = NATIONAL.dailyImport_mbd;
  const shortfallPct = +((supplyGap_mbd / totalImport) * 100).toFixed(1);

  // Price impact (simulated elasticity)
  const priceImpact_pct = +(redPct * sevFactor * 18 + (corridor ? corridor.current_risk / 100 * 6 : 0)).toFixed(1);
  const newPrice = +(NATIONAL.averageImportCost_usd * (1 + priceImpact_pct / 100)).toFixed(2);

  // Refinery utilization impact
  const affectedRefineries = REFINERIES.filter((r) => r.corridor === affected_corridor);
  const refineryUtilDrop = +(redPct * sevFactor * 22).toFixed(1);
  const avgUtilization = +(NATIONAL.refineryCapacity_mbd > 0
    ? ((NATIONAL.refineryCapacity_mbd - supplyGap_mbd) / NATIONAL.refineryCapacity_mbd) * 100
    : 0).toFixed(1);

  // Transportation cost impact
  const transportCostImpact_pct = +(redPct * sevFactor * 35 + (corridor ? corridor.rerouting_cost * 2 : 0)).toFixed(1);

  // Strategic reserve depletion
  const reserveDrawdown_mbl = +(supplyGap_mbd * duration_days * 0.6).toFixed(2);
  const projectedReserve = +(NATIONAL.strategicReserve_mbl - reserveDrawdown_mbl).toFixed(2);
  const daysOfSupply = +(projectedReserve / (NATIONAL.dailyImport_mbd)).toFixed(1);
  const nationalDaysCover = +(NATIONAL.strategicReserveDays - (reserveDrawdown_mbl / NATIONAL.dailyImport_mbd)).toFixed(1);

  // GDP impact (simulated: $/barrel increase * import volume * duration, scaled to GDP)
  const dailyExtraCost = (newPrice - NATIONAL.averageImportCost_usd) * totalImport; // $M/day approx
  const directCost = +(dailyExtraCost * duration_days / 1000).toFixed(2); // $B
  const gdpImpact_pct = +(directCost / (NATIONAL.gdp_usd_trillion * 1000) * 100 * 2.4).toFixed(2);

  // Most vulnerable refineries
  const vulnerableRefineries = [...affectedRefineries]
    .sort((a, b) => b.vulnerability - a.vulnerability)
    .slice(0, 4)
    .map((r) => ({ name: r.name, vulnerability: r.vulnerability, utilizationDrop: refineryUtilDrop }));

  return {
    supplyGap_mbd,
    shortfallPct,
    affectedFlow: +affectedFlow.toFixed(2),
    corridorContribution,
    priceImpact_pct,
    newPrice,
    refineryUtilDrop,
    avgUtilization,
    transportCostImpact_pct,
    reserveDrawdown_mbl,
    projectedReserve,
    daysOfSupply,
    nationalDaysCover,
    directCost_billion: directCost,
    gdpImpact_pct,
    vulnerableRefineries,
    affectedSuppliers: dependentSuppliers.map((s) => s.country),
    duration_days,
    severity,
    affected_corridor,
  };
}

// --- Procurement recommendation scoring (transparent model) ---
export function scoreRecommendations(scenarioResults, params) {
  const affectedCorridor = params.affected_corridor;
  const affectedSupplier = params.affected_supplier;

  // Candidate alternative suppliers: not the affected one, not on the affected corridor
  const candidates = SUPPLIERS.filter(
    (s) => s.country !== affectedSupplier && s.corridor !== affectedCorridor && s.status !== "Blocked"
  );

  const ranked = candidates.map((s) => {
    // Scoring weights (transparent)
    const wCost = 0.2, wAvail = 0.2, wTransit = 0.15, wGeo = 0.15, wSanctions = 0.1, wShip = 0.1, wReliability = 0.1;
    const route = ROUTES.find((r) => r.name === s.corridor);

    const costScore = Math.max(0, 100 - (s.cost_per_barrel - 78) * 4);
    const availScore = s.contribution_pct > 5 ? 90 : 70;
    const transitScore = Math.max(0, 100 - s.transit_time_days * 2.5);
    const geoScore = 100 - s.risk_score;
    const sanctionsScore = { None: 100, Low: 80, Moderate: 55, High: 30, Critical: 5 }[s.sanctions_exposure] ?? 50;
    const shipScore = route ? 100 - route.current_risk : 60;
    const reliabilityScore = s.reliability;

    const score = +(
      costScore * wCost + availScore * wAvail + transitScore * wTransit + geoScore * wGeo +
      sanctionsScore * wSanctions + shipScore * wShip + reliabilityScore * wReliability
    ).toFixed(1);

    const additionalCost = +(s.cost_per_barrel - NATIONAL.averageImportCost_usd + (route ? route.rerouting_cost : 0)).toFixed(2);
    const riskLevel = s.risk_score >= 70 ? "Critical" : s.risk_score >= 55 ? "High" : s.risk_score >= 35 ? "Moderate" : "Low";

    const quantity_pct = Math.round(Math.min(40, s.contribution_pct * 1.6 + (100 - s.risk_score) / 4));

    const reasoning = `Selected because ${s.country} offers ${sanctionsScore >= 80 ? "low sanctions exposure" : "acceptable sanctions exposure"}, ${geoScore >= 70 ? "low geopolitical risk" : "moderate geopolitical risk"}, reliability ${s.reliability}/100, and transit time ${s.transit_time_days} days via ${s.corridor}. Cost premium $${additionalCost}/bbl is offset by corridor diversification away from ${affectedCorridor}.`;

    return {
      supplier: s.country,
      route: s.corridor,
      quantity_pct,
      additional_cost_per_barrel: additionalCost,
      delivery_time_days: s.transit_time_days,
      risk_level: riskLevel,
      reliability_score: s.reliability,
      score,
      reasoning,
      costScore: +costScore.toFixed(0), availScore: +availScore.toFixed(0), transitScore: +transitScore.toFixed(0),
      geoScore: +geoScore.toFixed(0), sanctionsScore, shipScore: +shipScore.toFixed(0),
    };
  });

  return ranked.sort((a, b) => b.score - a.score);
}

// --- Strategic reserve optimisation strategies (simulated) ---
export function reserveStrategies(scenarioResults) {
  const gap = scenarioResults.supplyGap_mbd || 0;
  const duration = scenarioResults.duration_days || 30;
  const base = NATIONAL.strategicReserve_mbl;
  const baseDays = NATIONAL.strategicReserveDays;

  const mk = (label, drawPct, desc) => {
    const drawdown = +(gap * duration * drawPct).toFixed(2);
    const projected = +(base - drawdown).toFixed(2);
    const daysCover = +(projected / NATIONAL.dailyImport_mbd).toFixed(1);
    const recoveryMonths = +(drawdown / 0.4 + 2).toFixed(1);
    return {
      strategy: label,
      drawdown_mbl: drawdown,
      projectedReserve_mbl: projected,
      daysCover,
      drawPct,
      recoveryTimelineMonths: recoveryMonths,
      description: desc,
      coversGapPct: +Math.min(100, (drawdown / (gap * duration || 1)) * 100).toFixed(0),
    };
  };

  return [
    mk("Conservative", 0.3, "Minimal drawdown. Relies primarily on procurement diversification and demand management. Preserves reserves for prolonged or compounding disruptions."),
    mk("Balanced", 0.6, "Moderate drawdown combined with procurement rerouting. Balances immediate supply security with reserve preservation."),
    mk("Emergency", 0.95, "Maximum drawdown to fully cover the supply gap. Used only for critical, high-severity disruptions with severe national impact."),
  ];
}
