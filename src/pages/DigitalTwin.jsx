import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Ship, MapPin, Factory, Shield, Info, Layers } from "lucide-react";
import {
  SUPPLIERS, ROUTES, PORTS, REFINERIES, RESERVES, STATUS_COLORS, RISK_COLORS, classifyRisk, NATIONAL,
} from "@/lib/demoData";
import { RiskBadge, StatusBadge, DemoBadge, SectionTitle, Panel } from "@/components/ops";

const STATUS_HEX = {
  Normal: "#10b981",
  "At Risk": "#f59e0b",
  Disrupted: "#f97316",
  Blocked: "#ef4444",
};

function FitBounds() {
  const map = useMap();
  React.useEffect(() => {
    map.fitBounds([[-35, -100], [60, 140]], { padding: [20, 20] });
  }, [map]);
  return null;
}

export default function DigitalTwin() {
  const [selected, setSelected] = useState(null);
  const [layer, setLayer] = useState("all");

  const routeWeight = (r) => (r.status === "Blocked" ? 1 : r.status === "Disrupted" ? 2 : r.status === "At Risk" ? 4 : 3);
  const routeDash = (r) => (r.status === "Blocked" ? "8 6" : r.status === "Disrupted" ? "10 4" : null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Energy Supply Chain Digital Twin</h1>
          <p className="text-sm text-slate-400 mt-1">Interactive geospatial model · India crude-oil supply network</p>
        </div>
        <DemoBadge />
      </div>

      {/* Legend */}
      <Panel className="py-3">
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Route status:</span>
          {Object.entries(STATUS_HEX).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ background: v }} />
              <span className="text-slate-300">{k}</span>
            </span>
          ))}
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-slate-300"><Ship className="w-3 h-3 text-cyan-400" /> Supplier</span>
          <span className="flex items-center gap-1.5 text-slate-300"><MapPin className="w-3 h-3 text-blue-400" /> Port</span>
          <span className="flex items-center gap-1.5 text-slate-300"><Factory className="w-3 h-3 text-amber-400" /> Refinery</span>
          <span className="flex items-center gap-1.5 text-slate-300"><Shield className="w-3 h-3 text-emerald-400" /> SPR</span>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-slate-800 overflow-hidden h-[560px] bg-slate-900">
            <MapContainer center={[20, 60]} zoom={3} className="h-full w-full" scrollWheelZoom={true} style={{ background: "#0f172a" }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap &copy; CARTO'
              />
              <FitBounds />

              {/* Routes */}
              {ROUTES.map((r) => (
                <Polyline
                  key={r.name}
                  positions={r.path}
                  pathOptions={{
                    color: STATUS_HEX[r.status],
                    weight: routeWeight(r),
                    opacity: 0.85,
                    dashArray: routeDash(r),
                  }}
                  eventHandlers={{ click: () => setSelected({ type: "route", data: r }) }}
                >
                  <Tooltip sticky>{r.name} · {r.status}</Tooltip>
                </Polyline>
              ))}

              {/* Suppliers */}
              {SUPPLIERS.map((s) => (
                <CircleMarker
                  key={s.country}
                  center={[s.lat, s.lng]}
                  radius={5 + s.contribution_pct / 4}
                  pathOptions={{ color: STATUS_HEX[s.status], fillColor: STATUS_HEX[s.status], fillOpacity: 0.6 }}
                  eventHandlers={{ click: () => setSelected({ type: "supplier", data: s }) }}
                >
                  <Popup>
                    <div className="text-xs">
                      <strong>{s.country}</strong><br />
                      Contribution: {s.contribution_pct}%<br />
                      Risk: {s.risk_score}/100 · {s.status}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Ports */}
              {PORTS.map((p) => (
                <CircleMarker
                  key={p.name}
                  center={[p.lat, p.lng]}
                  radius={5}
                  pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.7 }}
                  eventHandlers={{ click: () => setSelected({ type: "port", data: p }) }}
                >
                  <Tooltip sticky>{p.name}</Tooltip>
                </CircleMarker>
              ))}

              {/* Refineries */}
              {REFINERIES.map((r) => (
                <CircleMarker
                  key={r.name}
                  center={[r.lat, r.lng]}
                  radius={4 + r.capacity_mbd * 3}
                  pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.5 }}
                  eventHandlers={{ click: () => setSelected({ type: "refinery", data: r }) }}
                >
                  <Tooltip sticky>{r.name}</Tooltip>
                </CircleMarker>
              ))}

              {/* Reserves */}
              {RESERVES.map((r) => (
                <CircleMarker
                  key={r.name}
                  center={[r.lat, r.lng]}
                  radius={5}
                  pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.6 }}
                  eventHandlers={{ click: () => setSelected({ type: "reserve", data: r }) }}
                >
                  <Tooltip sticky>{r.name}</Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Detail panel */}
        <div>
          <Panel className="sticky top-20">
            <SectionTitle title="Asset Details" subtitle="Click map element to inspect" />
            {!selected ? (
              <div className="text-sm text-slate-500 py-8 text-center">
                <Info className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                Select a supplier, route, port, refinery, or reserve on the map.
              </div>
            ) : selected.type === "supplier" ? (
              <SupplierDetail s={selected.data} />
            ) : selected.type === "route" ? (
              <RouteDetail r={selected.data} />
            ) : selected.type === "refinery" ? (
              <RefineryDetail r={selected.data} />
            ) : selected.type === "port" ? (
              <div>
                <div className="text-base font-semibold text-white">{selected.data.name}</div>
                <div className="text-xs text-slate-500 mb-3">Port · Capacity {selected.data.capacity_mbd} Mbd</div>
                <StatusBadge status={selected.data.status} />
              </div>
            ) : (
              <div>
                <div className="text-base font-semibold text-white">{selected.data.name}</div>
                <div className="text-xs text-slate-500 mb-3">Strategic Reserve · {selected.data.capacity_mbl} Mbl capacity</div>
                <div className="text-sm text-slate-300">Current fill: <span className="font-semibold text-emerald-300">{selected.data.fillPct}%</span></div>
                <div className="text-sm text-slate-300">{selected.data.current_mbl} Mbl stored</div>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function SupplierDetail({ s }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-base font-semibold text-white">{s.country}</div>
        <div className="text-xs text-slate-500">{s.region} · via {s.corridor}</div>
      </div>
      <StatusBadge status={s.status} />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Dependency</div><div className="text-slate-200 font-medium">{s.contribution_pct}%</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Est. Flow</div><div className="text-slate-200 font-medium">{(NATIONAL.dailyImport_mbd * s.contribution_pct / 100).toFixed(2)} Mbd</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Transit Time</div><div className="text-slate-200 font-medium">{s.transit_time_days} days</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Cost</div><div className="text-slate-200 font-medium">${s.cost_per_barrel}/bbl</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Reliability</div><div className="text-slate-200 font-medium">{s.reliability}/100</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Sanctions</div><div className="text-slate-200 font-medium">{s.sanctions_exposure}</div></div>
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-1">Alternative suppliers</div>
        <div className="flex flex-wrap gap-1">{s.alternatives.map((a) => <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{a}</span>)}</div>
      </div>
    </div>
  );
}

function RouteDetail({ r }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-base font-semibold text-white">{r.name}</div>
        <div className="text-xs text-slate-500">{r.type}</div>
      </div>
      <StatusBadge status={r.status} />
      <p className="text-xs text-slate-400">{r.description}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Distance</div><div className="text-slate-200 font-medium">{r.distance_km || "—"} km</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Transit</div><div className="text-slate-200 font-medium">{r.transit_time_days || "—"} d</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Capacity</div><div className="text-slate-200 font-medium">{r.capacity_mbd} Mbd</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Hist. Disruptions</div><div className="text-slate-200 font-medium">{r.historical_disruptions}</div></div>
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-1">Alternative routes</div>
        <div className="flex flex-wrap gap-1">{r.alternative_routes.map((a) => <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{a}</span>)}</div>
      </div>
      <div className="text-xs text-slate-400">Rerouting cost: <span className="text-amber-300 font-medium">${r.rerouting_cost}/bbl</span></div>
    </div>
  );
}

function RefineryDetail({ r }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-base font-semibold text-white">{r.name}</div>
        <div className="text-xs text-slate-500">Refinery · {r.corridor}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Capacity</div><div className="text-slate-200 font-medium">{r.capacity_mbd} Mbd</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Utilization</div><div className="text-slate-200 font-medium">{r.utilization}%</div></div>
        <div className="rounded bg-slate-800/50 p-2"><div className="text-slate-500">Vulnerability</div><div className="text-slate-200 font-medium">{r.vulnerability}/100</div></div>
      </div>
    </div>
  );
}
