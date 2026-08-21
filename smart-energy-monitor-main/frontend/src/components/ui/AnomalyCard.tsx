import React from 'react';
import { AlertOctagon, ArrowUpRight, CheckCircle, ExternalLink } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface AnomalyCardProps {
  roomName: string;
  actualValue: number;
  expectedMin?: number;
  expectedMax?: number;
  deviationPercent: number;
  severity: string;
  timestamp?: string;
  onInvestigate?: () => void;
  onResolve?: () => void;
  status?: string;
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({
  roomName,
  actualValue,
  expectedMin = 10,
  expectedMax = 15,
  deviationPercent,
  severity,
  timestamp,
  onInvestigate,
  onResolve,
  status = 'ACTIVE',
}) => {
  const isResolved = status === 'RESOLVED';

  return (
    <div className={`rounded-xl p-5 border transition-all ${isResolved ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-950/20 border-rose-500/30 glow-border-rose'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg ${isResolved ? 'bg-slate-800 text-slate-400' : 'bg-rose-500/20 text-rose-400'}`}>
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-slate-100">{roomName}</h4>
              <StatusBadge status={isResolved ? 'RESOLVED' : severity} size="sm" />
            </div>
            {timestamp && <p className="text-xs text-slate-400 mt-0.5">{timestamp}</p>}
          </div>
        </div>

        {!isResolved && (
          <span className="flex items-center text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            +{deviationPercent}% Deviation
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 bg-slate-900/80 p-3.5 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block">Actual Usage</span>
          <span className="text-sm font-bold text-rose-400 mt-0.5 block">{actualValue} kWh</span>
        </div>
        <div>
          <span className="text-slate-400 block">Expected Baseline</span>
          <span className="text-sm font-semibold text-slate-200 mt-0.5 block">{expectedMin} – {expectedMax} kWh</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-400 block">Status</span>
          <span className="text-sm font-semibold text-slate-300 mt-0.5 block">{isResolved ? 'Resolved' : 'Requires Attention'}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end space-x-3">
        {onInvestigate && (
          <button
            onClick={onInvestigate}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center space-x-1"
          >
            <span>View Room Details</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
        {onResolve && !isResolved && (
          <button
            onClick={onResolve}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center space-x-1 font-semibold"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Mark Resolved</span>
          </button>
        )}
      </div>
    </div>
  );
};
