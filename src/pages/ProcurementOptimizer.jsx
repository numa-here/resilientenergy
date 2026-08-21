import React, { useState, useMemo } from "react";
import { ShoppingCart, Sparkles, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { DEMO_SCENARIO, SUPPLIERS, RISK_COLORS, classifyRisk } from "@/lib/demoData";
import { runScenario, scoreRecommendations } from "@/lib/simulation";
import { RiskBadge, DemoBadge, SectionTitle, Panel, ExplainCard } from "@/components/ops";

export default function ProcurementOptimizer() {
  const [scenario] = useState(DEMO_SCENARIO);
  const [expanded, setExpanded] = useState(null);

  const results = useMemo(() => runScenario(scenario), [scenario]);
  const recs = useMemo(() => scoreRecommendations(results, scenario), [results, scenario]);
  const top = recs[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Adaptive Procurement Orchestrator</h1>
          <p className="text-sm text-slate-400 mt-1">Procurement Optimization Agent · transparent scoring model</p>
        </div>
        <DemoBadge />
      </div>

      {/* Context */}
      <Panel className="bg-gradient-to-r from-amber-950/20 to-slate-900/60 border-amber-900/40">
        <div className="text-xs text-slate-400 mb-1">Active Disruption Context</div>
        <div className="text-sm text-white font-medium">{scenario.name}</div>
        <div className="text-xs text-slate-400 mt-1">
          Affected corridor: {scenario.affected_corridor} · Supply gap: {results.supplyGap_mbd} Mbd · Shortfall {results.shortfallPct}%
        </div>
      </Panel>

      {/* Primary recommendation */}
      {top && (
        <Panel className="bg-gradient-to-br from-cyan-950/30 to-slate-900/60 border-cyan-800/40">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs uppercase tracking-wide text-cyan-300 font-semibold">Recommended Action</span>
          </div>
          <p className="text-lg text-white font-medium leading-snug">
            Increase procurement from <span className="text-cyan-300">{top.supplier}</span> by <span className="text-cyan-300">{top.quantity_pct}%</span> through <span className="text-cyan-300">{top.route}</span>.
          </p>
          <p className="text-sm text-slate-400 mt-2">{top.reasoning}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <Mini label="Additional Cost" value={`$${top.additional_cost_per_barrel}/bbl`} />
            <Mini label="Delivery Time" value={`${top.delivery_time_days} days`} />
            <Mini label="Risk Level" value={top.risk_level} />
            <Mini label="Composite Score" value={`${top.score}/100`} />
          </div>
        </Panel>
      )}

      {/* Ranked recommendations */}
      <Panel>
        <SectionTitle title="Ranked Alternative Procurement Options" subtitle="Scored on cost, availability, transit, geopolitical risk, sanctions, shipping risk, reliability" right={<DemoBadge />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Supplier</th>
                <th className="py-2 pr-3">Route</th>
                <th className="py-2 pr-3">Qty ↑</th>
                <th className="py-2 pr-3">Add. Cost</th>
                <th className="py-2 pr-3">Transit</th>
                <th className="py-2 pr-3">Risk</th>
                <th className="py-2 pr-3">Reliability</th>
                <th className="py-2 pr-3">Score</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {recs.map((r, i) => (
                <React.Fragment key={r.supplier}>
                  <tr className="border-b border-slate-800 hover:bg-slate-800/40 cursor-pointer" onClick={() => setExpanded(expanded === r.supplier ? null : r.supplier)}>
                    <td className="py-2.5 pr-3 text-slate-500">{i + 1}</td>
                    <td className="py-2.5 pr-3 text-white font-medium">{r.supplier}</td>
                    <td className="py-2.5 pr-3 text-slate-300">{r.route}</td>
                    <td className="py-2.5 pr-3 text-cyan-300">{r.quantity_pct}%</td>
                    <td className="py-2.5 pr-3 text-slate-300">${r.additional_cost_per_barrel}</td>
                    <td className="py-2.5 pr-3 text-slate-300">{r.delivery_time_days}d</td>
                    <td className="py-2.5 pr-3"><RiskBadge score={r.risk_level === "Critical" ? 85 : r.risk_level === "High" ? 65 : r.risk_level === "Moderate" ? 45 : 20} label={r.risk_level} /></td>
                    <td className="py-2.5 pr-3 text-slate-300">{r.reliability_score}</td>
                    <td className="py-2.5 pr-3"><span className="font-bold text-cyan-300">{r.score}</span></td>
                    <td className="py-2.5 pr-3 text-slate-500 text-xs">{expanded === r.supplier ? "▲" : "▼"}</td>
                  </tr>
                  {expanded === r.supplier && (
                    <tr>
                      <td colSpan={10} className="p-4 bg-slate-900/80">
                        <ExplainCard title={`Why ${r.supplier} was selected`} points={[
                          { label: "Cost score", value: `${r.costScore}/100 — $${r.additional_cost_per_barrel}/bbl premium` },
                          { label: "Availability score", value: `${r.availScore}/100` },
                          { label: "Transit score", value: `${r.transitScore}/100 — ${r.delivery_time_days} days` },
                          { label: "Geopolitical risk score", value: `${r.geoScore}/100` },
                          { label: "Sanctions exposure score", value: `${r.sanctionsScore}/100` },
                          { label: "Shipping risk score", value: `${r.shipScore}/100` },
                          { label: "Reliability score", value: `${r.reliability_score}/100` },
                          { label: "Composite", value: `${r.score}/100 — ${r.reasoning}` },
                        ]} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel>
        <SectionTitle title="Scoring Model (Transparent)" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[["Cost", "20%"], ["Availability", "20%"], ["Transit Time", "15%"], ["Geopolitical Risk", "15%"], ["Sanctions Risk", "10%"], ["Shipping Risk", "10%"], ["Supplier Reliability", "10%"]].map(([k, v]) => (
            <div key={k} className="rounded bg-slate-800/50 p-2.5 border border-slate-800">
              <div className="text-slate-500">{k}</div>
              <div className="text-cyan-300 font-semibold">{v}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Each factor is normalised 0–100 and weighted. The composite score ranks alternatives; higher is better. All values are simulated for demonstration.
        </p>
      </Panel>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-md bg-slate-800/50 p-2.5">
      <div className="text-[10px] uppercase text-slate-500">{label}</div>
      <div className="text-sm text-white font-semibold">{value}</div>
    </div>
  );
}
