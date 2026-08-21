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
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Filter Tabs */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Abnormal Usage Events & Alerts</h3>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab} ({alerts.filter((a) => (tab === 'ALL' ? true : a.status === tab)).length})
            </button>
          ))}
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
