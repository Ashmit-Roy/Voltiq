import React, { useEffect, useState } from 'react';
import { ArrowLeft, Zap, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AnomalyCard } from '../components/ui/AnomalyCard';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { RoomDetail, AnomalyEvent, RecommendationItem } from '../types';
import { apiService } from '../services/api';

interface RoomDetailPageProps {
  roomId: string;
  onBack: () => void;
}

export const RoomDetailPage: React.FC<RoomDetailPageProps> = ({ roomId, onBack }) => {
  const [detail, setDetail] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiService.getRoomDetail(roomId).then((res) => {
      if (isMounted) {
        setDetail(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [roomId]);

  if (loading || !detail) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs">Fetching live telemetry for {roomId}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold font-heading text-slate-100">{detail.name}</h2>
              <StatusBadge status={detail.status} size="md" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{detail.floor} • Hostel Block B</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Consumption</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-mono text-slate-50">{detail.total_consumption_kwh}</span>
            <span className="text-sm font-semibold text-emerald-400">kWh</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Estimated Cost</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">₹{detail.estimated_cost}</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Projected Period Cost</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-bold font-mono text-purple-400">₹{detail.projected_cost}</span>
          </div>
        </div>
      </div>

      {/* Consumption Timeline Chart */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <h3 className="font-semibold text-base text-slate-100 mb-4 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Detailed Consumption History</span>
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={detail.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="roomColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="consumption_kwh" stroke="#10b981" strokeWidth={3} fill="url(#roomColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Anomaly Events */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-slate-100 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Detected Anomaly Events ({detail.active_anomalies.length})</span>
          </h3>
          {detail.active_anomalies.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center text-xs text-slate-400 border border-slate-800">
              <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <span>No active abnormal consumption events detected in {detail.name}.</span>
            </div>
          ) : (
            detail.active_anomalies.map((anom: AnomalyEvent, idx: number) => (
              <AnomalyCard
                key={idx}
                roomName={detail.name}
                actualValue={anom.actual_value}
                expectedMin={anom.expected_min}
                expectedMax={anom.expected_max}
                deviationPercent={anom.deviation_percent}
                severity={anom.severity}
                status={anom.status}
              />
            ))
          )}
        </div>

        {/* Energy Saving Recommendations */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-slate-100 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Energy Savings Recommendations</span>
          </h3>
          {detail.recommendations.map((rec: RecommendationItem) => (
            <RecommendationCard
              key={rec.id}
              title={rec.title}
              roomName={detail.name}
              description={rec.description}
              suggestedAction={rec.suggested_action}
              potentialSavings={rec.potential_savings}
              severity={rec.severity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
