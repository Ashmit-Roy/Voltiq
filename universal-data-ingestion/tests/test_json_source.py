from universal_data_ingestion import JSONSourceParser

def test_json_batch_parsing():
    batch = [
        {"room_id": "ROOM-101", "device_id": "FAN-01", "energy_kwh": 1.2},
        {"room_id": "ROOM-203", "device_id": "AC-01", "energy_kwh": 4.9}
    ]
    parser = JSONSourceParser()
    result = parser.parse_payload(batch, source_type="api_batch")
    
    assert result.total_records == 2
    assert result.successful_records == 2
    assert result.data[0].entity_id == "ROOM-101"
    assert result.data[0].value == 1.2
    assert result.data[1].entity_id == "ROOM-203"
    assert result.data[1].value == 4.9
