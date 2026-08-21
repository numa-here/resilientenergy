import React, { useState } from "react";
import { Radar, AlertTriangle, TrendingUp, Filter, Info } from "lucide-react";
import { SUPPLIERS, ROUTES, SEED_ALERTS, RISK_COLORS, classifyRisk } from "@/lib/demoData";
import { RiskBadge, DemoBadge, SectionTitle, Panel, RiskBar, ExplainCard } from "@/components/ops";

export default function RiskIntelligence() {
  const [view, setView] = useState("suppliers");
  const [selected, setSelected] = useState(null);

  const tabs = [
    { id: "suppliers", label: "By Supplier Country" },
    { id: "corridors", label: "By Shipping Corridor" },
    { id: "events", label: "Risk Events & Analysis" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Risk Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Geopolitical Risk Agent · continuous monitoring & NLP classification</p>
        </div>
        <DemoBadge />
      </div>

      {/* Overall disruption risk gauge */}
      <Panel className="bg-gradient-to-br from-amber-950/20 to-slate-900/60">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">National Supply Disruption Risk Score</div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-amber-400">58</span>
              <span className="text-sm text-slate-500 mb-2">/ 100</span>
              <RiskBadge score={58} />
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-xl">
              Composite score derived from geopolitical events, shipping disruption probability, sanctions exposure, and supplier reliability. Elevated due to concurrent Hormuz and Red Sea risk vectors.
            </p>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-500">Confidence</div>
            <div className="text-2xl font-bold text-cyan-300">82%</div>
            <div className="text-[11px] text-slate-500 mt-1">Trend: <span className="text-amber-400">▲ +6 (7d)</span></div>
          </div>
        </div>
      </Panel>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setView(t.id); setSelected(null); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              view === t.id ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {view === "suppliers" && SUPPLIERS.map((s) => (
            <button
              key={s.country}
              onClick={() => setSelected(s)}
              className={`w-full text-left rounded-lg border p-4 transition-colors ${
                selected?.country === s.country ? "border-cyan-600 bg-slate-800/60" : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-white">{s.country}</span>
                  <span className="text-xs text-slate-500 ml-2">{s.region}</span>
                </div>
                <RiskBadge score={s.risk_score} />
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div><div className="text-slate-500">Contribution</div><div className="text-slate-200 font-medium">{s.contribution_pct}%</div></div>
                <div><div className="text-slate-500">Reliability</div><div className="text-slate-200 font-medium">{s.reliability}/100</div></div>
                <div><div className="text-slate-500">Sanctions</div><div className="text-slate-200 font-medium">{s.sanctions_exposure}</div></div>
                <div><div className="text-slate-500">Disruption Prob.</div><div className="text-slate-200 font-medium">{Math.round(s.risk_score * 0.7)}%</div></div>
              </div>
              <div className="mt-2"><RiskBar score={s.risk_score} /></div>
            </button>
          ))}

          {view === "corridors" && ROUTES.map((r) => (
            <button
              key={r.name}
              onClick={() => setSelected(r)}
              className={`w-full text-left rounded-lg border p-4 transition-colors ${
                selected?.name === r.name ? "border-cyan-600 bg-slate-800/60" : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-white">{r.name}</span>
                  <span className="text-xs text-slate-500 ml-2">{r.type}</span>
                </div>
                <RiskBadge score={r.current_risk} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{r.description}</p>
              <div className="grid grid-cols-4 gap-2 text-xs mt-2">
                <div><div className="text-slate-500">Capacity</div><div className="text-slate-200 font-medium">{r.capacity_mbd} Mbd</div></div>
                <div><div className="text-slate-500">Transit</div><div className="text-slate-200 font-medium">{r.transit_time_days || "—"} d</div></div>
                <div><div className="text-slate-500">Hist. Disruptions</div><div className="text-slate-200 font-medium">{r.historical_disruptions}</div></div>
                <div><div className="text-slate-500">Reroute Cost</div><div className="text-slate-200 font-medium">${r.rerouting_cost}/bbl</div></div>
              </div>
              <div className="mt-2"><RiskBar score={r.current_risk} /></div>
            </button>
          ))}

          {view === "events" && SEED_ALERTS.map((a) => (
            <div key={a.title} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <RiskBadge score={a.risk_score} />
                  <span className="text-[10px] uppercase text-slate-500">{a.category}</span>
                </div>
                <span className="text-[11px] text-slate-500">{new Date(a.timestamp).toLocaleString()}</span>
              </div>
              <div className="text-sm font-medium text-white mb-1">{a.title}</div>
              <p className="text-xs text-slate-400">{a.impact_assessment}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {a.affected_assets.map((asset) => (
                  <span key={asset} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{asset}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div>
          <Panel className="sticky top-20">
            <SectionTitle title="Risk Analysis" subtitle="AI-generated reasoning" />
            {!selected ? (
              <div className="text-sm text-slate-500 py-8 text-center">
                <Info className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                Select an item to view detailed risk analysis.
              </div>
            ) : view === "suppliers" ? (
              <div className="space-y-4">
                <div>
                  <div className="text-base font-semibold text-white">{selected.country}</div>
                  <div className="text-xs text-slate-500">{selected.region} · via {selected.corridor}</div>
                </div>
                <RiskBadge score={selected.risk_score} label="Risk Level" />
                <ExplainCard points={[
                  { label: "What happened", value: `Risk score for ${selected.country} is ${selected.risk_score}/100 (${classifyRisk(selected.risk_score)}).` },
                  { label: "Why risk changed", value: selected.status === "Blocked" ? "Active sanctions and corridor closure." : selected.status === "At Risk" ? "Elevated corridor risk and regional tension." : "Stable operating environment." },
                  { label: "Data influencing prediction", value: "Sanctions registry, shipping advisories, supplier reliability history, corridor risk." },
                  { label: "Model predicts", value: `${Math.round(selected.risk_score * 0.7)}% disruption probability over 30 days.` },
                  { label: "Affected routes", value: selected.corridor },
                  { label: "Alternative suppliers", value: selected.alternatives.join(", ") },
                ]} />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-base font-semibold text-white">{selected.name}</div>
                  <div className="text-xs text-slate-500">{selected.type}</div>
                </div>
                <RiskBadge score={selected.current_risk} label="Risk Level" />
                <ExplainCard points={[
                  { label: "What happened", value: `Corridor risk is ${selected.current_risk}/100 (${classifyRisk(selected.current_risk)}).` },
                  { label: "Why risk changed", value: selected.status === "At Risk" ? "Active geopolitical events and shipping advisories." : "Stable transit conditions." },
                  { label: "Affected suppliers", value: SUPPLIERS.filter((s) => s.corridor === selected.name).map((s) => s.country).join(", ") || "—" },
                  { label: "Disruption probability", value: `${Math.round(selected.current_risk * 0.65)}% over 30 days` },
                  { label: "Alternative routes", value: selected.alternative_routes.join(", ") },
                  { label: "Rerouting cost", value: `$${selected.rerouting_cost}/bbl` },
                ]} />
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
