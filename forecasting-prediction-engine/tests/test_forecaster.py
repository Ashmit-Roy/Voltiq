import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from forecasting_prediction_engine import TimeSeriesForecaster

class TestTimeSeriesForecaster(unittest.TestCase):
    def test_forecasting(self):
        forecaster = TimeSeriesForecaster()
        history = [100.0, 110.0, 120.0, 130.0, 140.0]
        result = forecaster.forecast_period(history, remaining_periods=5)
        
        self.assertEqual(result.current_total, 600.0)
        self.assertTrue(result.predicted_next_value > 140.0)
        self.assertTrue(result.projected_period_total > 600.0)
        self.assertEqual(result.trend, "INCREASING")

if __name__ == "__main__":
    unittest.main()
