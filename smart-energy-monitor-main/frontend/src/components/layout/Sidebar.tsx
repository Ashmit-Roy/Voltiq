import React from 'react';
import {
  LayoutDashboard,
  Home,
  HardDrive,
  Bell,
  Trophy,
  BarChart3,
  Zap,
  Activity,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'rooms' | 'devices' | 'alerts' | 'rankings' | 'analytics';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeAlertCount?: number;
  dataSourceStatus?: { connected: boolean; source_type: string };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeAlertCount = 0,
  dataSourceStatus,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms' as NavTab, label: 'Rooms Overview', icon: Home },
    { id: 'devices' as NavTab, label: 'Devices Breakdown', icon: HardDrive },
    { id: 'alerts' as NavTab, label: 'Alerts', icon: Bell, badge: activeAlertCount > 0 ? activeAlertCount : undefined },
    { id: 'rankings' as NavTab, label: 'Rankings', icon: Trophy },
    { id: 'analytics' as NavTab, label: 'Energy Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between hidden md:flex h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-heading font-extrabold text-xl text-white tracking-wide">Voltiq</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">PS-07</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Smart Energy Monitor</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Data Ingestion Status Widget */}
      <div className="p-4 m-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dataSourceStatus?.connected !== false ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dataSourceStatus?.connected !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </span>
          <span className="font-semibold text-slate-200">Data Pipeline</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Source: <span className="text-emerald-400 font-mono font-medium">{dataSourceStatus?.source_type || 'simulated_iot'}</span>
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span>3 Tradable Engines Active</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
