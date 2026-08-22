import React, { useState } from 'react';
import { Search, LayoutGrid, ListFilter, Building, DoorOpen } from 'lucide-react';
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
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4 border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search room name or ID (e.g. Room 203)..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-amber-500/50"
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
                  viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
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
          {(['all', 'abnormal', 'high', 'normal', 'efficient'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === filter
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950'
              }`}
            >
              {filter === 'all' ? 'All Units' : filter} (
              {
                rooms.filter((r) =>
                  filter === 'all' ? true : r.status.toLowerCase() === filter.toLowerCase()
                ).length
              }
              )
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => {
            const isAbnormal = room.status.toLowerCase() === 'abnormal';
            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`glass-card rounded-2xl p-5 border cursor-pointer flex flex-col justify-between ${
                  isAbnormal ? 'border-rose-500/40 bg-slate-900/90' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
                        <DoorOpen className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm font-heading">{room.name}</h4>
                        <span className="text-xs text-slate-400">{room.floor} • Hostel Block B</span>
                      </div>
                    </div>
                    <StatusBadge status={room.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                    <div>
                      <span className="text-slate-400 font-sans text-[11px] block">Consumption</span>
                      <span className="text-sm font-bold text-slate-100 mt-0.5 block">{room.consumption_kwh} kWh</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-sans text-[11px] block">Accrued Cost</span>
                      <span className="text-sm font-bold text-emerald-400 mt-0.5 block">₹{room.cost}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Current Load: <span className="text-slate-200 font-mono">{room.current_load_kw || 1.2} kW</span></span>
                  <span className="text-amber-400 font-semibold group-hover:underline">Inspect Room →</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Room & Unit</th>
                  <th className="py-3.5 px-4">Floor</th>
                  <th className="py-3.5 px-4">Consumption</th>
                  <th className="py-3.5 px-4">Accrued Cost</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    onClick={() => onSelectRoom(room.id)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-100">{room.name}</td>
                    <td className="py-3 px-4 text-slate-400">{room.floor}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">{room.consumption_kwh} kWh</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">₹{room.cost}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={room.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-amber-400 hover:text-amber-300 font-semibold">Inspect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
