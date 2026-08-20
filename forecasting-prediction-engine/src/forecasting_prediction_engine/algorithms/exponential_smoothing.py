from typing import List
from ..models import ForecastResult

class ExponentialSmoothingForecast:
    """Calculates simple exponential smoothing with alpha weighting for recent telemetry points."""

    @staticmethod
    def forecast(history: List[float], remaining_periods: int = 15, alpha: float = 0.3) -> ForecastResult:
        if not history:
            return ForecastResult(current_total=0, predicted_next_value=0, projected_period_total=0, trend="STABLE", growth_rate_percent=0, method_used="exponential_smoothing")

        current_total = float(sum(history))
        smoothed = history[0]

        for val in history[1:]:
            smoothed = (alpha * val) + ((1.0 - alpha) * smoothed)

        future = [round(smoothed, 2)] * remaining_periods
        projected_total = current_total + (smoothed * remaining_periods)

        last_val = history[-1]
        diff = ((last_val - smoothed) / (smoothed or 1.0)) * 100.0
        trend = "INCREASING" if diff > 5.0 else "DECREASING" if diff < -5.0 else "STABLE"

        return ForecastResult(
            current_total=round(current_total, 2),
            predicted_next_value=round(smoothed, 2),
            projected_period_total=round(projected_total, 2),
            trend=trend,
            growth_rate_percent=round(diff, 1),
            method_used="exponential_smoothing",
            future_points=future,
            confidence_score=0.90
        )
