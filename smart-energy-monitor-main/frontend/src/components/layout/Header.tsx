import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Sun,
  Moon,
  DoorOpen,
  Cpu,
  AlertTriangle,
  X,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { RoomItem, DeviceItem, AlertItem } from '../../types';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeAlertCount?: number;
  onTriggerSpikeScenario: () => void;
  isSimulating?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  rooms?: RoomItem[];
  devices?: DeviceItem[];
  alerts?: AlertItem[];
  onSelectRoom?: (roomId: string) => void;
  onOpenTradableHub?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onTriggerSpikeScenario,
  isSimulating = false,
  theme = 'dark',
  onToggleTheme,
  rooms = [],
  devices = [],
  alerts = [],
  onSelectRoom,
  onOpenTradableHub,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const titles: Record<NavTab, { title: string; desc: string; engineBadge?: string; badgeColor?: string }> = {
    dashboard: {
      title: 'Hostel Energy Overview',
      desc: 'Real-time telemetry streams, anomaly triage, and algorithmic cost forecasts',
      engineBadge: 'Multi-Engine Overview',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    rooms: {
      title: 'Room-wise Telemetry',
      desc: 'Comparative breakdown of individual hostel room power metrics and tariffs',
      engineBadge: 'Universal Ingestion',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    devices: {
      title: 'Device-Level Breakdown',
      desc: 'Power distribution across HVAC, computing labs, lighting, and fans',
      engineBadge: 'Ingestion & Normalizer',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    alerts: {
      title: 'Abnormal Usage & Anomaly Triage',
      desc: 'Automated spike identification powered by Z-Score + IQR statistical scoring',
      engineBadge: 'Anomaly Engine v1.0',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
    rankings: {
      title: 'Comparative Energy Leaderboard',
      desc: 'Efficiency scores and conservation benchmarks for hostel blocks',
      engineBadge: 'Efficiency Scorer',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    analytics: {
      title: 'Time-of-Use & Trend Forecasting',
      desc: 'Algorithmic demand projections and TOU peak tariff optimization',
      engineBadge: 'Forecasting Engine v1.0',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    },
  };

  const current = titles[activeTab];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const q = searchQuery.toLowerCase().trim();

  // Filter matching rooms
  const matchingRooms = q
    ? rooms.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.floor.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      )
    : [];

  // Filter matching devices
  const matchingDevices = q
    ? devices.filter((d) => (d.name || d.category).toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
    : [];

  // Filter matching alerts
  const matchingAlerts = q
    ? alerts.filter(
        (a) =>
          a.room_name.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.severity.toLowerCase().includes(q)
      )
    : [];

  const hasResults = matchingRooms.length > 0 || matchingDevices.length > 0 || matchingAlerts.length > 0;

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Page Context */}
      <div>
        <div className="flex items-center space-x-2.5">
          <h2 className="text-xl font-bold font-heading text-slate-100">{current.title}</h2>
          {current.engineBadge && (
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${current.badgeColor}`}>
              {current.engineBadge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{current.desc}</p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
        {/* Global Search */}
        <div className="relative flex-1 md:w-64" ref={searchRef}>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search rooms, devices, alerts..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 pl-8 pr-7 py-2 rounded-lg focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && q && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto p-2 text-xs divide-y divide-slate-800">
              {hasResults ? (
                <>
                  {matchingRooms.length > 0 && (
                    <div className="py-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                        Rooms ({matchingRooms.length})
                      </span>
                      {matchingRooms.slice(0, 4).map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            if (onSelectRoom) onSelectRoom(r.id);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-medium text-slate-200">{r.name}</span>
                            <span className="text-[10px] text-slate-400">{r.floor}</span>
                          </div>
                          <span className="font-mono text-slate-300 font-semibold">{r.consumption_kwh} kWh</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingDevices.length > 0 && (
                    <div className="py-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                        Devices ({matchingDevices.length})
                      </span>
                      {matchingDevices.slice(0, 3).map((d) => (
                        <div
                          key={d.id}
                          onClick={() => {
                            setActiveTab('devices');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Cpu className="w-3.5 h-3.5 text-teal-400" />
                            <span className="font-medium text-slate-200">{d.name || d.category}</span>
                          </div>
                          <span className="font-mono text-slate-300">{d.consumption_kwh} kWh</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingAlerts.length > 0 && (
                    <div className="py-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                        Anomaly Alerts ({matchingAlerts.length})
                      </span>
                      {matchingAlerts.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          onClick={() => {
                            setActiveTab('alerts');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span className="font-medium text-slate-200">{a.room_name}</span>
                          </div>
                          <span className="font-mono font-bold text-rose-400">{a.actual_value} kWh</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 text-center text-slate-400">No matching telemetry or rooms found.</div>
              )}
            </div>
          )}
        </div>

        {/* Tradable Modules Button */}
        {onOpenTradableHub && (
          <button
            onClick={onOpenTradableHub}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center space-x-1.5 shrink-0"
            title="Inspect 3 Standalone Tradable Engines"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tradable Hub</span>
          </button>
        )}

        {/* Live Spike Scenario Trigger */}
        <button
          onClick={onTriggerSpikeScenario}
          disabled={isSimulating}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center space-x-1.5 shrink-0 active:scale-95 disabled:opacity-50"
          title="Trigger abnormal consumption spike evaluated by anomaly-detection-engine"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden lg:inline">{isSimulating ? 'Evaluating...' : 'Simulate Spike'}</span>
        </button>

        {/* Theme Switcher Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors shrink-0"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-400" />}
          </button>
        )}
      </div>
    </header>
  );
};
