from universal_data_ingestion import DataNormalizer

def test_normalization():
    normalizer = DataNormalizer()
    raw = {
        "timestamp": "2026-08-21T10:00:00Z",
        "location": "ROOM-101",
        "device": "FAN-01",
        "value": 1.5,
        "unit": "kWh"
    }
    result = normalizer.normalize(raw, source_type="mock_iot")
    assert result.entity_id == "ROOM-101"
    assert result.source_id == "FAN-01"
    assert result.value == 1.5
    assert result.source_type == "mock_iot"
