import React, { useState } from 'react';
import {
  Leaf,
  Clock,
  Layers,
  Zap,
  Building2,
  AlertTriangle,
  SunMedium,
  CheckCircle,
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

  // 2. Floor-by-Floor Comparison
  const floorComparisonData = [
    { floor: '1st Floor', consumption_kwh: 860, cost: 6880, intensity: 4.8, status: 'Optimal (88%)' },
    { floor: '2nd Floor', consumption_kwh: 1540, cost: 12320, intensity: 8.6, status: 'Needs Review (62%)' },
    { floor: '3rd Floor', consumption_kwh: 1480, cost: 11840, intensity: 8.2, status: 'High Load (68%)' },
  ];

  // 3. Sustainability & Carbon Footprint Metrics
  const totalKwhWeek = 3880;
  const carbonEmissionsKg = (totalKwhWeek * 0.85).toFixed(0);
  const treesToOffset = Math.round(Number(carbonEmissionsKg) / 21.7);
  const solarPotentialKwh = 145.0; // daily generation estimate for hostel rooftop

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Sustainability & Carbon Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 glow-border-emerald flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Carbon Emissions</span>
            <div className="text-xl font-bold font-mono text-slate-100 mt-0.5">{Number(carbonEmissionsKg).toLocaleString()} kg CO₂</div>
            <span className="text-[10px] text-emerald-400 font-medium">Grid Factor: 0.85 kg/kWh</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 glow-border-cyan flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <SunMedium className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Solar Rooftop Potential</span>
            <div className="text-xl font-bold font-mono text-slate-100 mt-0.5">~{solarPotentialKwh} kWh / day</div>
            <span className="text-[10px] text-cyan-400 font-medium">Could offset 28% of block load</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 glow-border-amber flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Peak Tariff Window</span>
            <div className="text-xl font-bold font-mono text-slate-100 mt-0.5">6:00 PM – 10:00 PM</div>
            <span className="text-[10px] text-amber-400 font-medium">+43% Commercial Peak Rate</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-purple-500/20 glow-border-purple flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Equivalent Tree Offset</span>
            <div className="text-xl font-bold font-mono text-slate-100 mt-0.5">{treesToOffset} Urban Trees</div>
            <span className="text-[10px] text-purple-400 font-medium">Annual carbon absorption basis</span>
          </div>
        </div>
      </div>

      {/* 2. Time-of-Use Tariff & Peak Demand Shifting Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Time-of-Use (TOU) Hourly Demand & Tariff Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies expensive peak surcharge intervals (6 PM – 10 PM) where tariff shifting saves maximum electricity expense.
            </p>
          </div>

          {/* Weekday / Weekend toggle */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setTariffTimeframe('weekday')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tariffTimeframe === 'weekday'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Typical Weekday
            </button>
            <button
              onClick={() => setTariffTimeframe('weekend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tariffTimeframe === 'weekend'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekend Profile
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeTouData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: string) => [
                  name === 'load_kw' ? `${val} kW Demand` : `₹${val} Hourly Cost`,
                  name === 'load_kw' ? 'Power Load' : 'Total Expense',
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="load_kw"
                name="Demand (kW)"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#loadGradient)"
              />
              <Area
                type="monotone"
                dataKey="cost"
                name="Hourly Cost (₹)"
                stroke="#fbbf24"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#costGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Optimization Note */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-3 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Peak Tariff Alert (6:00 PM – 10:00 PM):</span> Electricity is billed at ₹11.50/kWh during this window. Shifting heavy AC pre-cooling to 5:00 PM and staggering laundry/gaming usage can reduce the monthly bill by an estimated ₹14,200.
          </div>
        </div>
      </div>

      {/* 3. Floor-by-Floor Comparative Energy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor Comparison Bar Chart */}
        <div className="glass-card lg:col-span-2 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Floor-wise Consumption & Cost Intensity</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Compares total energy drawn across hostel building levels</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="floor" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, name: string) => [
                    name === 'consumption_kwh' ? `${val} kWh` : `₹${val}`,
                    name === 'consumption_kwh' ? 'Weekly Consumption' : 'Cost',
                  ]}
                />
                <Bar dataKey="consumption_kwh" name="Weekly kWh" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Floor Breakdown Stats Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Floor Efficiency Scores</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Benchmarked against standard hostel capacity</p>
          </div>

          <div className="space-y-3.5">
            {floorComparisonData.map((fl) => (
              <div key={fl.floor} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{fl.floor}</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                    fl.status.includes('Optimal')
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {fl.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{fl.consumption_kwh} kWh</span>
                  <span className="font-mono text-emerald-400 font-semibold">₹{fl.cost.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      fl.status.includes('Optimal') ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, (fl.consumption_kwh / 1600) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>1st Floor is currently the most energy efficient level.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
