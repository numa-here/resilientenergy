import React, { useState } from "react";
import { Ship, Search } from "lucide-react";
import { SUPPLIERS, RISK_COLORS, classifyRisk } from "@/lib/demoData";
import { RiskBadge, StatusBadge, DemoBadge, SectionTitle, Panel, RiskBar, ExplainCard } from "@/components/ops";

export default function Suppliers() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(SUPPLIERS[0]);

  const filtered = SUPPLIERS.filter((s) => s.country.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Supplier Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Detailed profiles · risk, reliability, sanctions exposure</p>
        </div>
        <DemoBadge />
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suppliers…" className="input pl-9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((s) => (
            <button
              key={s.country}
              onClick={() => setSelected(s)}
              className={`w-full text-left rounded-lg border p-4 transition-colors ${
                selected?.country === s.country ? "border-cyan-600 bg-slate-800/60" : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">{s.country}</span>
                  <span className="text-xs text-slate-500">{s.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.status} />
                  <RiskBadge score={s.risk_score} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-slate-500">Contribution</span> <span className="text-slate-200 font-medium">{s.contribution_pct}%</span></div>
                <div><span className="text-slate-500">Reliability</span> <span className="text-slate-200 font-medium">{s.reliability}/100</span></div>
                <div><span className="text-slate-500">Transit</span> <span className="text-slate-200 font-medium">{s.transit_time_days}d</span></div>
              </div>
              <div className="mt-2"><RiskBar score={s.risk_score} /></div>
            </button>
          ))}
        </div>

        <div>
          <Panel className="sticky top-20">
            <SectionTitle title="Supplier Profile" />
            <div className="space-y-3">
              <div>
                <div className="text-lg font-semibold text-white">{selected.country}</div>
                <div className="text-xs text-slate-500">{selected.region} · {selected.corridor}</div>
              </div>
              <StatusBadge status={selected.status} />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Cell label="Contribution" value={`${selected.contribution_pct}%`} />
                <Cell label="Risk Score" value={`${selected.risk_score}/100`} />
                <Cell label="Reliability" value={`${selected.reliability}/100`} />
                <Cell label="Sanctions Exposure" value={selected.sanctions_exposure} />
                <Cell label="Transit Time" value={`${selected.transit_time_days} days`} />
                <Cell label="Cost" value={`$${selected.cost_per_barrel}/bbl`} />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1.5">Alternative suppliers</div>
                <div className="flex flex-wrap gap-1">
                  {selected.alternatives.map((a) => (
                    <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{a}</span>
                  ))}
                </div>
              </div>
              <ExplainCard points={[
                { label: "Disruption probability (30d)", value: `${Math.round(selected.risk_score * 0.7)}%` },
                { label: "Sanctions risk", value: selected.sanctions_exposure },
                { label: "Corridor dependency", value: selected.corridor },
                { label: "Reliability assessment", value: selected.reliability >= 80 ? "High — consistent delivery" : selected.reliability >= 60 ? "Moderate — occasional disruption" : "Low — frequent disruption" },
              ]} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value }) {
  return <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">{label}</div><div className="text-slate-200 font-medium">{value}</div></div>;
}
