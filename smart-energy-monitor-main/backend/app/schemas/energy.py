from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class DataSourceStatus(BaseModel):
    connected: bool
    source_type: str
    last_updated: str

class DashboardSummaryResponse(BaseModel):
    total_consumption_kwh: float
    current_load_kw: float
    estimated_cost: float
    projected_bill: float
    active_alerts: int
    data_source_status: DataSourceStatus

class TrendPoint(BaseModel):
    timestamp: str
    consumption_kwh: float
    cost: float

class DashboardTrendsResponse(BaseModel):
    timeframe: str
    data: List[TrendPoint]

class DeviceResponse(BaseModel):
    id: str
    name: Optional[str] = None
    category: str
    room_id: Optional[str] = None
    consumption_kwh: float
    cost: float
    percentage: float
    status: str

class RoomResponse(BaseModel):
    id: str
    name: str
    floor: str
    consumption_kwh: float
    cost: float
    trend_percent: float
    status: str
    current_load_kw: Optional[float] = 0.0

class RoomDetailResponse(BaseModel):
    id: str
    name: str
    floor: str
    total_consumption_kwh: float
    estimated_cost: float
    projected_cost: float
    status: str
    history: List[TrendPoint]
    devices: List[DeviceResponse]
    active_anomalies: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]

class AlertResponse(BaseModel):
    id: str
    room_id: str
    room_name: str
    title: str
    message: str
    severity: str
    actual_value: float
    expected_range: str
    timestamp: str
    status: str

class RankingItem(BaseModel):
    rank: int
    room_id: str
    room_name: str
    consumption_kwh: float
    cost: float
    score: float

class RankingResponse(BaseModel):
    efficient_rooms: List[RankingItem]
    high_consumers: List[RankingItem]

class RecommendationResponse(BaseModel):
    id: str
    room_id: str
    room_name: Optional[str] = None
    title: str
    description: str
    suggested_action: str
    potential_savings: str
    severity: str
    created_at: str

class IngestionPayload(BaseModel):
    timestamp: Optional[str] = None
    room_id: str
    device_id: Optional[str] = "main"
    energy_kwh: float
    power_kw: Optional[float] = 0.0
    source: Optional[str] = "api"
