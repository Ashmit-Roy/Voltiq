import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RoomItem } from '../types';

interface RoomsPageProps {
  rooms: RoomItem[];
  onSelectRoom: (roomId: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ rooms, onSelectRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'abnormal' | 'high' | 'normal' | 'efficient'>('all');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'abnormal'
        ? room.status === 'abnormal'
        : statusFilter === 'high'
        ? room.status === 'high'
        : statusFilter === 'normal'
        ? room.status === 'normal'
        : room.status === 'efficient';

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Filter Header Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search room name or floor..."
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'abnormal', 'high', 'normal', 'efficient'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === filter
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className="glass-card rounded-xl p-5 border border-slate-800 hover:border-emerald-500/40 cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{room.floor}</span>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">{room.name}</h3>
              </div>
              <StatusBadge status={room.status} size="sm" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/60">
              <div>
                <span className="text-[11px] text-slate-400 block">Consumption</span>
                <span className="text-base font-bold font-mono text-slate-100 mt-0.5 block">{room.consumption_kwh} kWh</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Est. Cost</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">₹{room.cost}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/40 text-slate-400">
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Load: {room.current_load_kw || (room.consumption_kwh * 0.04).toFixed(1)} kW</span>
              </span>
              <span className={`font-semibold flex items-center ${room.trend_percent > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {room.trend_percent > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {Math.abs(room.trend_percent)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
