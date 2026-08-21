import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  LineChart, Line, Cell,
} from "recharts";
import { FlaskConical, Play, RotateCcw, Sparkles, Zap, AlertTriangle } from "lucide-react";
import { DEMO_SCENARIO, NATIONAL, ROUTES, SUPPLIERS, RISK_COLORS, classifyRisk } from "@/lib/demoData";
import { runScenario } from "@/lib/simulation";
import { RiskBadge, DemoBadge, SectionTitle, Panel, ExplainCard } from "@/components/ops";

const DISRUPTION_TYPES = [
  "Strait of Hormuz Closure",
  "Partial Hormuz Disruption",
  "Red Sea Shipping Suspension",
  "Sanctions on a Major Supplier",
  "Major Supplier Production Loss",
  "Port Shutdown",
  "Shipping-Cost Surge",
  "Global Crude-Price Spike",
  "Multiple Simultaneous Disruptions",
];

export default function ScenarioSimulator() {
  const [params, setParams] = useState({
    disruption_type: DEMO_SCENARIO.disruption_type,
    severity: DEMO_SCENARIO.severity,
    duration_days: DEMO_SCENARIO.duration_days,
    affected_corridor: DEMO_SCENARIO.affected_corridor,
    affected_supplier: DEMO_SCENARIO.affected_supplier,
    reduction_pct: DEMO_SCENARIO.reduction_pct,
  });
  const [run, setRun] = useState(false);
  const [loading, setLoading] = useState(false);

  const results = useMemo(() => run ? runScenario(params) : null, [run, params]);

  const handleRun = () => {
    setLoading(true);
    setRun(false);
    setTimeout(() => { setRun(true); setLoading(false); }, 700);
  };

  const loadDemo = () => {
    setParams({ ...DEMO_SCENARIO });
    setRun(false);
  };

  const beforeAfter = results ? [
    { metric: "Import Volume (Mbd)", before: NATIONAL.dailyImport_mbd, after: +(NATIONAL.dailyImport_mbd - results.supplyGap_mbd).toFixed(2) },
    { metric: "Crude Price ($/bbl)", before: NATIONAL.averageImportCost_usd, after: results.newPrice },
    { metric: "Refinery Util. (%)", before: 92, after: results.avgUtilization },
    { metric: "Reserve (Mbl)", before: NATIONAL.strategicReserve_mbl, after: results.projectedReserve },
    { metric: "Reserve Days", before: NATIONAL.strategicReserveDays, after: results.nationalDaysCover },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Disruption Scenario Modeller</h1>
          <p className="text-sm text-slate-400 mt-1">"What If?" simulation · Scenario Simulation Agent</p>
        </div>
        <DemoBadge />
      </div>

      {/* Demo scenario banner */}
      <Panel className="bg-gradient-to-r from-cyan-950/30 to-slate-900/60 border-cyan-900/40">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Preconfigured Demo Scenario</div>
              <div className="text-xs text-slate-400">{DEMO_SCENARIO.name}</div>
            </div>
          </div>
          <button onClick={loadDemo} className="px-3 py-1.5 rounded-md bg-cyan-500/15 text-cyan-300 text-sm font-medium hover:bg-cyan-500/25 border border-cyan-700/40">
            Load Demo Scenario
          </button>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config */}
        <Panel className="lg:col-span-1">
          <SectionTitle title="Scenario Parameters" />
          <div className="space-y-4">
            <Field label="Disruption Type">
              <select value={params.disruption_type} onChange={(e) => setParams({ ...params, disruption_type: e.target.value })} className="input">
                {DISRUPTION_TYPES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Severity">
              <select value={params.severity} onChange={(e) => setParams({ ...params, severity: e.target.value })} className="input">
                {["Low", "Moderate", "High", "Critical"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label={`Duration: ${params.duration_days} days`}>
              <input type="range" min={7} max={180} value={params.duration_days} onChange={(e) => setParams({ ...params, duration_days: +e.target.value })} className="w-full accent-cyan-500" />
            </Field>
            <Field label="Affected Corridor">
              <select value={params.affected_corridor} onChange={(e) => setParams({ ...params, affected_corridor: e.target.value })} className="input">
                {ROUTES.map((r) => <option key={r.name}>{r.name}</option>)}
              </select>
            </Field>
            <Field label="Affected Supplier">
              <select value={params.affected_supplier} onChange={(e) => setParams({ ...params, affected_supplier: e.target.value })} className="input">
                {SUPPLIERS.map((s) => <option key={s.country}>{s.country}</option>)}
              </select>
            </Field>
            <Field label={`Supply Reduction: ${params.reduction_pct}%`}>
              <input type="range" min={5} max={100} value={params.reduction_pct} onChange={(e) => setParams({ ...params, reduction_pct: +e.target.value })} className="w-full accent-cyan-500" />
            </Field>
            <div className="flex gap-2 pt-2">
              <button onClick={handleRun} disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-cyan-500 text-slate-950 font-semibold text-sm hover:bg-cyan-400 disabled:opacity-50">
                {loading ? <><Sparkles className="w-4 h-4 animate-pulse" /> Simulating…</> : <><Play className="w-4 h-4" /> Run Simulation</>}
              </button>
              <button onClick={() => setRun(false)} className="px-3 py-2.5 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
        </Panel>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {!results ? (
            <Panel className="flex flex-col items-center justify-center py-16 text-center">
              <FlaskConical className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">Configure parameters and run the simulation to view impact projections.</p>
            </Panel>
          ) : (
            <>
              <Panel>
                <SectionTitle title="Impact Projection" subtitle={`${params.disruption_type} · ${params.severity} · ${params.duration_days} days`} right={<DemoBadge />} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Metric label="Supply Gap" value={`${results.supplyGap_mbd}`} unit="Mbd" accent="red" />
                  <Metric label="Import Shortfall" value={`${results.shortfallPct}`} unit="%" accent="amber" />
                  <Metric label="Price Impact" value={`+${results.priceImpact_pct}`} unit="%" accent="amber" />
                  <Metric label="New Price" value={`$${results.newPrice}`} unit="/bbl" accent="slate" />
                  <Metric label="Refinery Util. Drop" value={`-${results.refineryUtilDrop}`} unit="%" accent="amber" />
                  <Metric label="Transport Cost" value={`+${results.transportCostImpact_pct}`} unit="%" accent="amber" />
                  <Metric label="Reserve Drawdown" value={`${results.reserveDrawdown_mbl}`} unit="Mbl" accent="red" />
                  <Metric label="Days of Supply" value={`${results.nationalDaysCover}`} unit="days" accent="red" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="rounded-md bg-red-950/30 border border-red-900/40 p-3">
                    <div className="text-[11px] text-slate-400">Direct Cost (simulated)</div>
                    <div className="text-xl font-bold text-red-300">${results.directCost_billion}B</div>
                  </div>
                  <div className="rounded-md bg-red-950/30 border border-red-900/40 p-3">
                    <div className="text-[11px] text-slate-400">Est. GDP Impact</div>
                    <div className="text-xl font-bold text-red-300">-{results.gdpImpact_pct}%</div>
                  </div>
                </div>
              </Panel>

              <Panel>
                <SectionTitle title="Before vs After Comparison" />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={beforeAfter} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="before" name="Before" fill="#475569" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="after" name="After" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <SectionTitle title="Most Vulnerable Refineries / Regions" />
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={results.vulnerableRefineries.map((r) => ({ name: r.name, vulnerability: r.vulnerability }))} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} width={120} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="vulnerability" name="Vulnerability" radius={[0, 3, 3, 0]}>
                      {results.vulnerableRefineries.map((r, i) => (
                        <Cell key={i} fill={RISK_COLORS[classifyRisk(r.vulnerability)].hex} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <SectionTitle title="AI Explainability" subtitle="Why these projections were produced" />
                <ExplainCard points={[
                  { label: "What happened", value: `${params.disruption_type} modelled at ${params.severity} severity for ${params.duration_days} days.` },
                  { label: "Why impact increased", value: `${results.affectedSuppliers.length} suppliers depend on ${params.affected_corridor}, representing ${results.corridorContribution}% of imports.` },
                  { label: "Data influencing prediction", value: "Corridor capacity, supplier dependency, price elasticity, refinery corridor mapping, reserve levels." },
                  { label: "What the model predicts", value: `${results.supplyGap_mbd} Mbd supply gap, +${results.priceImpact_pct}% price impact, ${results.nationalDaysCover} days reserve cover.` },
                  { label: "Recommended action", value: "Activate procurement rerouting and reserve review (see Procurement Optimizer & Strategic Reserves)." },
                  { label: "Potential downside", value: "Prolonged disruption could compound with Red Sea risk; reserve depletion may limit future response capacity." },
                ]} />
              </Panel>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Metric({ label, value, unit, accent }) {
  const colors = { red: "text-red-400", amber: "text-amber-300", slate: "text-slate-200", cyan: "text-cyan-300" };
  return (
    <div className="rounded-md border border-slate-800 bg-slate-800/40 p-3">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-xl font-bold ${colors[accent]}`}>{value}<span className="text-xs font-normal text-slate-500 ml-1">{unit}</span></div>
    </div>
  );
}
