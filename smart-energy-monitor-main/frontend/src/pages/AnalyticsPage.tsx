import React, { useState } from 'react';
import { Cpu, Send, CheckCircle2, Code, Zap, ArrowRight, Play } from 'lucide-react';
import { apiService } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [customPayload, setCustomPayload] = useState(
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        location: 'ROOM-203',
        device: 'AC-MAIN-01',
        value: 42.5,
        unit: 'kWh',
      },
      null,
      2
    )
  );

  const [ingestionResult, setIngestionResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const presets = {
    normal: {
      timestamp: new Date().toISOString(),
      location: 'ROOM-101',
      device: 'AC-ECO-01',
      value: 12.4,
      unit: 'kWh',
    },
    surge: {
      timestamp: new Date().toISOString(),
      location: 'ROOM-203',
      device: 'AC-HEAVY-02',
      value: 38.5,
      unit: 'kWh',
    },
    multisensor: {
      timestamp: new Date().toISOString(),
      location: 'ROOM-302',
      device: 'DESKTOP-RIG-CLUSTER',
      value: 26.2,
      unit: 'kWh',
      source: 'mqtt_sensor_node_04',
    },
  };

  const handleApplyPreset = (key: keyof typeof presets) => {
    setCustomPayload(JSON.stringify(presets[key], null, 2));
  };

  const handleRunIngestionTest = async () => {
    try {
      setSubmitting(true);
      const parsed = JSON.parse(customPayload);
      const res = await apiService.ingestReading(parsed);
      setIngestionResult(res);
    } catch (e: any) {
      setIngestionResult({ status: 'error', message: e.message || 'Invalid JSON format' });
    } finally {
      setSubmitting(false);
    }
  };

  const tradableModules = [
    {
      id: 'universal-data-ingestion',
      name: 'Universal Data Ingestion Layer',
      type: 'Tradable Feature #1 (SELL)',
      desc: 'Normalizes raw CSV, REST API, or simulated IoT sensor payloads into standard energy reading schemas.',
      status: 'Connected & Active',
    },
    {
      id: 'anomaly-detection-engine',
      name: 'Anomaly Detection Engine',
      type: 'Tradable Feature #2 (SELL)',
      desc: 'Evaluates real-time time-series telemetry against historical baselines to flag power spikes.',
      status: 'Connected & Active',
    },
    {
      id: 'forecasting-prediction-engine',
      name: 'Forecasting & Prediction Engine',
      type: 'Tradable Feature #3 (SELL)',
      desc: 'Projects future period usage and estimates upcoming monthly electricity bills.',
      status: 'Connected & Active',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Visual Pipeline Data Flow Diagram */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">End-to-End Data Pipeline Architecture</h4>
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-lg border border-emerald-500/30">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-slate-200">IoT Telemetry</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-lg border border-cyan-500/30">
            <Code className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-slate-200">Ingestion Normalizer</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-lg border border-rose-500/30">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span className="font-mono text-slate-200">Anomaly & Forecast Engine</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-lg border border-purple-500/30">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span className="font-mono text-slate-200">FastAPI & React UI</span>
          </div>
        </div>
      </div>

      {/* Architecture & Pipeline Status */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>HACQUIRE Multi-Repository Architecture & Pipeline Status</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Voltiq integrates 3 standalone tradable repositories (SELL) powering the core energy monitor pipeline.
          </p>
        </div>

        {/* Tradable Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {tradableModules.map((mod) => (
            <div key={mod.id} className="bg-slate-950/80 rounded-xl p-4 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {mod.type}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-slate-100 text-sm">{mod.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{mod.desc}</p>
              </div>
              <div className="mt-3 text-[11px] font-mono text-emerald-400 pt-2 border-t border-slate-800">
                ● {mod.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Data Ingestion Tester */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Interactive Data Ingestion Tester</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Send custom JSON telemetry payloads directly to <span className="font-mono text-emerald-400">POST /api/v1/energy/readings</span> to test the Universal Ingestion Normalizer.
            </p>
          </div>

          {/* 1-Click Payload Preset Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Presets:</span>
            <button
              onClick={() => handleApplyPreset('normal')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center space-x-1"
            >
              <Play className="w-3 h-3" />
              <span>Normal AC</span>
            </button>
            <button
              onClick={() => handleApplyPreset('surge')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 text-rose-400 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center space-x-1"
            >
              <Play className="w-3 h-3" />
              <span>AC Surge</span>
            </button>
            <button
              onClick={() => handleApplyPreset('multisensor')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 text-cyan-400 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center space-x-1"
            >
              <Play className="w-3 h-3" />
              <span>Multi-Sensor</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Raw Telemetry Payload (JSON)</label>
            <textarea
              rows={8}
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/50"
            ></textarea>
            <button
              onClick={handleRunIngestionTest}
              disabled={submitting}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Ingesting Payload...' : 'Ingest Payload & Run Pipeline'}</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Pipeline Output Response</label>
            <pre className="w-full h-[190px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 overflow-auto">
              {ingestionResult ? JSON.stringify(ingestionResult, null, 2) : '// Click "Ingest Payload" to test normalization & anomaly detection'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

