from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class StandardTelemetry(BaseModel):
    """Universal normalized telemetry record."""
    timestamp: str
    entity_id: str
    source_id: str = "main"
    metric_type: str = "energy"
    value: float
    unit: str = "kWh"
    source_type: str = "generic"
    metadata: Dict[str, Any] = Field(default_factory=dict)

class BatchTelemetryResponse(BaseModel):
    """Batch normalization summary."""
    total_records: int
    successful_records: int
    failed_records: int
    data: List[StandardTelemetry]
    errors: List[Dict[str, Any]] = Field(default_factory=list)
