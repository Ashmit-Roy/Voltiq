import {
  DashboardSummary,
  DashboardTrendsResponse,
  RoomItem,
  RoomDetail,
  DeviceItem,
  AlertItem,
  RankingResponse,
  RecommendationItem,
  SimulationResult,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function fetchWithFallback<T>(url: string, mockFallback: T, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`API call to ${url} failed or offline. Using fallback data.`, err);
    return mockFallback;
  }
}

export const apiService = {
  // 1. Dashboard Summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    const mock: DashboardSummary = {
      total_consumption_kwh: 850.0,
      current_load_kw: 42.6,
      estimated_cost: 6840.0,
      projected_bill: 12450.0,
      active_alerts: 3,
      data_source_status: {
        connected: true,
        source_type: 'simulated_iot',
        last_updated: new Date().toISOString(),
      },
    };
    return fetchWithFallback<DashboardSummary>(`${API_BASE_URL}/dashboard/summary`, mock);
  },

  // 2. Dashboard Trends
  async getDashboardTrends(timeframe: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<DashboardTrendsResponse> {
    const mockDaily = [
      { timestamp: '12:00 AM', consumption_kwh: 28.5, cost: 228 },
      { timestamp: '02:00 AM', consumption_kwh: 30.2, cost: 241.6 },
      { timestamp: '04:00 AM', consumption_kwh: 32.0, cost: 256 },
      { timestamp: '06:00 AM', consumption_kwh: 35.8, cost: 286.4 },
      { timestamp: '08:00 AM', consumption_kwh: 45.2, cost: 361.6 },
      { timestamp: '10:00 AM', consumption_kwh: 52.0, cost: 416 },
      { timestamp: '12:00 PM', consumption_kwh: 48.6, cost: 388.8 },
      { timestamp: '02:00 PM', consumption_kwh: 44.0, cost: 352 },
      { timestamp: '04:00 PM', consumption_kwh: 46.5, cost: 372 },
      { timestamp: '06:00 PM', consumption_kwh: 58.0, cost: 464 },
      { timestamp: '08:00 PM', consumption_kwh: 64.2, cost: 513.6 },
      { timestamp: '10:00 PM', consumption_kwh: 55.0, cost: 440 },
    ];

    const mockWeekly = [
      { timestamp: 'Mon', consumption_kwh: 110.0, cost: 880 },
      { timestamp: 'Tue', consumption_kwh: 116.5, cost: 932 },
      { timestamp: 'Wed', consumption_kwh: 123.0, cost: 984 },
      { timestamp: 'Thu', consumption_kwh: 129.5, cost: 1036 },
      { timestamp: 'Fri', consumption_kwh: 136.0, cost: 1088 },
      { timestamp: 'Sat', consumption_kwh: 157.5, cost: 1260 },
      { timestamp: 'Sun', consumption_kwh: 149.0, cost: 1192 },
    ];

    const mockMonthly = [
      { timestamp: 'Week 1', consumption_kwh: 720.0, cost: 5760 },
      { timestamp: 'Week 2', consumption_kwh: 785.0, cost: 6280 },
      { timestamp: 'Week 3', consumption_kwh: 850.0, cost: 6840 },
      { timestamp: 'Week 4 (Proj.)', consumption_kwh: 920.0, cost: 7360 },
    ];

    const data = timeframe === 'weekly' ? mockWeekly : timeframe === 'monthly' ? mockMonthly : mockDaily;
    const mock: DashboardTrendsResponse = { timeframe, data };
    return fetchWithFallback<DashboardTrendsResponse>(`${API_BASE_URL}/dashboard/trends?timeframe=${timeframe}`, mock);
  },

  // 3. Rooms List
  async getRooms(): Promise<RoomItem[]> {
    const mock: RoomItem[] = [
      { id: 'ROOM-203', name: 'Room 203', floor: '2nd Floor', consumption_kwh: 210.0, cost: 1680.0, trend_percent: 24.0, status: 'abnormal', current_load_kw: 8.4 },
      { id: 'ROOM-302', name: 'Room 302', floor: '3rd Floor', consumption_kwh: 195.0, cost: 1560.0, trend_percent: 18.5, status: 'high', current_load_kw: 7.8 },
      { id: 'ROOM-105', name: 'Room 105', floor: '1st Floor', consumption_kwh: 165.0, cost: 1320.0, trend_percent: 8.0, status: 'normal', current_load_kw: 6.6 },
      { id: 'ROOM-301', name: 'Room 301', floor: '3rd Floor', consumption_kwh: 140.0, cost: 1120.0, trend_percent: 2.0, status: 'normal', current_load_kw: 5.6 },
      { id: 'ROOM-204', name: 'Room 204', floor: '2nd Floor', consumption_kwh: 115.0, cost: 920.0, trend_percent: -4.5, status: 'normal', current_load_kw: 4.6 },
      { id: 'ROOM-104', name: 'Room 104', floor: '1st Floor', consumption_kwh: 102.0, cost: 816.0, trend_percent: -8.0, status: 'efficient', current_load_kw: 4.0 },
      { id: 'ROOM-101', name: 'Room 101', floor: '1st Floor', consumption_kwh: 95.0, cost: 760.0, trend_percent: -12.0, status: 'efficient', current_load_kw: 3.8 },
    ];
    return fetchWithFallback<RoomItem[]>(`${API_BASE_URL}/rooms`, mock);
  },

  // 4. Room Detail
  async getRoomDetail(roomId: string): Promise<RoomDetail> {
    const isAbnormal = roomId === 'ROOM-203';
    const mock: RoomDetail = {
      id: roomId,
      name: roomId === 'ROOM-203' ? 'Room 203' : roomId === 'ROOM-101' ? 'Room 101' : `Room ${roomId.replace('ROOM-', '')}`,
      floor: roomId.startsWith('ROOM-2') ? '2nd Floor' : roomId.startsWith('ROOM-3') ? '3rd Floor' : '1st Floor',
      total_consumption_kwh: isAbnormal ? 210.0 : 95.0,
      estimated_cost: isAbnormal ? 1680.0 : 760.0,
      projected_cost: isAbnormal ? 2450.0 : 1100.0,
      status: isAbnormal ? 'abnormal' : 'normal',
      history: [
        { timestamp: '12:00 AM', consumption_kwh: isAbnormal ? 3.5 : 1.2, cost: isAbnormal ? 28 : 9.6 },
        { timestamp: '02:00 AM', consumption_kwh: isAbnormal ? 3.6 : 1.3, cost: isAbnormal ? 28.8 : 10.4 },
        { timestamp: '04:00 AM', consumption_kwh: isAbnormal ? 3.7 : 1.4, cost: isAbnormal ? 29.6 : 11.2 },
        { timestamp: '06:00 AM', consumption_kwh: isAbnormal ? 3.8 : 1.5, cost: isAbnormal ? 30.4 : 12 },
        { timestamp: '08:00 AM', consumption_kwh: isAbnormal ? 4.1 : 1.8, cost: isAbnormal ? 32.8 : 14.4 },
        { timestamp: '10:00 AM', consumption_kwh: isAbnormal ? 8.9 : 2.0, cost: isAbnormal ? 71.2 : 16 },
        { timestamp: '12:00 PM', consumption_kwh: isAbnormal ? 9.2 : 2.1, cost: isAbnormal ? 73.6 : 16.8 },
      ],
      devices: [
        { id: `DEV-AC-${roomId}`, category: 'Air Conditioner', consumption_kwh: isAbnormal ? 160.0 : 45.0, cost: isAbnormal ? 1280.0 : 360.0, percentage: isAbnormal ? 76.0 : 47.0, status: isAbnormal ? 'high' : 'normal' },
        { id: `DEV-COMP-${roomId}`, category: 'Computers & Gaming', consumption_kwh: 30.0, cost: 240.0, percentage: isAbnormal ? 14.0 : 31.0, status: 'normal' },
        { id: `DEV-LT-${roomId}`, category: 'Lighting & Fans', consumption_kwh: 20.0, cost: 160.0, percentage: isAbnormal ? 10.0 : 22.0, status: 'efficient' },
      ],
      active_anomalies: isAbnormal ? [
        {
          actual_value: 38.5,
          expected_min: 10.0,
          expected_max: 15.0,
          deviation_percent: 156.6,
          severity: 'HIGH',
          status: 'ACTIVE'
        }
      ] : [],
      recommendations: [
        {
          id: `REC-${roomId}`,
          room_id: roomId,
          title: isAbnormal ? 'Late-Night Heavy Air Conditioner Operation' : 'Optimize Peak Cooling Hours',
          description: isAbnormal ? 'Continuous high load detected between 12 AM and 5 AM. AC set temperature may be set too low.' : 'Room consumption is within steady parameters.',
          suggested_action: 'Increase thermostat setting to 24°C or activate sleep timer.',
          potential_savings: '₹450 / month',
          severity: isAbnormal ? 'WARNING' : 'TIP'
        }
      ]
    };
    return fetchWithFallback<RoomDetail>(`${API_BASE_URL}/rooms/${roomId}`, mock);
  },

  // 5. Devices Breakdown
  async getDevices(): Promise<DeviceItem[]> {
    const mock: DeviceItem[] = [
      { id: 'CAT-AC', category: 'Air Conditioner', consumption_kwh: 408.0, cost: 3264.0, percentage: 48.0, status: 'high' },
      { id: 'CAT-COMP', category: 'Computers & Gaming', consumption_kwh: 187.0, cost: 1496.0, percentage: 22.0, status: 'normal' },
      { id: 'CAT-LT', category: 'Lighting Systems', consumption_kwh: 136.0, cost: 1088.0, percentage: 16.0, status: 'efficient' },
      { id: 'CAT-FN', category: 'Ceiling & Exhaust Fans', consumption_kwh: 85.0, cost: 680.0, percentage: 10.0, status: 'efficient' },
      { id: 'CAT-OTH', category: 'Other Small Appliances', consumption_kwh: 34.0, cost: 272.0, percentage: 4.0, status: 'normal' },
    ];
    return fetchWithFallback<DeviceItem[]>(`${API_BASE_URL}/devices`, mock);
  },

  // 6. Alerts List
  async getAlerts(statusFilter: string = 'ALL'): Promise<AlertItem[]> {
    const mock: AlertItem[] = [
      {
        id: 'ALT-101',
        room_id: 'ROOM-203',
        room_name: 'Room 203',
        title: 'Critical Power Surge in Room 203',
        message: 'Live AC spike detected: 38.5 kWh vs expected max 15.0 kWh (+156.6%).',
        severity: 'HIGH',
        actual_value: 38.5,
        expected_range: '10.0 - 15.0 kWh',
        timestamp: '10:30 AM',
        status: 'ACTIVE'
      },
      {
        id: 'ALT-102',
        room_id: 'ROOM-302',
        room_name: 'Room 302',
        title: 'Elevated Daytime Power Load',
        message: 'Sustained load of 18.5 kW detected across gaming desktop clusters.',
        severity: 'MEDIUM',
        actual_value: 26.2,
        expected_range: '12.0 - 18.0 kWh',
        timestamp: '09:15 AM',
        status: 'ACTIVE'
      },
      {
        id: 'ALT-103',
        room_id: 'ROOM-105',
        room_name: 'Room 105',
        title: 'Unusual Nighttime Fan Usage',
        message: 'Exhaust fan running continuously for >14 hours.',
        severity: 'LOW',
        actual_value: 14.8,
        expected_range: '5.0 - 10.0 kWh',
        timestamp: '06:00 AM',
        status: 'ACTIVE'
      },
    ];

    let filtered = mock;
    if (statusFilter !== 'ALL') {
      filtered = mock.filter(a => a.status === statusFilter);
    }
    return fetchWithFallback<AlertItem[]>(`${API_BASE_URL}/alerts?status_filter=${statusFilter}`, filtered);
  },

  // 7. Resolve Alert
  async resolveAlert(alertId: string): Promise<{ status: string; message: string }> {
    const mock = { status: 'success', message: `Alert ${alertId} marked as resolved.` };
    return fetchWithFallback<{ status: string; message: string }>(
      `${API_BASE_URL}/alerts/${alertId}/resolve`,
      mock,
      { method: 'POST' }
    );
  },

  // 8. Rankings
  async getRankings(): Promise<RankingResponse> {
    const mock: RankingResponse = {
      efficient_rooms: [
        { rank: 1, room_id: 'ROOM-101', room_name: 'Room 101', consumption_kwh: 95.0, cost: 760.0, score: 96.5 },
        { rank: 2, room_id: 'ROOM-104', room_name: 'Room 104', consumption_kwh: 102.0, cost: 816.0, score: 93.0 },
        { rank: 3, room_id: 'ROOM-204', room_name: 'Room 204', consumption_kwh: 115.0, cost: 920.0, score: 88.5 },
      ],
      high_consumers: [
        { rank: 1, room_id: 'ROOM-203', room_name: 'Room 203', consumption_kwh: 210.0, cost: 1680.0, score: 42.0 },
        { rank: 2, room_id: 'ROOM-302', room_name: 'Room 302', consumption_kwh: 195.0, cost: 1560.0, score: 51.2 },
        { rank: 3, room_id: 'ROOM-105', room_name: 'Room 105', consumption_kwh: 165.0, cost: 1320.0, score: 68.0 },
      ]
    };
    return fetchWithFallback<RankingResponse>(`${API_BASE_URL}/rankings`, mock);
  },

  // 9. Recommendations
  async getRecommendations(): Promise<RecommendationItem[]> {
    const mock: RecommendationItem[] = [
      {
        id: 'REC-203',
        room_id: 'ROOM-203',
        room_name: 'Room 203',
        title: 'Check Prolonged AC Operation in Room 203',
        description: 'Room 203 shows abnormal high power spikes (+156.6%) between 12 AM and 5 AM.',
        suggested_action: 'Configure automated cutoff timer or inspect AC compressor gasket for leakage.',
        potential_savings: '₹650 / month',
        severity: 'WARNING',
        created_at: 'Aug 21, 2026'
      },
      {
        id: 'REC-302',
        room_id: 'ROOM-302',
        room_name: 'Room 302',
        title: 'Enable High-Efficiency Power Profiles',
        description: 'High daytime idle power draw detected across computer equipment.',
        suggested_action: 'Set default auto-sleep policy to 15 mins inactivity.',
        potential_savings: '₹380 / month',
        severity: 'TIP',
        created_at: 'Aug 21, 2026'
      },
    ];
    return fetchWithFallback<RecommendationItem[]>(`${API_BASE_URL}/recommendations`, mock);
  },

  // 10. Live IoT Spike Simulation Trigger
  async triggerSpikeScenario(roomId: string = 'ROOM-203'): Promise<SimulationResult> {
    const mock: SimulationResult = {
      status: 'success',
      scenario: `Live AC spike triggered for ${roomId}`,
      normalized_reading: { timestamp: new Date().toISOString(), entity_id: roomId, value: 48.5, unit: 'kWh' },
      anomaly_result: { is_anomaly: true, actual_value: 48.5, expected_max: 15.0, severity: 'HIGH' },
      notification_dispatched: { dispatched: true, channel: 'in_app_toast' },
      recommendation_generated: 'Reduce late night compressor load'
    };
    return fetchWithFallback<SimulationResult>(
      `${API_BASE_URL}/simulation/trigger-spike?room_id=${roomId}`,
      mock,
      { method: 'POST' }
    );
  },

  // 11. Raw Ingestion Endpoint Test
  async ingestReading(payload: any): Promise<any> {
    const mock = { status: 'success', total_ingested: 1, anomalies_flagged: 1 };
    return fetchWithFallback<any>(
      `${API_BASE_URL}/energy/readings`,
      mock,
      { method: 'POST', body: JSON.stringify(payload) }
    );
  }
};
