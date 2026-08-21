import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Award, AlertCircle } from 'lucide-react';
import { RankingResponse } from '../types';
import { apiService } from '../services/api';

interface RankingsPageProps {
  onSelectRoom: (roomId: string) => void;
}

export const RankingsPage: React.FC<RankingsPageProps> = ({ onSelectRoom }) => {
  const [rankings, setRankings] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiService.getRankings().then((res) => {
      if (isMounted) {
        setRankings(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !rankings) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs">Computing comparative efficiency scores...</p>
      </div>
    );
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Intro Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Energy Efficiency & Comparative Leaderboard</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Section 17 — Encouraging hostel energy conservation through comparative room scores and consumption rankings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Energy Efficient Rooms */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 glow-border-emerald space-y-4">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-base">🏆 Most Energy Efficient Rooms</h4>
              <p className="text-xs text-slate-400">Lowest consumption & optimal efficiency scores</p>
            </div>
          </div>

          <div className="space-y-3">
            {rankings.efficient_rooms.map((item) => (
              <div
                key={item.room_id}
                onClick={() => onSelectRoom(item.room_id)}
                className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="text-2xl shrink-0 w-8 text-center">{getMedalIcon(item.rank)}</div>
                  <div>
                    <h5 className="font-semibold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors">{item.room_name}</h5>
                    <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-400">
                      <span className="font-mono font-medium text-slate-200">{item.consumption_kwh} kWh</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">₹{item.cost}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-36 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Efficiency</span>
                    <span className="font-bold text-emerald-400">{item.score} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Consumption Areas */}
        <div className="glass-card rounded-2xl p-5 border border-rose-500/20 glow-border-rose space-y-4">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-base">⚠ High Consumption Areas</h4>
              <p className="text-xs text-slate-400">Units requiring energy conservation intervention</p>
            </div>
          </div>

          <div className="space-y-3">
            {rankings.high_consumers.map((item) => (
              <div
                key={item.room_id}
                onClick={() => onSelectRoom(item.room_id)}
                className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 hover:border-rose-500/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center border border-rose-500/30">
                    #{item.rank}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-100 text-sm group-hover:text-rose-400 transition-colors">{item.room_name}</h5>
                    <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-400">
                      <span className="text-rose-400 font-bold font-mono">{item.consumption_kwh} kWh</span>
                      <span>•</span>
                      <span className="text-rose-400 font-semibold">₹{item.cost}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-36 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Efficiency</span>
                    <span className="font-bold text-rose-400">{item.score} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Intervention Callout */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Hostel Admin Action Recommended</span>
              <span className="text-slate-300 block text-[11px] mt-0.5">
                Room 203 & 302 exceed baseline consumption by &gt;20%. Inspect thermostat cutoff schedules to prevent cost overruns.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

