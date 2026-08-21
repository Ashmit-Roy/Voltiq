import React from 'react';
import {
  Bell,
  Search,
  Sparkles,
  UserCheck,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeAlertCount: number;
  onTriggerSpikeScenario: () => void;
  isSimulating?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeAlertCount,
  onTriggerSpikeScenario,
  isSimulating = false,
  theme = 'dark',
  onToggleTheme,
}) => {
  const titles: Record<NavTab, { title: string; desc: string }> = {
    dashboard: {
      title: 'Admin Energy Overview',
      desc: 'Real-time hostel energy consumption, anomaly flags, and cost projections',
    },
    rooms: {
      title: 'Room-wise Monitoring',
      desc: 'Comparative breakdown of individual room usage, costs, and statuses',
    },
    devices: {
      title: 'Device Consumption Breakdown',
      desc: 'Track air conditioners, gaming PCs, lighting systems, and appliance metrics',
    },
    alerts: {
      title: 'Abnormal Usage & Anomaly Alerts',
      desc: 'Review live power surges and mark resolved anomalies',
    },
    rankings: {
      title: 'Comparative Rankings & Leaderboard',
      desc: 'Identify top energy savers and high-consuming hostel units',
    },
    analytics: {
      title: 'Energy Analytics & Modular Architecture',
      desc: 'Historical trend analysis and HACQUIRE tradable engine status',
    },
  };

  const current = titles[activeTab];

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold font-heading text-slate-50 flex items-center space-x-2">
          <span>{current.title}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{current.desc}</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        {/* Search Input */}
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search rooms, devices..."
            className="bg-slate-950/70 border border-slate-800 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-emerald-500/50 w-48 lg:w-64 transition-all"
          />
        </div>

        {/* Live Simulation Action Button */}
        <button
          onClick={onTriggerSpikeScenario}
          disabled={isSimulating}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-950/40 active:scale-95 disabled:opacity-50"
          title="Simulate a live power spike in Room 203 to demonstrate real-time ingestion, anomaly detection, alert dispatch & recommendation"
        >
          {isSimulating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          )}
          <span>{isSimulating ? 'Simulating Spike...' : 'Simulate AC Spike'}</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => setActiveTab('alerts')}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 relative transition-colors"
          title="View Alerts"
        >
          <Bell className="w-4 h-4" />
          {activeAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
              {activeAlertCount}
            </span>
          )}
        </button>

        {/* Dark / Light Mode Toggle Button (directly to the right of alert symbol) */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-colors flex items-center justify-center"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* Admin Profile Chip */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200">Hostel Admin</p>
            <p className="text-[10px] text-slate-400">Block B Facility</p>
          </div>
        </div>
      </div>
    </header>
  );
};

