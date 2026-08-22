import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let label = status;
  let Icon = Zap;

  if (normalized === 'abnormal' || normalized === 'critical' || normalized === 'high') {
    styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    label = normalized === 'abnormal' ? 'Abnormal Spike' : normalized === 'high' ? 'High Load' : 'Critical Spike';
    Icon = ShieldAlert;
  } else if (normalized === 'efficient' || normalized === 'resolved') {
    styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    label = normalized === 'efficient' ? 'Optimal Efficiency' : 'Resolved';
    Icon = CheckCircle2;
  } else if (normalized === 'normal' || normalized === 'active') {
    styles = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    label = normalized === 'active' ? 'Active Event' : 'Nominal';
    Icon = ShieldCheck;
  } else if (normalized === 'medium' || normalized === 'warning') {
    styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    label = status;
    Icon = AlertTriangle;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-0.5 space-x-1.5',
    lg: 'text-sm px-3 py-1 space-x-2',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${styles} ${sizeClasses[size]}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
};
