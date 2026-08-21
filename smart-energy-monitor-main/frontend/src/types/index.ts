export interface DataSourceStatus {
  connected: boolean;
  source_type: string;
  last_updated: string;
}

export interface DashboardSummary {
  total_consumption_kwh: number;
  current_load_kw: number;
  estimated_cost: number;
  projected_bill: number;
  active_alerts: number;
  data_source_status: DataSourceStatus;
}

export interface TrendPoint {
  timestamp: string;
  consumption_kwh: number;
  cost: number;
}

export interface DashboardTrendsResponse {
  timeframe: 'daily' | 'weekly' | 'monthly';
  data: TrendPoint[];
}

export interface RoomItem {
  id: string;
  name: string;
  floor: string;
  consumption_kwh: number;
  cost: number;
  trend_percent: number;
  status: 'normal' | 'high' | 'efficient' | 'abnormal';
  current_load_kw?: number;
}

export interface RoomDetail {
  id: string;
  name: string;
  floor: string;
  total_consumption_kwh: number;
  estimated_cost: number;
  projected_cost: number;
  status: string;
  history: TrendPoint[];
  devices: DeviceItem[];
  active_anomalies: AnomalyEvent[];
  recommendations: RecommendationItem[];
}

export interface DeviceItem {
  id: string;
  name?: string;
  category: string;
  room_id?: string;
  consumption_kwh: number;
  cost: number;
  percentage: number;
  status: 'normal' | 'high' | 'efficient';
}

export interface AnomalyEvent {
  actual_value: number;
  expected_min: number;
  expected_max: number;
  deviation_percent: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
}

export interface AlertItem {
  id: string;
  room_id: string;
  room_name: string;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actual_value: number;
  expected_range: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface RankingItem {
  rank: number;
  room_id: string;
  room_name: string;
  consumption_kwh: number;
  cost: number;
  score: number;
}

export interface RankingResponse {
  efficient_rooms: RankingItem[];
  high_consumers: RankingItem[];
}

export interface RecommendationItem {
  id: string;
  room_id: string;
  room_name?: string;
  title: string;
  description: string;
  suggested_action: string;
  potential_savings: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'TIP' | 'WARNING';
  created_at?: string;
}

export interface SimulationResult {
  status: string;
  scenario: string;
  normalized_reading: any;
  anomaly_result: any;
  notification_dispatched: any;
  recommendation_generated?: string | null;
}
