import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Radar, Map, FlaskConical, ShoppingCart, Shield,
  Ship, Route as RouteIcon, BarChart3, BellRing, FileText, Menu, X,
  Activity, AlertTriangle,
} from "lucide-react";
import { NATIONAL, DATA_DISCLAIMER, RISK_COLORS, classifyRisk } from "@/lib/demoData";

const NAV = [
  { to: "/", label: "Command Center", icon: LayoutDashboard, end: true },
  { to: "/risk-intelligence", label: "Live Risk Intelligence", icon: Radar },
  { to: "/digital-twin", label: "Digital Twin", icon: Map },
  { to: "/scenario-simulator", label: "Scenario Simulator", icon: FlaskConical },
  { to: "/procurement-optimizer", label: "Procurement Optimizer", icon: ShoppingCart },
  { to: "/strategic-reserves", label: "Strategic Reserves", icon: Shield },
  { to: "/suppliers", label: "Suppliers", icon: Ship },
  { to: "/routes", label: "Routes & Corridors", icon: RouteIcon },
  { to: "/analytics", label: "Analytics & Forecasts", icon: BarChart3 },
  { to: "/alerts", label: "Alerts & Incidents", icon: BellRing },
  { to: "/ai-reports", label: "AI Reports", icon: FileText },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const risk = NATIONAL.supplyDisruptionRisk;
  const cls = RISK_COLORS[classifyRisk(risk)];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">Energy Security</div>
            <div className="text-[10px] text-slate-400 leading-tight">AI Command System</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-2 border-transparent"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="rounded-md bg-slate-800/60 p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Demo Mode</span>
            </div>
            <p className="text-[10px] leading-snug text-slate-500">
              Simulated data for demonstration. Decision-support only — requires human validation.
            </p>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-400" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-base font-semibold text-white leading-tight">
                {NAV.find((n) => n.to === location.pathname)?.label || "Command Center"}
              </h1>
              <p className="text-[11px] text-slate-500 leading-tight">
                Government of India · Ministry-level Decision Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border ${cls.bg} ${cls.border}`}>
              <span className={`w-2 h-2 rounded-full ${cls.dot} animate-pulse`} />
              <span className="text-xs font-medium text-slate-300">Disruption Risk</span>
              <span className={`text-sm font-bold ${cls.text}`}>{risk}</span>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-xs text-slate-400">Energy Security Score</div>
              <div className="text-sm font-bold text-cyan-300">{NATIONAL.energySecurityScore}/100</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>

        <footer className="border-t border-slate-800 bg-slate-900 px-4 lg:px-6 py-2">
          <p className="text-[10px] text-slate-500 text-center">{DATA_DISCLAIMER}</p>
        </footer>
      </div>
    </div>
  );
}
