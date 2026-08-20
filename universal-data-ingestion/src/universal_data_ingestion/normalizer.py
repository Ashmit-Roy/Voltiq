from typing import Dict, Any, Union, List
from .schemas import StandardTelemetry, BatchTelemetryResponse
from .sources.csv_source import CSVSourceParser
from .sources.json_source import JSONSourceParser
from .sources.mock_stream import MockStreamGenerator
from datetime import datetime

class DataNormalizer:
    """Universal Normalizer for time-series, energy, and sensor telemetry."""

    def __init__(self):
        self.csv_parser = CSVSourceParser()
        self.json_parser = JSONSourceParser()
        self.mock_generator = MockStreamGenerator()

    def normalize(self, data: Dict[str, Any], source_type: str = "generic") -> StandardTelemetry:
        """Normalizes a single record."""
        batch = self.json_parser.parse_payload(data, source_type=source_type)
        if batch.data:
            return batch.data[0]
        raise ValueError("Failed to normalize data record.")

    def normalize_batch(self, items: List[Dict[str, Any]], source_type: str = "json_batch") -> BatchTelemetryResponse:
        """Normalizes a list of dictionaries."""
        return self.json_parser.parse_payload(items, source_type=source_type)

    def normalize_csv(self, csv_text: str) -> BatchTelemetryResponse:
        """Normalizes a CSV string."""
        return self.csv_parser.parse_csv_content(csv_text)

    def generate_mock_stream(self, count: int = 5):
        """Generates mock stream objects."""
        return list(self.mock_generator.stream(count=count))
