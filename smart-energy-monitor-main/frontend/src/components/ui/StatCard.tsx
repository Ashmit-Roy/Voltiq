import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositiveGood?: boolean;
    label?: string;
  };
  accentColor?: 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  accentColor = 'emerald',
}) => {
  const accentClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  const isUp = trend && trend.value > 0;
  const isGood = trend ? (trend.isPositiveGood ? isUp : !isUp) : true;

  return (
    <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold font-heading text-slate-50 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg border ${accentClasses[accentColor]} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {trend ? (
          <div className={`flex items-center font-medium gap-1 ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isUp ? `+${trend.value}%` : `${trend.value}%`}</span>
            <span className="text-slate-500 font-normal ml-0.5">{trend.label || 'vs last period'}</span>
          </div>
        ) : (
          <span className="text-slate-400">{subtext}</span>
        )}
      </div>

      {/* Background Accent Glow */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300"></div>
    </div>
  );
};
