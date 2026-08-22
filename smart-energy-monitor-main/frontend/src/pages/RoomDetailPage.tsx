import React, { useEffect, useState } from 'react';
import { ArrowLeft, Sliders, CheckCircle2, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RoomDetail, AnomalyEvent } from '../types';
import { apiService } from '../services/api';

interface RoomDetailPageProps {
  roomId: string;
  onBack: () => void;
}

const DEVICE_COLORS = ['#0d9488', '#f59e0b', '#10b981', '#f43f5e'];

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
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs">Fetching live telemetry stream for {roomId}...</p>
      </div>
    );
  }

  const effectiveEstimatedCost = isEcoModeActive ? Math.round(detail.estimated_cost * 0.78) : detail.estimated_cost;
  const effectiveProjectedCost = isEcoModeActive ? Math.round(detail.projected_cost * 0.75) : detail.projected_cost;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Eco Thermostat Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold font-heading text-slate-100">{detail.name}</h2>
              <StatusBadge status={detail.status} size="md" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{detail.floor} • Hostel Block B</p>
          </div>
        </div>

        <button
          onClick={() => setIsEcoModeActive(!isEcoModeActive)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all ${
            isEcoModeActive
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isEcoModeActive ? '✓ 24°C Eco Mode Active (-22% Cost)' : '⚡ Enable 24°C Thermostat Eco Mode'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Consumption</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-mono text-slate-50">{detail.total_consumption_kwh}</span>
            <span className="text-sm font-semibold text-teal-400">kWh</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Accrued Cost</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">₹{effectiveEstimatedCost}</span>
            {isEcoModeActive && <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">-22%</span>}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Projected 30-Day Cost</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-mono text-amber-400">₹{effectiveProjectedCost}</span>
            {isEcoModeActive && <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">-25%</span>}
          </div>
        </div>
      </div>

      {/* 24-Hour Telemetry Chart */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-sm text-slate-100 font-heading">Power Telemetry Curve</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Sampling interval: hourly</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={detail.history || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="roomUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(val: any) => [`${val} kWh`, 'Power']}
              />
              <Area type="monotone" dataKey="consumption_kwh" stroke="#0d9488" strokeWidth={2} fill="url(#roomUsage)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Breakdown & Room Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Devices */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 font-heading">Connected Device Telemetry</h3>
          <div className="space-y-3">
            {detail.devices.map((device, idx) => (
              <div key={device.id} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[idx % DEVICE_COLORS.length] }}></div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">{device.name || device.category}</h4>
                    <span className="text-[11px] text-slate-400">{device.category}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-xs text-slate-200 block">{device.consumption_kwh} kWh</span>
                  <span className="text-[10px] text-slate-400 block">{device.percentage}% of room load</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Anomaly Alerts & Action */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 font-heading">Active Anomaly & Optimization</h3>
          {detail.active_anomalies && detail.active_anomalies.length > 0 ? (
            <div className="space-y-3">
              {detail.active_anomalies.map((anom: AnomalyEvent, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-300 text-xs">Abnormal Spike Event</span>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">+{anom.deviation_percent}%</span>
                  </div>
                  <p className="text-xs text-slate-300">Observed {anom.actual_value} kWh vs expected baseline {anom.expected_min}-{anom.expected_max} kWh.</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/80 rounded-xl border border-slate-800 text-slate-400 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">No Active Anomalies in {detail.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
