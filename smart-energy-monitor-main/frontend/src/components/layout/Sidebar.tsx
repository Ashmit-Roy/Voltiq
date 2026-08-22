import React from 'react';
import {
  LayoutDashboard,
  Home,
  HardDrive,
  Bell,
  Trophy,
  BarChart3,
  Zap,
  Cpu,
  Sparkles
} from 'lucide-react';

export type NavTab = 'dashboard' | 'rooms' | 'devices' | 'alerts' | 'rankings' | 'analytics';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeAlertCount?: number;
  dataSourceStatus?: { connected: boolean; source_type: string };
  onOpenTradableHub?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeAlertCount = 0,
  dataSourceStatus,
  onOpenTradableHub,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'rooms' as NavTab, label: 'Rooms Telemetry', icon: Home },
    { id: 'devices' as NavTab, label: 'Devices Breakdown', icon: HardDrive },
    { id: 'alerts' as NavTab, label: 'Anomaly Alerts', icon: Bell, badge: activeAlertCount > 0 ? activeAlertCount : undefined },
    { id: 'rankings' as NavTab, label: 'Efficiency Rankings', icon: Trophy },
    { id: 'analytics' as NavTab, label: 'Forecasting & TOU', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between hidden md:flex h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center space-x-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-950/40">
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-heading font-extrabold text-lg text-white tracking-tight">Voltiq</h1>
              <span className="text-[10px] font-bold font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">PS-07</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Energy Telemetry</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tradable Modules Marketplace Hub Banner */}
      <div className="p-3.5 m-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Tradable Engines</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            {dataSourceStatus?.connected !== false ? '3 Active' : 'Offline'}
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-400">01. Ingest:</span>
            </span>
            <span className="text-amber-400 font-semibold">Ready</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span className="text-slate-400">02. Anomaly:</span>
            </span>
            <span className="text-rose-400 font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span className="text-slate-400">03. Forecast:</span>
            </span>
            <span className="text-teal-400 font-semibold">Active</span>
          </div>
        </div>

        {onOpenTradableHub && (
          <button
            onClick={onOpenTradableHub}
            className="w-full mt-2 py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Inspect Tradable Hub</span>
          </button>
        )}
      </div>
    </aside>
  );
};
