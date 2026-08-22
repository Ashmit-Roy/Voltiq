import React, { useState } from 'react';
import {
  Clock,
  Building2,
  TrendingUp,
  Leaf
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [tariffTimeframe, setTariffTimeframe] = useState<'weekday' | 'weekend'>('weekday');

  // 1. Time of Use (TOU) Hourly Demand & Tariff Analysis
  const touDataWeekday = [
    { hour: '12 AM', load_kw: 32, rate: 8.0, cost: 256, type: 'Off-Peak' },
    { hour: '02 AM', load_kw: 34, rate: 8.0, cost: 272, type: 'Off-Peak' },
    { hour: '04 AM', load_kw: 30, rate: 8.0, cost: 240, type: 'Off-Peak' },
    { hour: '06 AM', load_kw: 38, rate: 8.0, cost: 304, type: 'Normal' },
    { hour: '08 AM', load_kw: 48, rate: 8.0, cost: 384, type: 'Normal' },
    { hour: '10 AM', load_kw: 52, rate: 8.0, cost: 416, type: 'Normal' },
    { hour: '12 PM', load_kw: 56, rate: 8.0, cost: 448, type: 'Normal' },
    { hour: '02 PM', load_kw: 50, rate: 8.0, cost: 400, type: 'Normal' },
    { hour: '04 PM', load_kw: 54, rate: 8.0, cost: 432, type: 'Normal' },
    { hour: '06 PM', load_kw: 76, rate: 11.5, cost: 874, type: 'Peak Tariff' },
    { hour: '08 PM', load_kw: 84, rate: 11.5, cost: 966, type: 'Peak Tariff' },
    { hour: '10 PM', load_kw: 62, rate: 11.5, cost: 713, type: 'Peak Tariff' },
  ];

  const touDataWeekend = [
    { hour: '12 AM', load_kw: 36, rate: 8.0, cost: 288, type: 'Off-Peak' },
    { hour: '02 AM', load_kw: 38, rate: 8.0, cost: 304, type: 'Off-Peak' },
    { hour: '04 AM', load_kw: 34, rate: 8.0, cost: 272, type: 'Off-Peak' },
    { hour: '06 AM', load_kw: 32, rate: 8.0, cost: 256, type: 'Normal' },
    { hour: '08 AM', load_kw: 42, rate: 8.0, cost: 336, type: 'Normal' },
    { hour: '10 AM', load_kw: 60, rate: 8.0, cost: 480, type: 'Normal' },
    { hour: '12 PM', load_kw: 65, rate: 8.0, cost: 520, type: 'Normal' },
    { hour: '02 PM', load_kw: 58, rate: 8.0, cost: 464, type: 'Normal' },
    { hour: '04 PM', load_kw: 62, rate: 8.0, cost: 496, type: 'Normal' },
    { hour: '06 PM', load_kw: 70, rate: 11.5, cost: 805, type: 'Peak Tariff' },
    { hour: '08 PM', load_kw: 78, rate: 11.5, cost: 897, type: 'Peak Tariff' },
    { hour: '10 PM', load_kw: 68, rate: 11.5, cost: 782, type: 'Peak Tariff' },
  ];

  const activeTouData = tariffTimeframe === 'weekday' ? touDataWeekday : touDataWeekend;

  // 2. Floor-wise Comparative Consumption
  const floorComparisonData = [
    { floor: 'Ground Floor', actual_kwh: 840, target_kwh: 750, variance: '+12%' },
    { floor: '1st Floor', actual_kwh: 920, target_kwh: 900, variance: '+2.2%' },
    { floor: '2nd Floor (Labs)', actual_kwh: 1280, target_kwh: 1000, variance: '+28%' },
    { floor: '3rd Floor', actual_kwh: 760, target_kwh: 800, variance: '-5%' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Tradable Engine Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-teal-500">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-100 text-sm font-heading">
                Tradable Asset 03: Time-Series Forecasting & TOU Tariff Optimization
              </h3>
              <span className="text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded">
                Dynamic Tariff Model
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzing peak-hour demand surge and estimating cost impact under dynamic Time-of-Use tariffs.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTariffTimeframe('weekday')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tariffTimeframe === 'weekday' ? 'bg-teal-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekday Tariffs
          </button>
          <button
            onClick={() => setTariffTimeframe('weekend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tariffTimeframe === 'weekend' ? 'bg-teal-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekend Tariffs
          </button>
        </div>
      </div>

      {/* 1. TOU Hourly Demand & Cost Curve */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-slate-100 text-sm font-heading flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Time-of-Use (TOU) Hourly Demand & Peak Cost Projection</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Peak hours (6:00 PM – 10:00 PM) billed at ₹11.50/kWh surge rate vs ₹8.00/kWh standard rate.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span>Load Demand (kW)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span>Hourly Cost (₹)</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeTouData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Area type="monotone" dataKey="load_kw" stroke="#0d9488" strokeWidth={2} fill="url(#colorLoad)" name="Load (kW)" />
              <Area type="monotone" dataKey="cost" stroke="#f43f5e" strokeWidth={2} fill="url(#colorCost)" name="Cost (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Floor-wise Comparative Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-slate-100 text-sm font-heading">Floor-wise Consumption vs Target</h4>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="floor" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="actual_kwh" fill="#0d9488" name="Actual (kWh)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target_kwh" fill="#334155" name="Target (kWh)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sustainability & Carbon Offset KPI */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-slate-100 text-sm font-heading">Sustainability & ESG Telemetry</h4>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Environmental impact computed from real-time power consumption in Hostel Block B.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Carbon Emission</span>
                <span className="text-xl font-bold font-mono text-slate-100 mt-1 block">3,230 kg CO₂</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">0.85 kg/kWh grid factor</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Optimized Savings</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">₹14,280</span>
                <span className="text-[10px] text-emerald-400 mt-0.5 block">Via peak-hour curtailment</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-300">
            <span className="font-semibold block">🌱 Eco Recommendation:</span>
            <span className="text-[11px] text-slate-300 block mt-0.5">
              Shifting Computer Lab batch jobs from 7:00 PM to 1:00 AM saves ~₹4,500/month in peak electricity surcharges.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
