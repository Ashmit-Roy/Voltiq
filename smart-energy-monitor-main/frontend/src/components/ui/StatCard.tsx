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
  accentColor?: 'emerald' | 'amber' | 'rose' | 'teal' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  accentColor = 'amber',
}) => {
  const accentStyles = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    slate: 'text-slate-300 bg-slate-800 border-slate-700',
  };

  const isUp = trend && trend.value > 0;
  const isGood = trend ? (trend.isPositiveGood ? isUp : !isUp) : true;

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className={`p-2 rounded-lg border ${accentStyles[accentColor]} transition-transform duration-200 group-hover:scale-105`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-bold font-mono text-slate-50 mt-2">{value}</h3>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
        {trend ? (
          <div className={`flex items-center font-medium gap-1 ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isUp ? `+${trend.value}%` : `${trend.value}%`}</span>
            <span className="text-slate-400 font-normal ml-0.5">{trend.label || 'vs baseline'}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px] truncate">{subtext}</span>
        )}
      </div>
    </div>
  );
};
