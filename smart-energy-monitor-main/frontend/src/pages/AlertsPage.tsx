import React, { useState } from 'react';
import { CheckCircle, ShieldAlert } from 'lucide-react';
import { AnomalyCard } from '../components/ui/AnomalyCard';
import { AlertItem } from '../types';

interface AlertsPageProps {
  alerts: AlertItem[];
  onSelectRoom: (roomId: string) => void;
  onResolveAlert: (alertId: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, onSelectRoom, onResolveAlert }) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'RESOLVED'>('ALL');

  // Deduplicate locally — guard against backend sending duplicate records
  const uniqueAlerts = React.useMemo(() => {
    const seen = new Set<string>();
    return alerts.filter((a) => {
      const id = (a as any).alert_id || a.id;
      const key = id
        ? `${id}::${a.room_id}::${a.title}`
        : `${a.room_id || a.room_name}::${a.title}::${a.actual_value}::${a.timestamp}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [alerts]);

  const filteredAlerts = uniqueAlerts.filter((a) => {
    if (filter === 'ALL') return true;
    if (filter === 'RESOLVED') return a.status === 'RESOLVED';
    return a.status === 'ACTIVE' && a.severity === filter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Filter Tabs */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Abnormal Energy Usage Alerts</h3>
            <p className="text-[11px] text-slate-400">Section 16 — Filter events by severity or resolution status</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW', 'RESOLVED'] as const).map((tab) => {
            const count = uniqueAlerts.filter((a) => {
              if (tab === 'ALL') return true;
              if (tab === 'RESOLVED') return a.status === 'RESOLVED';
              return a.status === 'ACTIVE' && a.severity === tab;
            }).length;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  filter === tab
                    ? tab === 'HIGH'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : tab === 'MEDIUM'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert List */}
      {filteredAlerts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 space-y-3 border border-slate-800">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="font-semibold text-slate-200 text-base">No Alerts Found</h4>
          <p className="text-xs">There are no {filter.toLowerCase()} anomaly alerts matching your current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => (
            <AnomalyCard
              key={alert.id}
              roomName={alert.room_name}
              actualValue={alert.actual_value}
              expectedMin={10}
              expectedMax={15}
              deviationPercent={156}
              severity={alert.severity}
              timestamp={alert.timestamp}
              onInvestigate={() => onSelectRoom(alert.room_id)}
              onResolve={() => onResolveAlert(alert.id)}
              status={alert.status}
            />
          ))}
        </div>
      )}
    </div>
  );
};

