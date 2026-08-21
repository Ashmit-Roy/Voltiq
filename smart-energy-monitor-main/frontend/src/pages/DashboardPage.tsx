import React, { useState } from 'react';
import {
  Zap,
  Activity,
  IndianRupee,
  CalendarCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Layers,
  ChevronRight,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AnomalyCard } from '../components/ui/AnomalyCard';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { DashboardSummary, DashboardTrendsResponse, RoomItem, AlertItem, RecommendationItem } from '../types';

interface DashboardPageProps {
  summary: DashboardSummary | null;
  trends: DashboardTrendsResponse | null;
  rooms: RoomItem[];
  alerts: AlertItem[];
  recommendations: RecommendationItem[];
  onSelectRoom: (roomId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onTimeframeChange: (timeframe: 'daily' | 'weekly' | 'monthly') => void;
  onTriggerSpike: () => void;
  onResetTelemetry?: () => void;
  onResolveAlert: (alertId: string) => void;
  isSimulating?: boolean;
}

const DEVICE_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f43f5e'];
const BUDGET_CEILING = 200000; // Monthly budget target limit in INR for Block B Hostel

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  trends,
  rooms,
  alerts,
  recommendations,
  onSelectRoom,
  onNavigateToTab,
  onTimeframeChange,
  onTriggerSpike,
  onResetTelemetry,
  onResolveAlert,
  isSimulating = false,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleTimeframeToggle = (tf: 'daily' | 'weekly' | 'monthly') => {
    setSelectedTimeframe(tf);
    onTimeframeChange(tf);
  };

  const deviceDistributionData = [
    { name: 'Air Conditioner', value: 408, percentage: 48 },
    { name: 'Computers & Gaming', value: 187, percentage: 22 },
    { name: 'Lighting Systems', value: 136, percentage: 16 },
    { name: 'Ceiling & Exhaust Fans', value: 85, percentage: 10 },
    { name: 'Other Appliances', value: 34, percentage: 4 },
  ];

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const totalKwh = summary?.total_consumption_kwh || 3800.0;
  const projectedBill = summary?.projected_bill || 128400.0;
  const budgetUsagePercent = Math.min(100, Math.round((projectedBill / BUDGET_CEILING) * 100));
  const carbonFootprintKg = (totalKwh * 0.85).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hardware Simulation & Connection Banner */}
      <div className="glass-panel rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-emerald-500/20 glow-border-emerald">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-slate-100">🟢 Data Source Connected</span>
              <span className="text-[11px] bg-slate-800 text-emerald-400 font-mono font-medium px-2 py-0.5 rounded border border-slate-700">
                {summary?.data_source_status?.source_type || 'simulated_iot'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Receiving live telemetry. Last updated: <span className="text-slate-300 font-medium">{summary?.data_source_status?.last_updated || 'Just now'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {onResetTelemetry && (
            <button
              onClick={onResetTelemetry}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 active:scale-95"
              title="Reset telemetry database back to clean starting baseline"
            >
              Reset Baseline
            </button>
          )}
          <button
            onClick={onTriggerSpike}
            disabled={isSimulating}
            className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{isSimulating ? 'Processing Live Spike...' : 'Trigger Live AC Spike'}</span>
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Energy Usage"
          value={`${totalKwh} kWh`}
          subtext={`🌱 ~${carbonFootprintKg} kg CO₂ offset target`}
          trend={{ value: 8.4, isPositiveGood: false, label: 'vs last week' }}
          icon={Zap}
          accentColor="emerald"
        />
        <StatCard
          title="Current Load"
          value={`${summary?.current_load_kw || 42.6} kW`}
          subtext="Active demand across hostel"
          icon={Activity}
          accentColor="cyan"
        />
        <StatCard
          title="Estimated Cost"
          value={`₹${(summary?.estimated_cost || 6840).toLocaleString('en-IN')}`}
          subtext="Rate: ₹8 / kWh"
          icon={IndianRupee}
          accentColor="amber"
        />
        <StatCard
          title="Projected Bill"
          value={`₹${projectedBill.toLocaleString('en-IN')}`}
          subtext={`${budgetUsagePercent}% of ₹2,00,000 target`}
          icon={CalendarCheck}
          accentColor="purple"
        />
        <StatCard
          title="Active Alerts"
          value={summary?.active_alerts ?? activeAlerts.length}
          subtext={`${activeAlerts.filter(a => a.severity === 'HIGH').length} critical requiring action`}
          icon={AlertCircle}
          accentColor={activeAlerts.length > 0 ? 'rose' : 'emerald'}
        />
      </div>

      {/* 2b. Projected Bill Budget Progress Bar Banner */}
      <div className="glass-card rounded-xl p-4 border border-purple-500/20 glow-border-purple flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Monthly Electricity Budget Forecast</h4>
            <p className="text-[11px] text-slate-400">
              Target Limit: <span className="font-semibold text-slate-200">₹2,00,000</span> | Projected: <span className="font-semibold text-purple-400">₹{projectedBill.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>
        <div className="w-full sm:w-64 space-y-1">
          <div className="flex justify-between text-[11px] font-medium">
            <span className="text-slate-400">Budget Usage</span>
            <span className={budgetUsagePercent > 90 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {budgetUsagePercent}%
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUsagePercent > 90
                  ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                  : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
              }`}
              style={{ width: `${budgetUsagePercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. Charts Section: Energy Consumption Trend & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Consumption Trend Chart */}
        <div className="glass-card lg:col-span-2 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-semibold text-lg text-slate-100 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Energy Consumption Trend</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Electricity demand pattern over selected timeframe with baseline reference</p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => handleTimeframeToggle(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends?.data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} kWh`, 'Consumption']}
                />
                <ReferenceLine
                  y={50}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  label={{ value: 'Target Baseline (50 kWh)', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }}
                />
                <Area
                  type="monotone"
                  dataKey="consumption_kwh"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorConsumption)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution Donut Chart */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base text-slate-100 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Device Distribution</span>
              </h3>
              <button
                onClick={() => onNavigateToTab('devices')}
                className="text-xs text-emerald-400 hover:underline flex items-center space-x-0.5 font-medium"
              >
                <span>View Breakdown</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Percentage share of total consumption</p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deviceDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#38bdf8',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#ffffff',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                    itemStyle={{ color: '#38bdf8', fontWeight: 700 }}
                    labelStyle={{ color: '#ffffff', fontWeight: 700 }}
                    formatter={(value: any, name: any) => [`${value} kWh`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2 pt-3 border-t border-slate-800/80">
            {deviceDistributionData.slice(0, 3).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[idx] }}></span>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-100">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Active Anomaly Alert Banner (if any) */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-slate-100 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Active Abnormal Consumption Flags</span>
            </h3>
            <button
              onClick={() => onNavigateToTab('alerts')}
              className="text-xs text-rose-400 hover:underline font-medium"
            >
              View All Alerts ({activeAlerts.length})
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAlerts.slice(0, 2).map((alert) => (
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
        </div>
      )}

      {/* 5. Quick Room Overview & Energy Savings Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Energy Overview Table */}
        <div className="glass-card lg:col-span-2 rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base text-slate-100">Room Energy Overview</h3>
              <p className="text-xs text-slate-400">Hostel room consumption comparison & trends</p>
            </div>
            <button
              onClick={() => onNavigateToTab('rooms')}
              className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-medium"
            >
              <span>View All Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-2">Room</th>
                  <th className="pb-3 px-2">Consumption</th>
                  <th className="pb-3 px-2">Est. Cost</th>
                  <th className="pb-3 px-2">Trend</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rooms.slice(0, 5).map((room) => (
                  <tr key={room.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3 px-2 font-semibold text-slate-100">
                      <div>
                        <span>{room.name}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">{room.floor}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono font-medium text-slate-200">
                      {room.consumption_kwh} kWh
                    </td>
                    <td className="py-3 px-2 font-semibold text-emerald-400">
                      ₹{room.cost}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-semibold ${room.trend_percent > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {room.trend_percent > 0 ? `↑ ${room.trend_percent}%` : `↓ ${Math.abs(room.trend_percent)}%`}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={room.status} size="sm" />
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => onSelectRoom(room.id)}
                        className="text-xs text-slate-300 group-hover:text-emerald-400 hover:underline font-medium"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-slate-100">AI Savings Recommendations</h3>
          </div>
          {recommendations.slice(0, 2).map((rec) => (
            <RecommendationCard
              key={rec.id}
              title={rec.title}
              roomName={rec.room_name || rec.room_id}
              description={rec.description}
              suggestedAction={rec.suggested_action}
              potentialSavings={rec.potential_savings}
              severity={rec.severity}
              onTakeAction={() => onSelectRoom(rec.room_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

