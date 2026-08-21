import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from anomaly_detection_engine import RuleBasedAnomalyEvaluator

class TestRuleBasedAnomalyEvaluator(unittest.TestCase):
    def test_rule_evaluator(self):
        # Hard limit test
        is_anomaly, msg = RuleBasedAnomalyEvaluator.evaluate_hard_limit(55.0, max_limit=50.0)
        self.assertTrue(is_anomaly)
        
        # Normal value
        is_anomaly_norm, _ = RuleBasedAnomalyEvaluator.evaluate_hard_limit(42.0, max_limit=50.0)
        self.assertFalse(is_anomaly_norm)

        # Percentage surge test
        is_surge, dev_pct = RuleBasedAnomalyEvaluator.evaluate_percentage_surge(30.0, baseline_mean=10.0, surge_multiplier=1.5)
        self.assertTrue(is_surge)
        self.assertEqual(dev_pct, 200.0)

if __name__ == "__main__":
    unittest.main()
