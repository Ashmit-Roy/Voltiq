export interface DashboardSummary {
  total_consumption_kwh: number;
  current_load_kw: number;
  estimated_cost: number;
  projected_bill: number;
  active_alerts: number;
  data_source_status: {
    connected: boolean;
    source_type: string;
    last_updated: string;
  };
}

export interface RoomItem {
  id: string;
  name: string;
  floor: string;
  consumption_kwh: number;
  cost: number;
  trend_percent: number;
  status: 'normal' | 'high' | 'efficient' | 'abnormal';
}

export interface DeviceItem {
  id: string;
  category: string;
  consumption_kwh: number;
  cost: number;
  percentage: number;
  status: 'normal' | 'high' | 'efficient';
}

export interface AlertItem {
  id: string;
  room_id: string;
  room_name: string;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  actual_value: number;
  expected_range: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface RankingItem {
  rank: number;
  room_name: string;
  consumption_kwh: number;
  cost: number;
  efficiency_score: number;
  category: 'efficient' | 'high_consumer';
}

export interface RecommendationItem {
  id: string;
  room_id: string;
  title: string;
  description: string;
  suggested_action: string;
  potential_savings: string;
  severity: 'TIP' | 'WARNING';
}
