import React, { useState } from "react";
import { Route as RouteIcon, Search } from "lucide-react";
import { ROUTES, SUPPLIERS, STATUS_COLORS, classifyRisk } from "@/lib/demoData";
import { RiskBadge, StatusBadge, DemoBadge, SectionTitle, Panel, RiskBar, ExplainCard } from "@/components/ops";

export default function Routes() {
  const [selected, setSelected] = useState(ROUTES[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Routes & Corridors Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Shipping corridors, straits, canals · risk & alternatives</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {ROUTES.map((r) => (
            <button
              key={r.name}
              onClick={() => setSelected(r)}
              className={`w-full text-left rounded-lg border p-4 transition-colors ${
                selected?.name === r.name ? "border-cyan-600 bg-slate-800/60" : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <RouteIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">{r.name}</span>
                  <span className="text-xs text-slate-500">{r.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  <RiskBadge score={r.current_risk} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-2">{r.description}</p>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div><span className="text-slate-500">Distance</span> <span className="text-slate-200 font-medium">{r.distance_km || "—"} km</span></div>
                <div><span className="text-slate-500">Transit</span> <span className="text-slate-200 font-medium">{r.transit_time_days || "—"}d</span></div>
                <div><span className="text-slate-500">Capacity</span> <span className="text-slate-200 font-medium">{r.capacity_mbd} Mbd</span></div>
                <div><span className="text-slate-500">Reroute</span> <span className="text-slate-200 font-medium">${r.rerouting_cost}/bbl</span></div>
              </div>
              <div className="mt-2"><RiskBar score={r.current_risk} /></div>
            </button>
          ))}
        </div>

        <div>
          <Panel className="sticky top-20">
            <SectionTitle title="Corridor Profile" />
            <div className="space-y-3">
              <div>
                <div className="text-lg font-semibold text-white">{selected.name}</div>
                <div className="text-xs text-slate-500">{selected.type}</div>
              </div>
              <StatusBadge status={selected.status} />
              <p className="text-xs text-slate-400">{selected.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Cell label="Distance" value={`${selected.distance_km || "—"} km`} />
                <Cell label="Transit Time" value={`${selected.transit_time_days || "—"} days`} />
                <Cell label="Capacity" value={`${selected.capacity_mbd} Mbd`} />
                <Cell label="Current Risk" value={`${selected.current_risk}/100`} />
                <Cell label="Hist. Disruptions" value={selected.historical_disruptions} />
                <Cell label="Rerouting Cost" value={`$${selected.rerouting_cost}/bbl`} />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1.5">Suppliers using this corridor</div>
                <div className="flex flex-wrap gap-1">
                  {SUPPLIERS.filter((s) => s.corridor === selected.name).map((s) => (
                    <span key={s.country} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{s.country}</span>
                  ))}
                  {SUPPLIERS.filter((s) => s.corridor === selected.name).length === 0 && <span className="text-xs text-slate-500">None</span>}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1.5">Alternative routes</div>
                <div className="flex flex-wrap gap-1">
                  {selected.alternative_routes.map((a) => (
                    <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-900/40">{a}</span>
                  ))}
                </div>
              </div>
              <ExplainCard points={[
                { label: "Disruption probability (30d)", value: `${Math.round(selected.current_risk * 0.65)}%` },
                { label: "Impact of closure", value: `Rerouting adds ~${selected.rerouting_cost}/bbl and additional transit time.` },
                { label: "Historical pattern", value: `${selected.historical_disruptions} recorded disruptions.` },
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
