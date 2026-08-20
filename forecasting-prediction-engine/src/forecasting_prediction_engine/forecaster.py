from typing import List, Optional
from .models import ForecastResult, MultiMethodComparison
from .algorithms.linear_trend import LinearTrendForecast
from .algorithms.moving_average import MovingAverageForecast
from .algorithms.exponential_smoothing import ExponentialSmoothingForecast

class TimeSeriesForecaster:
    """
    Forecasting & Prediction Engine (HACQUIRE SELL #3).
    Predicts future demand, short-term trends, and end-of-period totals
    using Linear Regression, Moving Averages, or Exponential Smoothing.
    """

    def __init__(self, default_method: str = "linear_trend"):
        self.default_method = default_method

    def forecast_period(
        self,
        historical_values: List[float],
        remaining_periods: int = 15,
        method: Optional[str] = None
    ) -> ForecastResult:
        """Generates forecast projection using the selected algorithm."""
        selected = method or self.default_method

        if selected == "moving_average":
            return MovingAverageForecast.forecast(historical_values, remaining_periods=remaining_periods)
        elif selected == "exponential_smoothing":
            return ExponentialSmoothingForecast.forecast(historical_values, remaining_periods=remaining_periods)
        else:
            return LinearTrendForecast.forecast(historical_values, remaining_periods=remaining_periods)

    def compare_methods(self, historical_values: List[float], remaining_periods: int = 15) -> MultiMethodComparison:
        """Evaluates all algorithms simultaneously for comparison."""
        lt = LinearTrendForecast.forecast(historical_values, remaining_periods=remaining_periods)
        ma = MovingAverageForecast.forecast(historical_values, remaining_periods=remaining_periods)
        es = ExponentialSmoothingForecast.forecast(historical_values, remaining_periods=remaining_periods)

        return MultiMethodComparison(
            linear_trend=lt,
            moving_average=ma,
            exponential_smoothing=es,
            recommended_method="linear_trend" if abs(lt.growth_rate_percent) > 2.0 else "exponential_smoothing"
        )
