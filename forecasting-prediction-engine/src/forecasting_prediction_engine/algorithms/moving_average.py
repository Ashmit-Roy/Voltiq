from typing import List
import numpy as np
from ..models import ForecastResult

class MovingAverageForecast:
    """Calculates rolling window moving averages for steady state baseline forecasting."""

    @staticmethod
    def forecast(history: List[float], remaining_periods: int = 15, window_size: int = 5) -> ForecastResult:
        if not history:
            return ForecastResult(current_total=0, predicted_next_value=0, projected_period_total=0, trend="STABLE", growth_rate_percent=0, method_used="moving_average")

        current_total = float(sum(history))
        window = history[-window_size:] if len(history) >= window_size else history
        avg_val = float(np.mean(window))

        future = [round(avg_val, 2)] * remaining_periods
        projected_total = current_total + (avg_val * remaining_periods)

        # Simple trend check
        first_half = np.mean(history[:len(history)//2]) if len(history) > 1 else history[0]
        second_half = np.mean(history[len(history)//2:]) if len(history) > 1 else history[0]
        growth = ((second_half - first_half) / (first_half or 1.0)) * 100.0

        trend = "INCREASING" if growth > 5.0 else "DECREASING" if growth < -5.0 else "STABLE"

        return ForecastResult(
            current_total=round(current_total, 2),
            predicted_next_value=round(avg_val, 2),
            projected_period_total=round(projected_total, 2),
            trend=trend,
            growth_rate_percent=round(growth, 1),
            method_used="moving_average",
            future_points=future,
            confidence_score=0.88
        )
