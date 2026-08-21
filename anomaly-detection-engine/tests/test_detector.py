import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from anomaly_detection_engine import AnomalyDetector

class TestAnomalyDetector(unittest.TestCase):
    def test_anomaly_detection(self):
        detector = AnomalyDetector(z_score_threshold=2.0)
        baseline = [10.0, 11.2, 10.8, 12.0, 11.5]
        
        # Normal value
        normal_res = detector.evaluate(current_value=11.0, history=baseline)
        self.assertFalse(normal_res.is_anomaly)
        self.assertEqual(normal_res.status, "NORMAL")
        
        # Spike / Anomaly
        spike_res = detector.evaluate(current_value=38.0, history=baseline)
        self.assertTrue(spike_res.is_anomaly)
        self.assertEqual(spike_res.status, "ABNORMAL")
        self.assertIn(spike_res.severity, ["MEDIUM", "HIGH"])

if __name__ == "__main__":
    unittest.main()
