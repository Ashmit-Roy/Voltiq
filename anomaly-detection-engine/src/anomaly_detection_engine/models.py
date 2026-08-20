from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class TimeSeriesPoint(BaseModel):
    timestamp: str
    value: float
    metadata: Dict[str, Any] = Field(default_factory=dict)

class AnomalyResult(BaseModel):
    is_anomaly: bool
    status: str  # "NORMAL" or "ABNORMAL"
    actual_value: float
    expected_min: float
    expected_max: float
    deviation_percent: float
    severity: str  # "NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"
    method_used: str
    message: str

class BatchAnomalyReport(BaseModel):
    total_analyzed: int
    anomalies_detected: int
    anomalous_indices: List[int]
    results: List[AnomalyResult]
