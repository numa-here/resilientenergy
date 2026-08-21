import React, { useState, useEffect } from "react";
import { BellRing, CheckCircle2, Search, Filter, AlertTriangle, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { SEED_ALERTS, RISK_COLORS, classifyRisk } from "@/lib/demoData";
import { RiskBadge, DemoBadge, SectionTitle, Panel } from "@/components/ops";

const STATUSES = ["Active", "Acknowledged", "Investigating", "Resolved"];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.Alert.list("-timestamp", 100);
      if (list && list.length) {
        setAlerts(list);
      } else {
        // fallback to seed data if entity empty
        setAlerts(SEED_ALERTS.map((a, i) => ({ id: `seed-${i}`, ...a })));
      }
    } catch (e) {
      setAlerts(SEED_ALERTS.map((a, i) => ({ id: `seed-${i}`, ...a })));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    if (String(id).startsWith("seed-")) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      return;
    }
    try {
      await base44.entities.Alert.update(id, { status });
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (e) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  };

  const filtered = alerts.filter((a) => {
    if (filter !== "All" && a.severity !== filter) return false;
    if (query && !a.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const counts = {
    Critical: alerts.filter((a) => a.severity === "Critical").length,
    High: alerts.filter((a) => a.severity === "High").length,
    Active: alerts.filter((a) => a.status === "Active").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert & Incident Management</h1>
          <p className="text-sm text-slate-400 mt-1">Geopolitical events, sanctions, shipping disruptions, price shocks</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-4">
          <div className="text-[11px] uppercase text-slate-400">Critical</div>
          <div className="text-2xl font-bold text-red-400">{counts.Critical}</div>
        </div>
        <div className="rounded-lg border border-orange-900/40 bg-orange-950/20 p-4">
          <div className="text-[11px] uppercase text-slate-400">High Severity</div>
          <div className="text-2xl font-bold text-orange-400">{counts.High}</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-[11px] uppercase text-slate-400">Active</div>
          <div className="text-2xl font-bold text-amber-300">{counts.Active}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search alerts…" className="input pl-9" />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="w-4 h-4 text-slate-500" />
          {["All", "Critical", "High", "Moderate", "Low"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded text-xs font-medium ${filter === f ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800"}`}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400 py-8 text-center">Loading alerts…</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Panel key={a.id} className="py-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <RiskBadge score={a.risk_score} />
                    <span className="text-[10px] uppercase text-slate-500 tracking-wide">{a.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      a.status === "Active" ? "bg-amber-500/15 text-amber-300" :
                      a.status === "Acknowledged" ? "bg-blue-500/15 text-blue-300" :
                      a.status === "Investigating" ? "bg-purple-500/15 text-purple-300" :
                      "bg-emerald-500/15 text-emerald-300"
                    }`}>{a.status}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">{a.title}</div>
                  <p className="text-xs text-slate-400 mb-2">{a.impact_assessment}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {a.affected_assets && a.affected_assets.map((asset) => (
                      <span key={asset} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{asset}</span>
                    ))}
                  </div>
                  <div className="rounded bg-cyan-950/20 border border-cyan-900/30 p-2 text-xs">
                    <span className="text-cyan-400 font-medium">AI Recommended Action: </span>
                    <span className="text-slate-300">{a.recommended_action}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5">Source: {a.source}</div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                    className="text-xs rounded border border-slate-700 bg-slate-800 px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  {a.status === "Active" && (
                    <button onClick={() => updateStatus(a.id, "Acknowledged")} className="text-xs px-2 py-1 rounded bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-700/40">Acknowledge</button>
                  )}
                  {a.status !== "Resolved" && (
                    <button onClick={() => updateStatus(a.id, "Resolved")} className="text-xs px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-700/40 flex items-center gap-1 justify-center"><CheckCircle2 className="w-3 h-3" /> Resolve</button>
                  )}
                </div>
              </div>
            </Panel>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-slate-500 py-12 text-center">No alerts match the current filter.</div>
          )}
        </div>
      )}
    </div>
  );
}
