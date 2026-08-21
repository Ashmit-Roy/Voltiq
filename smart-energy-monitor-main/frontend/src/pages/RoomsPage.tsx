import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Zap, LayoutGrid, ListFilter, Building } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RoomItem } from '../types';

interface RoomsPageProps {
  rooms: RoomItem[];
  onSelectRoom: (roomId: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ rooms, onSelectRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'abnormal' | 'high' | 'normal' | 'efficient'>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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

    const matchesFloor =
      floorFilter === 'all'
        ? true
        : room.floor.toLowerCase().includes(floorFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesFloor;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Filter Header Bar */}
      <div className="glass-panel rounded-2xl p-4 space-y-4 border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search room name, floor or ID (e.g. Room 203)..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Floor & View Mode Selectors */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <Building className="w-3.5 h-3.5 text-slate-400 ml-2" />
              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="bg-transparent text-slate-300 text-xs py-1 px-2 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Floors</option>
                <option value="1st" className="bg-slate-900">1st Floor</option>
                <option value="2nd" className="bg-slate-900">2nd Floor</option>
                <option value="3rd" className="bg-slate-900">3rd Floor</option>
              </select>
            </div>

            {/* Grid / Table View Switcher */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium mr-2">Status:</span>
          {(['all', 'abnormal', 'high', 'normal', 'efficient'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
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

      {/* Grid or Table Display */}
      {filteredRooms.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <Search className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No rooms found matching your filter parameters</h3>
          <p className="text-xs text-slate-500">Try clearing search terms or status filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
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
      ) : (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">Room</th>
                <th className="pb-3 px-3">Floor</th>
                <th className="pb-3 px-3">Consumption</th>
                <th className="pb-3 px-3">Est. Cost</th>
                <th className="pb-3 px-3">Current Load</th>
                <th className="pb-3 px-3">Trend</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-3 font-bold text-slate-100">{room.name}</td>
                  <td className="py-3.5 px-3 text-slate-400">{room.floor}</td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-slate-200">{room.consumption_kwh} kWh</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-400">₹{room.cost}</td>
                  <td className="py-3.5 px-3 font-mono text-cyan-400">{room.current_load_kw || (room.consumption_kwh * 0.04).toFixed(1)} kW</td>
                  <td className="py-3.5 px-3">
                    <span className={`font-semibold ${room.trend_percent > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {room.trend_percent > 0 ? `↑ ${room.trend_percent}%` : `↓ ${Math.abs(room.trend_percent)}%`}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={room.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onSelectRoom(room.id)}
                      className="text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

