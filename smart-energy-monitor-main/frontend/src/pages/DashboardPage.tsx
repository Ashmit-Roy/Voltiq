import React, { useState } from 'react';
import {
  Zap,
  Activity,
  IndianRupee,
  CalendarCheck,
  AlertCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Target,
  Cpu,
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
  onOpenTradableHub?: () => void;
}

const DEVICE_COLORS = ['#0d9488', '#f59e0b', '#10b981', '#f43f5e', '#64748b'];
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
  onOpenTradableHub,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleTimeframeToggle = (tf: 'daily' | 'weekly' | 'monthly') => {
    setSelectedTimeframe(tf);
    onTimeframeChange(tf);
  };

  const deviceDistributionData = [
    { name: 'Air Conditioning (HVAC)', value: 408, percentage: 48 },
    { name: 'Computer Labs & Gaming', value: 187, percentage: 22 },
    { name: 'Lighting Infrastructure', value: 136, percentage: 16 },
    { name: 'Ceiling & Exhaust Fans', value: 85, percentage: 10 },
    { name: 'Common Area Appliances', value: 34, percentage: 4 },
  ];

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const totalKwh = summary?.total_consumption_kwh || 3800.0;
  const projectedBill = summary?.projected_bill || 128400.0;
  const budgetUsagePercent = Math.min(100, Math.round((projectedBill / BUDGET_CEILING) * 100));
  const carbonFootprintKg = (totalKwh * 0.85).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Tradable Asset 01: Universal Data Ingestion Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-amber-500">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-100 font-heading">
                Tradable Asset 01: Universal Ingestion Pipeline
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono font-semibold px-2 py-0.5 rounded border border-amber-500/20">
                Source: {summary?.data_source_status?.source_type || 'simulated_iot'}
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-semibold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Normalizing Active Telemetry</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Validating schema constraints, multi-device payloads, and unit normalization across hostel smart meters.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
          {onResetTelemetry && (
            <button
              onClick={onResetTelemetry}
              disabled={isSimulating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 active:scale-95 disabled:opacity-50"
              title="Reset telemetry database back to clean baseline"
            >
              Reset Baseline
            </button>
          )}
          {onOpenTradableHub && (
            <button
              onClick={onOpenTradableHub}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center space-x-1"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Inspect Engine</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Primary KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Consumption"
          value={`${totalKwh.toLocaleString()} kWh`}
          subtext={`🌱 ~${carbonFootprintKg} kg CO₂ offset target`}
          trend={{ value: 8.4, isPositiveGood: false, label: 'vs last week' }}
          icon={Zap}
          accentColor="amber"
        />
        <StatCard
          title="Current Demand"
          value={`${summary?.current_load_kw || 42.6} kW`}
          subtext="Aggregate active load"
          icon={Activity}
          accentColor="teal"
        />
        <StatCard
          title="Accrued Cost"
          value={`₹${(summary?.estimated_cost || 6840).toLocaleString('en-IN')}`}
          subtext="Base tariff: ₹8 / kWh"
          icon={IndianRupee}
          accentColor="amber"
        />
        <StatCard
          title="Projected 30-Day Bill"
          value={`₹${projectedBill.toLocaleString('en-IN')}`}
          subtext={`${budgetUsagePercent}% of ₹2,00,000 ceiling`}
          icon={CalendarCheck}
          accentColor="teal"
        />
        <StatCard
          title="Active Spikes"
          value={summary?.active_alerts ?? activeAlerts.length}
          subtext={`${activeAlerts.filter(a => a.severity === 'HIGH').length} high severity flagged`}
          icon={AlertCircle}
          accentColor={activeAlerts.length > 0 ? 'rose' : 'emerald'}
        />
      </div>

      {/* 3. Budget Target Gauge Banner */}
      <div className="glass-card rounded-xl p-4 border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Monthly Electricity Budget Forecast
              </h4>
              <span className="text-[10px] font-mono font-semibold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                Asset 03 Projection
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hostel Block B Budget Limit: <span className="text-slate-200 font-semibold font-mono">₹2,00,000</span> • Projected Spend:{' '}
              <span className="text-teal-400 font-bold font-mono">₹{projectedBill.toLocaleString('en-IN')}</span> ({budgetUsagePercent}%)
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-400">Target Ceiling</span>
            <span className={`font-bold ${budgetUsagePercent > 80 ? 'text-amber-400' : 'text-teal-400'}`}>
              {budgetUsagePercent}% Allocated
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUsagePercent > 80 ? 'bg-amber-400' : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4. Tradable Asset 03: Time-Series Forecasting & Trends */}
      <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-teal-500 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-100 font-heading">
                Tradable Asset 03: Time-Series Forecasting & Trend Projection
              </span>
              <span className="text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded">
                Linear Trend + Smoothing
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-model regression forecasting upcoming consumption trends and projected tariff ceilings.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeToggle(tf)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                  selectedTimeframe === tf
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends?.data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
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
                formatter={(val: any) => [`${val} kWh`, 'Consumption']}
              />
              <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Baseline', fill: '#f59e0b', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="consumption_kwh"
                stroke="#0d9488"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsage)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Device Distribution & High-Efficiency Rankings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Distribution Donut */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 font-heading">Device Energy Breakdown</h3>
            <button
              onClick={() => onNavigateToTab('devices')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Inspect</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
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
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`${val} kWh`, 'Power']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            {deviceDistributionData.slice(0, 3).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[idx] }}></span>
                  <span className="text-slate-300 truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-mono font-semibold text-slate-200">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Telemetry Quick Table */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-100 font-heading">Active Room Telemetry Feeds</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live ingestion streams across hostel units</p>
            </div>
            <button
              onClick={() => onNavigateToTab('rooms')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>View All Rooms</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-hidden">
            {rooms.slice(0, 4).map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRoom(r.id)}
                className="py-3 flex items-center justify-between hover:bg-slate-900/60 rounded-lg px-2 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                    {r.id.split('-')[1]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-xs">{r.name}</h4>
                    <p className="text-[11px] text-slate-400">{r.floor} • Load: {r.current_load_kw || 1.2} kW</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-slate-200 block">{r.consumption_kwh} kWh</span>
                    <span className="text-[11px] text-slate-400 block font-mono">₹{r.cost}</span>
                  </div>
                  <StatusBadge status={r.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Tradable Asset 02: Anomaly Detection Engine Live Feed */}
      <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-rose-500 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-100 font-heading">
                Tradable Asset 02: Autonomous Anomaly Detection Feed
              </span>
              <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
                Statistical Z-Score + IQR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live anomaly engine triaging spikes, identifying deviating units, and recommending load reduction.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onTriggerSpike}
              disabled={isSimulating}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>{isSimulating ? 'Simulating Spike...' : 'Simulate Spike Scenario'}</span>
            </button>
            <button
              onClick={() => onNavigateToTab('alerts')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              View All ({alerts.length})
            </button>
          </div>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
            <p className="font-semibold text-slate-200">No Unresolved Critical Anomalies</p>
            <p className="mt-1">All telemetry feeds are within nominal statistical bounds. Click "Simulate Spike Scenario" to trigger an automated test anomaly.</p>
          </div>
        ) : (
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
        )}
      </div>

      {/* 7. Smart Energy Recommendations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-100 font-heading">Automated Energy Optimization Tips</h3>
            <p className="text-xs text-slate-400 mt-0.5">Algorithmic suggestions to reduce monthly electricity bills</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <RecommendationCard
              key={rec.id}
              title={rec.title}
              roomName={rec.room_name}
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
