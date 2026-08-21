import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from forecasting_prediction_engine import LinearTrendForecast, MovingAverageForecast, ExponentialSmoothingForecast

class TestForecastingAlgorithms(unittest.TestCase):
    def test_linear_trend(self):
        history = [10.0, 20.0, 30.0, 40.0]
        res = LinearTrendForecast.forecast(history, remaining_periods=2)
        self.assertEqual(res.current_total, 100.0)
        self.assertEqual(res.predicted_next_value, 50.0)
        self.assertEqual(res.projected_period_total, 210.0)
        self.assertEqual(res.trend, "INCREASING")

    def test_moving_average(self):
        history = [10.0, 10.0, 10.0, 10.0]
        res = MovingAverageForecast.forecast(history, remaining_periods=2)
        self.assertEqual(res.current_total, 40.0)
        self.assertEqual(res.predicted_next_value, 10.0)
        self.assertEqual(res.projected_period_total, 60.0)
        self.assertEqual(res.trend, "STABLE")

    def test_exponential_smoothing(self):
        history = [15.0, 15.0, 15.0, 15.0]
        res = ExponentialSmoothingForecast.forecast(history, remaining_periods=3)
        self.assertEqual(res.current_total, 60.0)
        self.assertEqual(round(res.predicted_next_value, 1), 15.0)
        self.assertEqual(round(res.projected_period_total, 1), 105.0)

if __name__ == "__main__":
    unittest.main()
