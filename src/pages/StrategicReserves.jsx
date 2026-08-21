import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line,
} from "recharts";
import { Shield, TrendingDown, Clock, Info } from "lucide-react";
import { DEMO_SCENARIO, NATIONAL, RESERVES } from "@/lib/demoData";
import { runScenario, reserveStrategies } from "@/lib/simulation";
import { DemoBadge, SectionTitle, Panel, ExplainCard } from "@/components/ops";

export default function StrategicReserves() {
  const [scenario] = useState(DEMO_SCENARIO);
  const results = useMemo(() => runScenario(scenario), [scenario]);
  const strategies = useMemo(() => reserveStrategies(results), [results]);
  const [selected, setSelected] = useState("Balanced");

  const selectedStrat = strategies.find((s) => s.strategy === selected);

  const projectionData = Array.from({ length: scenario.duration_days + 1 }, (_, d) => {
    const draw = results.supplyGap_mbd * d * (selectedStrat ? selectedStrat.drawPct : 0.6);
    return { day: d, reserve: +(NATIONAL.strategicReserve_mbl - draw).toFixed(2) };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Strategic Reserve Optimisation</h1>
          <p className="text-sm text-slate-400 mt-1">Strategic Reserve Optimization Agent · drawdown strategy</p>
        </div>
        <DemoBadge />
      </div>

      {/* Current reserve status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 p-4">
          <div className="text-[11px] uppercase text-slate-400 mb-1">Current Reserve Level</div>
          <div className="text-2xl font-bold text-emerald-300">{NATIONAL.strategicReserve_mbl}<span className="text-sm text-slate-500 ml-1">Mbl</span></div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-[11px] uppercase text-slate-400 mb-1">Days of Consumption</div>
          <div className="text-2xl font-bold text-cyan-300">{NATIONAL.strategicReserveDays}<span className="text-sm text-slate-500 ml-1">days</span></div>
        </div>
        <div className="rounded-lg border border-red-900/40 bg-slate-900/60 p-4">
          <div className="text-[11px] uppercase text-slate-400 mb-1">Forecasted Supply Gap</div>
          <div className="text-2xl font-bold text-red-400">{results.supplyGap_mbd}<span className="text-sm text-slate-500 ml-1">Mbd</span></div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-[11px] uppercase text-slate-400 mb-1">Active Scenario</div>
          <div className="text-sm font-semibold text-amber-300 mt-1 leading-tight">{scenario.name}</div>
        </div>
      </div>

      {/* Strategy comparison */}
      <Panel>
        <SectionTitle title="Drawdown Strategy Comparison" subtitle="Select a strategy to view projected reserve trajectory" right={<DemoBadge />} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {strategies.map((s) => (
            <button
              key={s.strategy}
              onClick={() => setSelected(s.strategy)}
              className={`text-left rounded-lg border p-4 transition-colors ${
                selected === s.strategy ? "border-cyan-500 bg-cyan-950/20" : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white">{s.strategy}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.strategy === "Conservative" ? "bg-emerald-500/15 text-emerald-300" : s.strategy === "Balanced" ? "bg-amber-500/15 text-amber-300" : "bg-red-500/15 text-red-300"}`}>
                  {s.drawPct * 100}% draw
                </span>
              </div>
              <div className="text-xs text-slate-400 leading-snug">{s.description}</div>
              <div className="grid grid-cols-2 gap-1 mt-3 text-xs">
                <div><span className="text-slate-500">Drawdown:</span> <span className="text-slate-200">{s.drawdown_mbl} Mbl</span></div>
                <div><span className="text-slate-500">Projected:</span> <span className="text-slate-200">{s.projectedReserve_mbl} Mbl</span></div>
                <div><span className="text-slate-500">Cover:</span> <span className="text-slate-200">{s.daysCover} d</span></div>
                <div><span className="text-slate-500">Recovery:</span> <span className="text-slate-200">{s.recoveryTimelineMonths} mo</span></div>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel>
          <SectionTitle title="Projected Reserve Trajectory" subtitle={`${selected} strategy · ${scenario.duration_days} days`} />
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={projectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 10 }} label={{ value: "Day", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="reserve" stroke="#06b6d4" strokeWidth={2} dot={false} name="Reserve (Mbl)" />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <SectionTitle title="Strategy Comparison Chart" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={strategies.map((s) => ({ name: s.strategy, drawdown: s.drawdown_mbl, projected: s.projectedReserve_mbl }))} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="drawdown" name="Drawdown (Mbl)" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="projected" name="Projected Reserve (Mbl)" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {selectedStrat && (
        <Panel>
          <SectionTitle title="AI Explainability" subtitle={`${selected} strategy rationale`} />
          <ExplainCard points={[
            { label: "What happened", value: `${scenario.name} creates a ${results.supplyGap_mbd} Mbd supply gap over ${scenario.duration_days} days.` },
            { label: "Recommended drawdown", value: `${selectedStrat.drawdown_mbl} Mbl (${selectedStrat.drawPct * 100}% of gap)` },
            { label: "Projected reserve after intervention", value: `${selectedStrat.projectedReserve_mbl} Mbl · ${selectedStrat.daysCover} days cover` },
            { label: "Recovery / replenishment timeline", value: `${selectedStrat.recoveryTimelineMonths} months at baseline replenishment rate` },
            { label: "Why this strategy", value: selectedStrat.description },
            { label: "Potential downside", value: selected === "Emergency" ? "Significant reserve depletion limits response to subsequent disruptions." : selected === "Conservative" ? "May not fully cover the supply gap, requiring demand management." : "Moderate depletion; balances coverage and preservation." },
          ]} />
        </Panel>
      )}

      {/* Reserve sites */}
      <Panel>
        <SectionTitle title="Strategic Reserve Sites" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                <th className="py-2 pr-3">Site</th>
                <th className="py-2 pr-3">Capacity (Mbl)</th>
                <th className="py-2 pr-3">Current (Mbl)</th>
                <th className="py-2 pr-3">Fill %</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {RESERVES.map((r) => (
                <tr key={r.name} className="border-b border-slate-800">
                  <td className="py-2.5 pr-3 text-white font-medium">{r.name}</td>
                  <td className="py-2.5 pr-3 text-slate-300">{r.capacity_mbl}</td>
                  <td className="py-2.5 pr-3 text-slate-300">{r.current_mbl}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${r.fillPct}%` }} /></div>
                      <span className="text-slate-300 text-xs">{r.fillPct}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className={`text-xs ${r.fillPct >= 80 ? "text-emerald-300" : r.fillPct >= 50 ? "text-amber-300" : "text-red-400"}`}>
                      {r.fillPct >= 80 ? "Operational" : r.fillPct >= 50 ? "Filling" : "Low"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
