from universal_data_ingestion import CSVSourceParser

def test_csv_parsing():
    sample_csv = """timestamp,location,device,value,unit
2026-08-21T10:00:00Z,ROOM-101,AC-01,2.4,kWh
2026-08-21T10:00:00Z,ROOM-203,AC-02,4.8,kWh
"""
    parser = CSVSourceParser()
    result = parser.parse_csv_content(sample_csv)
    
    assert result.total_records == 2
    assert result.successful_records == 2
    assert result.failed_records == 0
    assert result.data[0].entity_id == "ROOM-101"
    assert result.data[0].value == 2.4
    assert result.data[1].entity_id == "ROOM-203"
    assert result.data[1].value == 4.8
