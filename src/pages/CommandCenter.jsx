import React, { useState, useEffect } from "react";
import {
  Shield, AlertTriangle, Gauge, Ship, DollarSign, Activity, TrendingUp,
  Radar, FlaskConical, FileText, Sparkles, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { NATIONAL, SUPPLIERS, ROUTES, SEED_ALERTS, RISK_COLORS, classifyRisk } from "@/lib/demoData";
import { StatCard, RiskBadge, DemoBadge, SectionTitle, Panel, RiskBar } from "@/components/ops";

export default function CommandCenter() {
  const [brief, setBrief] = useState("");
  const [briefLoading, setBriefLoading] = useState(true);
  const [briefError, setBriefError] = useState(false);

  const topRisks = [
    { label: "Strait of Hormuz — elevated naval activity", score: 74 },
    { label: "Red Sea / Bab el-Mandeb rerouting", score: 68 },
    { label: "Iran sanctions — retaliatory risk", score: 88 },
    { label: "Brent price spike (+6.2%)", score: 64 },
    { label: "Venezuela production decline", score: 78 },
  ];
  const topActions = [
    "Diversify near-term procurement to Atlantic basin (USA, Brazil)",
    "Pre-position Cape of Good Hope charter capacity",
    "Review Hormuz-dependent refinery throughput",
    "Initiate Conservative reserve review",
    "Hedge freight exposure for 60 days",
  ];

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await base44.functions.invoke("AISituationBrief", {
          context: {
            scenarioName: "Current operational state",
            disruptionRisk: NATIONAL.supplyDisruptionRisk,
            supplyGap: "0.0 mbd (baseline)",
            reserveDays: NATIONAL.strategicReserveDays,
            topRisks: topRisks.map((r) => r.label),
            topActions: topActions,
          },
        });
        if (active) {
          setBrief(res.data?.brief || res.brief || "");
          setBriefLoading(false);
        }
      } catch (e) {
        if (active) {
          setBriefError(true);
          setBriefLoading(false);
        }
      }
    })();
    return () => { active = false; };
  }, []);

  const criticalCorridors = ROUTES.filter((r) => r.current_risk >= 55).sort((a, b) => b.current_risk - a.current_risk);
  const activeAlerts = SEED_ALERTS.filter((a) => a.status === "Active");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">National Energy Security Command Center</h1>
          <p className="text-sm text-slate-400 mt-1">Unified situational overview · India crude-oil supply chain</p>
        </div>
        <DemoBadge />
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-cyan-900/40 bg-gradient-to-br from-cyan-950/40 to-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">Energy Security Score</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-cyan-300">{NATIONAL.energySecurityScore}</span>
            <span className="text-sm text-slate-500 mb-1">/100</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1">Moderate · declining trend</div>
        </div>
        <StatCard label="Supply Disruption Risk" value={NATIONAL.supplyDisruptionRisk} unit="/100" accent="amber" icon={AlertTriangle} sub="High · elevated" />
        <StatCard label="Import Dependency" value={NATIONAL.importDependencyPct} unit="%" accent="blue" icon={Gauge} sub={`${NATIONAL.dailyImport_mbd} Mbd imported`} />
        <StatCard label="Strategic Reserve" value={NATIONAL.strategicReserveDays} unit="days" accent="emerald" icon={Shield} sub={`${NATIONAL.strategicReserve_mbl} Mbl stored`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Current Supply Gap" value="0.0" unit="Mbd" accent="emerald" icon={Activity} sub="Baseline — no active shortfall" />
        <StatCard label="Average Import Cost" value={`$${NATIONAL.averageImportCost_usd}`} unit="/bbl" accent="slate" icon={DollarSign} sub="+6.2% week-on-week" />
        <StatCard label="Active Alerts" value={activeAlerts.length} accent="red" icon={AlertTriangle} sub={`${activeAlerts.filter(a=>a.severity==="Critical").length} critical`} />
        <StatCard label="Critical Corridors" value={criticalCorridors.length} accent="amber" icon={Ship} sub="Hormuz, Red Sea, Suez" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Situation Brief */}
        <div className="lg:col-span-2">
          <Panel className="h-full">
            <SectionTitle title="AI Situation Brief" subtitle="Generated by AI Situation Briefing Agent · formal executive assessment" right={<DemoBadge />} />
            {briefLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 py-8">
                <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
                Generating executive assessment…
              </div>
            ) : briefError ? (
              <div className="text-sm text-slate-400 py-4">
                <p className="text-amber-400 mb-2">Briefing agent unavailable — showing fallback assessment:</p>
                <p className="leading-relaxed">
                  Current assessment indicates elevated disruption risk across the primary western import corridor, with the Strait of Hormuz and Red Sea both under heightened threat posture. The model recommends diversifying near-term procurement toward Atlantic-basin suppliers while preserving strategic reserves for prolonged disruption scenarios. Outputs are decision-support and require human validation.
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{brief}</p>
            )}
          </Panel>
        </div>

        {/* Top 5 Risks */}
        <Panel>
          <SectionTitle title="Top 5 Active Risks" />
          <div className="space-y-3">
            {topRisks.map((r, i) => {
              const c = RISK_COLORS[classifyRisk(r.score)];
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300">{r.label}</span>
                    <RiskBadge score={r.score} />
                  </div>
                  <RiskBar score={r.score} />
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Recommended Actions */}
        <Panel>
          <SectionTitle title="Top 5 Recommended Actions" subtitle="AI-prioritised procurement & resilience measures" />
          <div className="space-y-2">
            {topActions.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-md bg-slate-800/40 border border-slate-800">
                <span className="w-6 h-6 rounded bg-cyan-500/15 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm text-slate-300">{a}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Critical corridors */}
        <Panel>
          <SectionTitle title="Critical Corridors" subtitle="Chokepoints above elevated risk threshold" right={<Link to="/routes" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>} />
          <div className="space-y-3">
            {criticalCorridors.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-2.5 rounded-md bg-slate-800/40 border border-slate-800">
                <div>
                  <div className="text-sm text-slate-200 font-medium">{r.name}</div>
                  <div className="text-[11px] text-slate-500">{r.type} · {r.capacity_mbd} Mbd capacity</div>
                </div>
                <RiskBadge score={r.current_risk} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Quick links to modules */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { to: "/risk-intelligence", label: "Risk Intelligence", icon: Radar },
          { to: "/digital-twin", label: "Digital Twin", icon: Ship },
          { to: "/scenario-simulator", label: "Simulator", icon: FlaskConical },
          { to: "/procurement-optimizer", label: "Procurement", icon: TrendingUp },
          { to: "/strategic-reserves", label: "Reserves", icon: Shield },
          { to: "/ai-reports", label: "AI Reports", icon: FileText },
        ].map((q) => {
          const Icon = q.icon;
          return (
            <Link key={q.to} to={q.to} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-cyan-700/50 hover:bg-slate-800/60 transition-colors group">
              <Icon className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm text-slate-200 font-medium">{q.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Open module →</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
