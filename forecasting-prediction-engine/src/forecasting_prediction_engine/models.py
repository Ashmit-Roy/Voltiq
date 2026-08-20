from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ForecastResult(BaseModel):
    current_total: float
    predicted_next_value: float
    projected_period_total: float
    trend: str  # "INCREASING", "DECREASING", "STABLE"
    growth_rate_percent: float
    method_used: str
    future_points: List[float] = Field(default_factory=list)
    confidence_score: float = 0.90

class MultiMethodComparison(BaseModel):
    linear_trend: ForecastResult
    moving_average: ForecastResult
    exponential_smoothing: ForecastResult
    recommended_method: str
