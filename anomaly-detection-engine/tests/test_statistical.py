import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from anomaly_detection_engine import StatisticalAnomalyEvaluator

class TestStatisticalAnomalyEvaluator(unittest.TestCase):
    def test_statistical_evaluator(self):
        history = [10.0, 10.5, 11.0, 10.8, 11.2]
        mean_val, std_val, exp_min, exp_max = StatisticalAnomalyEvaluator.calculate_bounds(history, z_threshold=2.0)
        
        self.assertEqual(round(mean_val, 1), 10.7)
        self.assertTrue(exp_min < mean_val < exp_max)
        
        z_score_normal = StatisticalAnomalyEvaluator.compute_z_score(11.0, mean_val, std_val)
        self.assertTrue(abs(z_score_normal) < 2.0)
        
        z_score_spike = StatisticalAnomalyEvaluator.compute_z_score(35.0, mean_val, std_val)
        self.assertTrue(z_score_spike > 5.0)

if __name__ == "__main__":
    unittest.main()
