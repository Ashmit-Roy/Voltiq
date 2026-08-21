from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ingestion_integration_pipeline():
    """Tests the full pipeline: Ingest raw JSON -> Normalize -> Check Anomaly -> Store."""
    payload = {
        "location": "ROOM-203",
        "device": "AC-01",
        "value": 4.5,
        "unit": "kWh"
    }
    response = client.post("/api/v1/energy/readings", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_ingested"] == 1
    assert data["records"][0]["entity_id"] == "ROOM-203"

def test_simulation_spike_pipeline():
    """Tests the live demo spike pipeline triggering anomaly engine and notification service."""
    response = client.post("/api/v1/simulation/trigger-spike?room_id=ROOM-203")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "anomaly_result" in data
    assert data["anomaly_result"]["is_anomaly"] is True
    assert data["notification_dispatched"]["status"] == "DELIVERED"
