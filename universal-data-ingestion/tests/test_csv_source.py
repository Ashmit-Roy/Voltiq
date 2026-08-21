import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from universal_data_ingestion import CSVSourceParser

class TestCSVSourceParser(unittest.TestCase):
    def test_csv_parsing(self):
        sample_csv = """timestamp,location,device,value,unit
2026-08-21T10:00:00Z,ROOM-101,AC-01,2.4,kWh
2026-08-21T10:00:00Z,ROOM-203,AC-02,4.8,kWh
"""
        parser = CSVSourceParser()
        result = parser.parse_csv_content(sample_csv)
        
        self.assertEqual(result.total_records, 2)
        self.assertEqual(result.successful_records, 2)
        self.assertEqual(result.failed_records, 0)
        self.assertEqual(result.data[0].entity_id, "ROOM-101")
        self.assertEqual(result.data[0].value, 2.4)
        self.assertEqual(result.data[1].entity_id, "ROOM-203")
        self.assertEqual(result.data[1].value, 4.8)

if __name__ == "__main__":
    unittest.main()
