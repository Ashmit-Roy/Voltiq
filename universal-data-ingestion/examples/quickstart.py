from universal_data_ingestion import DataNormalizer

if __name__ == "__main__":
    normalizer = DataNormalizer()
    sample_payload = {
        "timestamp": "2026-08-21T10:30:00Z",
        "location": "ROOM-203",
        "device": "AC-01",
        "value": 4.8,
        "unit": "kWh"
    }
    
    normalized = normalizer.normalize(sample_payload, source_type="esp32_sensor")
    print("--- Universal Ingestion Output ---")
    print(normalized.model_dump_json(indent=2))
