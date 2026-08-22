import { PieChart as PieIcon, HardDrive } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DeviceItem } from '../types';

interface DevicesPageProps {
  devices: DeviceItem[];
}

const BAR_COLORS = ['#0d9488', '#f59e0b', '#10b981', '#f43f5e', '#64748b'];

export const DevicesPage: React.FC<DevicesPageProps> = ({ devices }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((dev, idx) => (
          <div key={dev.id} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-amber-400">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Device Class</span>
                    <h3 className="text-base font-bold text-slate-100 font-heading">{dev.category}</h3>
                  </div>
                </div>
                <StatusBadge status={dev.status} size="sm" />
              </div>

              {/* Meter bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                  <span>Proportion of Total Load</span>
                  <span className="font-bold text-teal-400 font-mono">{dev.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${dev.percentage}%`, backgroundColor: BAR_COLORS[idx % BAR_COLORS.length] }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-slate-400 font-sans text-[11px] block">Total Consumption</span>
                <span className="text-base font-bold text-slate-100 mt-0.5 block">{dev.consumption_kwh} kWh</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans text-[11px] block">Accrued Cost</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">₹{dev.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-100 font-heading flex items-center space-x-2">
          <PieIcon className="w-4 h-4 text-teal-400" />
          <span>Category Consumption Comparison</span>
        </h3>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={devices} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#fff' }}
                formatter={(value: any) => [`${value} kWh`, 'Power']}
              />
              <Bar dataKey="consumption_kwh" radius={[6, 6, 0, 0]}>
                {devices.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
