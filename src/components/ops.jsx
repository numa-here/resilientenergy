import React from "react";
import { RISK_COLORS, STATUS_COLORS, classifyRisk } from "@/lib/demoData";
import { Info } from "lucide-react";

export function RiskBadge({ score, label }) {
  const level = classifyRisk(score);
  const c = RISK_COLORS[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${c.bg} ${c.border} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label ? label : level} {typeof score === "number" ? `· ${score}` : ""}
    </span>
  );
}

export function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Normal;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-slate-700/50 text-slate-400 border border-slate-600/50">
      Simulation
    </span>
  );
}

export function StatCard({ label, value, unit, sub, accent = "cyan", icon: Icon }) {
  const accents = {
    cyan: "text-cyan-300",
    amber: "text-amber-300",
    red: "text-red-400",
    emerald: "text-emerald-300",
    blue: "text-blue-300",
    slate: "text-slate-200",
  };
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">{label}</span>
        {Icon && <Icon className={`w-4 h-4 ${accents[accent]}`} />}
      </div>
      <div className={`text-2xl font-bold ${accents[accent]}`}>
        {value}
        {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
      </div>
      {sub && <div className="text-[11px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

export function SectionTitle({ title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function ExplainCard({ title = "AI Explainability", points = [] }) {
  return (
    <div className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-cyan-300">{title}</span>
      </div>
      <ul className="space-y-1.5">
        {points.map((p, i) => (
          <li key={i} className="text-xs text-slate-300 flex gap-2">
            <span className="text-cyan-500 mt-0.5">›</span>
            <span><span className="text-slate-400">{p.label}:</span> {p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Panel({ children, className = "" }) {
  return <div className={`rounded-lg border border-slate-800 bg-slate-900/60 p-4 ${className}`}>{children}</div>;
}

export function RiskBar({ score }) {
  const level = classifyRisk(score);
  const c = RISK_COLORS[level];
  return (
    <div className="w-full">
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${c.dot}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
