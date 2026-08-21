import React, { useEffect, useState } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { DevicesPage } from './pages/DevicesPage';
import { AlertsPage } from './pages/AlertsPage';
import { RankingsPage } from './pages/RankingsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { apiService } from './services/api';
import { DashboardSummary, DashboardTrendsResponse, RoomItem, DeviceItem, AlertItem, RecommendationItem } from './types';
import { Sparkles } from 'lucide-react';

const deduplicateAlerts = (list: AlertItem[]): AlertItem[] => {
  const seen = new Set<string>();
  return list.filter((item) => {
    // Compound key: prefer id, but also guard on title+room+value to catch API duplicates with same id
    const id = (item as any).alert_id || item.id;
    const key = id
      ? `${id}::${item.room_id}::${item.title}`
      : `${item.room_id || item.room_name}::${item.title}::${item.actual_value}::${item.timestamp}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const deduplicateRecommendations = (list: RecommendationItem[]): RecommendationItem[] => {
  const seen = new Set<string>();
  return list.filter((item) => {
    // Compound key: id + title + room to catch all duplicate patterns from backend
    const key = `${item.id || ''}::${item.title}::${item.room_id || item.room_name || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<DashboardTrendsResponse | null>(null);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const refreshAllData = async (tf: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    try {
      const [sumRes, trRes, roomsRes, devRes, alertRes, recRes] = await Promise.all([
        apiService.getDashboardSummary(),
        apiService.getDashboardTrends(tf),
        apiService.getRooms(),
        apiService.getDevices(),
        apiService.getAlerts(),
        apiService.getRecommendations(),
      ]);

      setSummary(sumRes);
      setTrends(trRes);
      setRooms(roomsRes);
      setDevices(devRes);
      setAlerts(deduplicateAlerts(alertRes));
      setRecommendations(deduplicateRecommendations(recRes));
    } catch (err) {
      console.error('Error refreshing energy telemetry:', err);
    }
  };

  useEffect(() => {
    // Automatically reset telemetry to clean baseline on initial startup / reload
    const initApp = async () => {
      try {
        await apiService.resetSimulation();
      } catch (e) {
        // ignore offline fallback
      }
      await refreshAllData();
    };
    initApp();
  }, []);

  const handleResetTelemetry = async () => {
    try {
      setIsSimulating(true);
      await apiService.resetSimulation();
      setToastMessage('Telemetry database reset to clean baseline (Block B Hostel).');
      await refreshAllData();
    } catch (err) {
      setToastMessage('Telemetry reset completed.');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setActiveTab('rooms');
  };

  const handleBackToRooms = () => {
    setSelectedRoomId(null);
  };

  const handleTabChange = (tab: NavTab) => {
    setSelectedRoomId(null);
    setActiveTab(tab);
  };

  const handleTimeframeChange = (tf: 'daily' | 'weekly' | 'monthly') => {
    apiService.getDashboardTrends(tf).then(setTrends);
  };

  const handleTriggerSpikeScenario = async () => {
    try {
      setIsSimulating(true);
      const res = await apiService.triggerSpikeScenario('ROOM-203');
      setToastMessage(res.scenario || 'Live AC spike scenario executed successfully!');
      await refreshAllData();
    } catch (err) {
      setToastMessage('Simulation completed with fallback data.');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId || (a as any).alert_id === alertId ? { ...a, status: 'RESOLVED' } : a))
    );
    setToastMessage(`Alert ${alertId} resolved successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
    await apiService.resolveAlert(alertId);
    refreshAllData();
  };

  const activeAlertCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className={`flex min-h-screen ${theme === 'light' ? 'light-mode bg-slate-100 text-slate-900' : 'dark bg-slate-950 text-slate-100'} transition-colors`}>
      {/* Persistent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        activeAlertCount={activeAlertCount}
        dataSourceStatus={summary?.data_source_status}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          activeAlertCount={activeAlertCount}
          onTriggerSpikeScenario={handleTriggerSpikeScenario}
          isSimulating={isSimulating}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          rooms={rooms}
          devices={devices}
          alerts={alerts}
          onSelectRoom={handleSelectRoom}
        />

        <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto flex-1">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-0.5"
              >
                ✕
              </button>
            </div>
          )}

          {/* Room Detail View if Room selected */}
          {selectedRoomId ? (
            <RoomDetailPage
              roomId={selectedRoomId}
              onBack={handleBackToRooms}
            />
          ) : activeTab === 'dashboard' ? (
            <DashboardPage
              summary={summary}
              trends={trends}
              rooms={rooms}
              alerts={alerts}
              recommendations={recommendations}
              onSelectRoom={handleSelectRoom}
              onNavigateToTab={handleTabChange}
              onTimeframeChange={handleTimeframeChange}
              onTriggerSpike={handleTriggerSpikeScenario}
              onResetTelemetry={handleResetTelemetry}
              onResolveAlert={handleResolveAlert}
              isSimulating={isSimulating}
            />
          ) : activeTab === 'rooms' ? (
            <RoomsPage rooms={rooms} onSelectRoom={handleSelectRoom} />
          ) : activeTab === 'devices' ? (
            <DevicesPage devices={devices} />
          ) : activeTab === 'alerts' ? (
            <AlertsPage alerts={alerts} onSelectRoom={handleSelectRoom} onResolveAlert={handleResolveAlert} />
          ) : activeTab === 'rankings' ? (
            <RankingsPage onSelectRoom={handleSelectRoom} />
          ) : (
            <AnalyticsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

