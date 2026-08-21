import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Sparkles,
  UserCheck,
  RefreshCw,
  Sun,
  Moon,
  DoorOpen,
  Cpu,
  AlertTriangle,
  X
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { RoomItem, DeviceItem, AlertItem } from '../../types';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeAlertCount: number;
  onTriggerSpikeScenario: () => void;
  isSimulating?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  rooms?: RoomItem[];
  devices?: DeviceItem[];
  alerts?: AlertItem[];
  onSelectRoom?: (roomId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeAlertCount,
  onTriggerSpikeScenario,
  isSimulating = false,
  theme = 'dark',
  onToggleTheme,
  rooms = [],
  devices = [],
  alerts = [],
  onSelectRoom,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
      title: 'Energy Analytics & Efficiency Insights',
      desc: 'Time-of-use tariffs, floor comparisons, carbon footprint, and sustainability metrics',
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
    ? devices.filter(
        (d) =>
          d.category.toLowerCase().includes(q) ||
          (d.name && d.name.toLowerCase().includes(q)) ||
          d.id.toLowerCase().includes(q)
      )
    : [];

  // Filter matching alerts
  const matchingAlerts = q
    ? alerts.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.room_name.toLowerCase().includes(q) ||
          a.room_id.toLowerCase().includes(q)
      )
    : [];

  const hasResults = matchingRooms.length > 0 || matchingDevices.length > 0 || matchingAlerts.length > 0;

  const handleSelectRoomResult = (roomId: string) => {
    if (onSelectRoom) {
      onSelectRoom(roomId);
    } else {
      setActiveTab('rooms');
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectDeviceResult = () => {
    setActiveTab('devices');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectAlertResult = () => {
    setActiveTab('alerts');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 sticky top-0 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold font-heading text-slate-50 flex items-center space-x-2">
          <span>{current.title}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{current.desc}</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        {/* Interactive Search Bar & Dropdown */}
        <div ref={searchRef} className="relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search rooms (203), devices, alerts..."
            className="bg-slate-950/70 border border-slate-800 text-xs text-slate-200 pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:border-emerald-500/50 w-56 lg:w-72 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Results Dropdown Menu */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 mt-2 w-80 lg:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in divide-y divide-slate-800/60">
              {!hasResults ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching rooms, appliances, or alerts found for "{searchQuery}".
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                  {/* Matching Rooms */}
                  {matchingRooms.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                        <DoorOpen className="w-3 h-3 text-emerald-400" />
                        <span>Rooms ({matchingRooms.length})</span>
                      </div>
                      {matchingRooms.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleSelectRoomResult(r.id)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 block">{r.name}</span>
                            <span className="text-[10px] text-slate-400">{r.floor} • {r.consumption_kwh} kWh</span>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            r.status === 'abnormal' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {r.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matching Devices */}
                  {matchingDevices.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        <span>Devices & Appliances ({matchingDevices.length})</span>
                      </div>
                      {matchingDevices.map((d) => (
                        <button
                          key={d.id}
                          onClick={handleSelectDeviceResult}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 block">{d.category}</span>
                            <span className="text-[10px] text-slate-400">{d.consumption_kwh} kWh ({d.percentage}%)</span>
                          </div>
                          <span className="text-xs text-slate-400">View →</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matching Alerts */}
                  {matchingAlerts.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>Active Alerts ({matchingAlerts.length})</span>
                      </div>
                      {matchingAlerts.map((a) => (
                        <button
                          key={a.id}
                          onClick={handleSelectAlertResult}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                        >
                          <div className="pr-2">
                            <span className="text-xs font-bold text-rose-300 block truncate">{a.title}</span>
                            <span className="text-[10px] text-slate-400">{a.room_name} • {a.actual_value} kWh</span>
                          </div>
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                            {a.severity}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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

        {/* Dark / Light Mode Toggle Button */}
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
