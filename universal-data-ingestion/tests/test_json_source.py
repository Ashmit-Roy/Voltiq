import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from universal_data_ingestion import JSONSourceParser

class TestJSONSourceParser(unittest.TestCase):
    def test_json_batch_parsing(self):
        batch = [
            {"room_id": "ROOM-101", "device_id": "FAN-01", "energy_kwh": 1.2},
            {"room_id": "ROOM-203", "device_id": "AC-01", "energy_kwh": 4.9}
        ]
        parser = JSONSourceParser()
        result = parser.parse_payload(batch, source_type="api_batch")
        
        self.assertEqual(result.total_records, 2)
        self.assertEqual(result.successful_records, 2)
        self.assertEqual(result.data[0].entity_id, "ROOM-101")
        self.assertEqual(result.data[0].value, 1.2)
        self.assertEqual(result.data[1].entity_id, "ROOM-203")
        self.assertEqual(result.data[1].value, 4.9)

if __name__ == "__main__":
    unittest.main()
