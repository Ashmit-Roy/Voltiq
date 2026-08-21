import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from universal_data_ingestion import DataNormalizer

class TestDataNormalizer(unittest.TestCase):
    def test_normalization(self):
        normalizer = DataNormalizer()
        raw = {
            "timestamp": "2026-08-21T10:00:00Z",
            "location": "ROOM-101",
            "device": "FAN-01",
            "value": 1.5,
            "unit": "kWh"
        }
        result = normalizer.normalize(raw, source_type="mock_iot")
        self.assertEqual(result.entity_id, "ROOM-101")
        self.assertEqual(result.source_id, "FAN-01")
        self.assertEqual(result.value, 1.5)
        self.assertEqual(result.source_type, "mock_iot")

if __name__ == "__main__":
    unittest.main()
