import React, { useState } from 'react';
import {
  X,
  Layers,
  Check,
  Copy,
  Activity,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface TradableAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
  onTriggerSpike?: () => void;
}

export const TradableAssetsModal: React.FC<TradableAssetsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onTriggerSpike,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const assets = [
    {
      id: 'universal-data-ingestion',
      name: 'Universal Data Ingestion Pipeline',
      version: 'v1.0.0',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      borderColor: 'border-amber-500/30',
      icon: Layers,
      iconColor: 'text-amber-400',
      description: 'Standalone schema validation, payload normalization, and multi-source telemetry parsing engine.',
      targetTracks: [
        'PS-03 (Intelligent Waste Collection)',
        'PS-05 (Public Transport)',
        'PS-08 (The Shopkeeper\'s Day)',
        'PS-02 (Community Healthcare)'
      ],
      codeSnippet: `from universal_data_ingestion import DataNormalizer

normalizer = DataNormalizer()
clean_record = normalizer.normalize(raw_payload, source_type="iot_sensor")`,
      actionLabel: 'View Ingestion Feed',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('dashboard');
        onClose();
      }
    },
    {
      id: 'anomaly-detection-engine',
      name: 'Autonomous Anomaly Detection Engine',
      version: 'v1.0.0',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      borderColor: 'border-rose-500/30',
      icon: Activity,
      iconColor: 'text-rose-400',
      description: 'Multi-method time-series outlier and surge scoring (Z-Score + IQR) with automated severity triage.',
      targetTracks: [
        'PS-01 (Campus Emergency Response)',
        'PS-03 (Waste Overflow Detection)',
        'PS-05 (Crowd Surge in Transport)',
        'PS-02 (Patient Vitals Anomaly)'
      ],
      codeSnippet: `from anomaly_detection_engine import AnomalyDetector

detector = AnomalyDetector(z_score_threshold=2.0)
result = detector.evaluate(current_value=42.0, history=[10.5, 11.2, 12.0])`,
      actionLabel: 'Trigger Live Spike Demo',
      onAction: () => {
        if (onTriggerSpike) onTriggerSpike();
        if (onNavigateToTab) onNavigateToTab('alerts');
        onClose();
      }
    },
    {
      id: 'forecasting-prediction-engine',
      name: 'Time-Series Forecasting & Budget Engine',
      version: 'v1.0.0',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      borderColor: 'border-teal-500/30',
      icon: TrendingUp,
      iconColor: 'text-teal-400',
      description: 'Algorithmic trend projection (Linear Regression, Exponential Smoothing, Moving Average) and bill estimator.',
      targetTracks: [
        'PS-04 (Farmer-to-Market Pricing)',
        'PS-09 (Freelancer Income Forecast)',
        'PS-08 (Store Inventory Restock)',
        'PS-07 (Hostel Budget Projection)'
      ],
      codeSnippet: `from forecasting_prediction_engine import TimeSeriesForecaster

forecaster = TimeSeriesForecaster()
projection = forecaster.forecast_period(past_readings, remaining_periods=23)`,
      actionLabel: 'View Forecast Analytics',
      onAction: () => {
        if (onNavigateToTab) onNavigateToTab('analytics');
        onClose();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-100 font-heading">Tradable Modules & Marketplace Inspector</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  3 Standalone Engines
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Separable, decoupled Python packages ready for cross-track transfer during hackathon trading.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {assets.map((asset) => {
              const Icon = asset.icon;
              const isCopied = copiedId === asset.id;

              return (
                <div
                  key={asset.id}
                  className={`bg-slate-950/70 rounded-xl p-5 border ${asset.borderColor} space-y-4 hover:bg-slate-950 transition-all`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-lg bg-slate-850 border border-slate-700/60 ${asset.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-100 text-sm font-heading">{asset.name}</h4>
                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${asset.badgeColor}`}>
                            {asset.version}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{asset.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={asset.onAction}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center space-x-1.5 shrink-0"
                    >
                      <span>{asset.actionLabel}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>

                  {/* Target Tracks Compatibility */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      Cross-Track Trading Fit:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.targetTracks.map((track, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-900 text-slate-300 px-2.5 py-1 rounded-md border border-slate-800"
                        >
                          {track}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Copyable Integration Snippet */}
                  <div className="relative">
                    <div className="flex items-center justify-between bg-slate-900/90 px-3 py-1.5 rounded-t-lg border-t border-x border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span>Integration Snippet</span>
                      <button
                        onClick={() => handleCopyCode(asset.id, asset.codeSnippet)}
                        className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-950 rounded-b-lg border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                      <code>{asset.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All 3 engines unit tested & standalone ready in <code>/universal-data-ingestion</code>, <code>/anomaly-detection-engine</code>, <code>/forecasting-prediction-engine</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold text-xs text-slate-100 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
