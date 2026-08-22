import React from 'react';
import { Lightbulb, ArrowRight, IndianRupee } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  roomName?: string;
  description: string;
  suggestedAction: string;
  potentialSavings: string;
  severity?: string;
  onTakeAction?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  roomName,
  description,
  suggestedAction,
  potentialSavings,
  severity = 'TIP',
  onTakeAction,
}) => {
  const isWarning = severity === 'WARNING';

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-lg border ${
              isWarning
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm font-heading">{title}</h4>
              {roomName && <p className="text-xs text-slate-400 mt-0.5">Location: {roomName}</p>}
            </div>
          </div>
          <div className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-mono">
            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
            <span>Save {potentialSavings}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-3.5 leading-relaxed">{description}</p>

        <div className="mt-3.5 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Recommended Action
          </span>
          <p className="text-slate-200">{suggestedAction}</p>
        </div>
      </div>

      {onTakeAction && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
          <button
            onClick={onTakeAction}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 transition-colors"
          >
            <span>Apply Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
