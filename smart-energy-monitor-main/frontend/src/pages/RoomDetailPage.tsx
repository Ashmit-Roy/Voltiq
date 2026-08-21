import React, { useEffect, useState } from 'react';
import { ArrowLeft, Zap, AlertTriangle, Lightbulb, CheckCircle, Sliders, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AnomalyCard } from '../components/ui/AnomalyCard';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { RoomDetail, AnomalyEvent, RecommendationItem } from '../types';
import { apiService } from '../services/api';

interface RoomDetailPageProps {
  roomId: string;
  onBack: () => void;
}

const DEVICE_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fbbf24'];

export const RoomDetailPage: React.FC<RoomDetailPageProps> = ({ roomId, onBack }) => {
  const [detail, setDetail] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEcoModeActive, setIsEcoModeActive] = useState(false);

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

  const effectiveEstimatedCost = isEcoModeActive ? Math.round(detail.estimated_cost * 0.78) : detail.estimated_cost;
  const effectiveProjectedCost = isEcoModeActive ? Math.round(detail.projected_cost * 0.75) : detail.projected_cost;

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

        {/* Interactive Eco Thermostat Control Toggle */}
        <button
          onClick={() => setIsEcoModeActive(!isEcoModeActive)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all ${
            isEcoModeActive
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-950/50'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isEcoModeActive ? '🟢 Eco Mode Active (24°C Limit)' : '⚡ Enable 24°C Thermostat Eco Mode'}</span>
        </button>
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
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">₹{effectiveEstimatedCost}</span>
            {isEcoModeActive && <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">-22%</span>}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Projected Period Cost</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-mono text-purple-400">₹{effectiveProjectedCost}</span>
            {isEcoModeActive && <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded">-25%</span>}
          </div>
        </div>
      </div>

      {/* Consumption Timeline Chart & Room Appliance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card lg:col-span-2 rounded-2xl p-5 border border-slate-800">
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
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#ffffff' }}
                  itemStyle={{ color: '#10b981', fontWeight: 700 }}
                  labelStyle={{ color: '#ffffff', fontWeight: 700 }}
                  formatter={(val: any) => [`${val} kWh`, 'Consumption']}
                />
                <Area type="monotone" dataKey="consumption_kwh" stroke="#10b981" strokeWidth={3} fill="url(#roomColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Device Appliance Breakdown */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-slate-100 mb-1 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Room Device Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Appliance level consumption share</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={detail.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="consumption_kwh"
                  >
                    {detail.devices.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#38bdf8', borderRadius: '0.75rem', fontSize: '12px', color: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#38bdf8', fontWeight: 700 }}
                    labelStyle={{ color: '#ffffff', fontWeight: 700 }}
                    formatter={(val: any) => [`${val} kWh`, 'Usage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            {detail.devices.map((dev, idx) => (
              <div key={dev.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[idx % DEVICE_COLORS.length] }}></span>
                  <span className="text-slate-300">{dev.category}</span>
                </div>
                <span className="font-semibold text-slate-100">{dev.consumption_kwh} kWh</span>
              </div>
            ))}
          </div>
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
            (() => {
              const seen = new Set<string>();
              return detail.active_anomalies
                .filter((anom: AnomalyEvent) => {
                  const key = `${anom.actual_value}-${anom.severity}-${anom.status}`;
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                })
                .map((anom: AnomalyEvent, idx: number) => (
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
                ));
            })()
          )}
        </div>

        {/* Energy Saving Recommendations */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-slate-100 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Energy Savings Recommendations</span>
          </h3>
          {(() => {
            const seen = new Set<string>();
            return detail.recommendations
              .filter((rec: RecommendationItem) => {
                const key = rec.id ? `${rec.id}` : `${rec.title}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              })
              .map((rec: RecommendationItem) => (
                <RecommendationCard
                  key={rec.id}
                  title={rec.title}
                  roomName={detail.name}
                  description={rec.description}
                  suggestedAction={rec.suggested_action}
                  potentialSavings={rec.potential_savings}
                  severity={rec.severity}
                />
              ));
          })()}
        </div>
      </div>
    </div>
  );
};

