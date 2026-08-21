import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { ANALYTICS, SUPPLIERS, ROUTES, RISK_COLORS, classifyRisk } from "@/lib/demoData";
import { DemoBadge, SectionTitle, Panel } from "@/components/ops";

const RANGES = [
  { id: "7d", label: "7-Day", points: 7 },
  { id: "30d", label: "30-Day", points: 12 },
  { id: "90d", label: "90-Day", points: 12 },
  { id: "1y", label: "1-Year", points: 12 },
];

const METRICS = [
  { id: "crudePrice", label: "Crude Price ($/bbl)", color: "#06b6d4" },
  { id: "importVolume", label: "Import Volume (Mbd)", color: "#3b82f6" },
  { id: "shippingCost", label: "Shipping Cost ($/bbl)", color: "#f59e0b" },
  { id: "reserveLevel", label: "Reserve Level (Mbl)", color: "#10b981" },
  { id: "riskTrend", label: "Risk Trend (0-100)", color: "#ef4444" },
  { id: "supplyDemandGap", label: "Supply-Demand Gap (Mbd)", color: "#a855f7" },
];

export default function Analytics() {
  const [metric, setMetric] = useState("crudePrice");
  const [range, setRange] = useState("30d");
  const [showForecast, setShowForecast] = useState(true);

  const data = useMemo(() => {
    const m = METRICS.find((x) => x.id === metric);
    const hist = ANALYTICS[metric].history;
    const fc = ANALYTICS[metric].forecast;
    const n = range === "7d" ? 7 : 12;
    const histSlice = hist.slice(-n);
    const fcSlice = fc.slice(0, range === "7d" ? 7 : 12);
    const combined = [];
    histSlice.forEach((v, i) => combined.push({ label: `H${i + 1}`, historical: v }));
    if (showForecast) fcSlice.forEach((v, i) => combined.push({ label: `F${i + 1}`, forecast: v }));
    return { combined, m };
  }, [metric, range, showForecast]);

  const supplierDependency = SUPPLIERS.map((s) => ({ name: s.country, value: s.contribution_pct, risk: s.risk_score }));
  const routeDependency = ROUTES.map((r) => ({ name: r.name, risk: r.current_risk, capacity: r.capacity_mbd }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Forecasting</h1>
          <p className="text-sm text-slate-400 mt-1">Historical trends & AI forecasts · switch between views</p>
        </div>
        <DemoBadge />
      </div>

      {/* Controls */}
      <Panel className="py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap gap-1">
            {METRICS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  metric === m.id ? "bg-cyan-500/15 text-cyan-300 border border-cyan-700/40" : "text-slate-400 hover:bg-slate-800 border border-transparent"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input type="checkbox" checked={showForecast} onChange={(e) => setShowForecast(e.target.checked)} className="accent-cyan-500" />
              Show AI Forecast
            </label>
            <div className="flex gap-1">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    range === r.id ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle title={data.m.label} subtitle={`${RANGES.find((r) => r.id === range).label} view · historical ${showForecast ? "+ AI forecast" : ""}`} />
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.combined} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={data.m.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={data.m.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="historical" name="Historical" stroke={data.m.color} fill="url(#histGrad)" strokeWidth={2} />
            {showForecast && <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 3" dot={false} />}
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-slate-500 mt-2">Forecast values are simulated AI projections for demonstration.</p>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel>
          <SectionTitle title="Supplier Dependency" subtitle="Share of national crude imports" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={supplierDependency} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} width={80} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" name="Contribution %" radius={[0, 3, 3, 0]}>
                {supplierDependency.map((d, i) => <Cell key={i} fill={RISK_COLORS[classifyRisk(d.risk)].hex} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <SectionTitle title="Route Risk & Capacity" subtitle="Corridor risk vs throughput capacity" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={routeDependency} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9 }} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="risk" name="Risk Score" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="capacity" name="Capacity (Mbd)" fill="#06b6d4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
