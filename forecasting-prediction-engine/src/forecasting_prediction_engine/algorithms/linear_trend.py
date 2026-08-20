from typing import List
import numpy as np
from ..models import ForecastResult

class LinearTrendForecast:
    """Calculates linear slope and future period projections via least squares."""

    @staticmethod
    def forecast(history: List[float], remaining_periods: int = 15) -> ForecastResult:
        if not history:
            return ForecastResult(current_total=0, predicted_next_value=0, projected_period_total=0, trend="STABLE", growth_rate_percent=0, method_used="linear_trend")

        current_total = float(sum(history))
        n = len(history)

        if n == 1:
            val = history[0]
            future = [val] * remaining_periods
            return ForecastResult(
                current_total=val,
                predicted_next_value=val,
                projected_period_total=val * (remaining_periods + 1),
                trend="STABLE",
                growth_rate_percent=0.0,
                method_used="linear_trend",
                future_points=future
            )

        x = np.arange(n)
        y = np.array(history, dtype=float)
        slope, intercept = np.polyfit(x, y, 1)

        future_x = np.arange(n, n + remaining_periods)
        future_y = np.maximum(0.0, slope * future_x + intercept).tolist()
        future_y = [round(v, 2) for v in future_y]

        next_val = future_y[0] if future_y else 0.0
        projected_total = current_total + sum(future_y)

        mean_y = float(np.mean(y))
        growth_rate = ((slope * n) / mean_y * 100.0) if mean_y > 0 else 0.0

        if slope > 0.05 * mean_y:
            trend = "INCREASING"
        elif slope < -0.05 * mean_y:
            trend = "DECREASING"
        else:
            trend = "STABLE"

        return ForecastResult(
            current_total=round(current_total, 2),
            predicted_next_value=round(next_val, 2),
            projected_period_total=round(projected_total, 2),
            trend=trend,
            growth_rate_percent=round(growth_rate, 1),
            method_used="linear_trend_regression",
            future_points=future_y,
            confidence_score=0.92
        )
