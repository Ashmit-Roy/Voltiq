from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "integrations" in data

def test_dashboard_summary():
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_consumption_kwh" in data
    assert "current_load_kw" in data
    assert "estimated_cost" in data
    assert "projected_bill" in data
    assert "active_alerts" in data
    assert data["data_source_status"]["connected"] is True

def test_rooms_endpoints():
    # All rooms
    response = client.get("/api/v1/rooms")
    assert response.status_code == 200
    rooms = response.json()
    assert len(rooms) >= 5
    assert any(r["id"] == "ROOM-203" for r in rooms)

    # Single room detail
    detail_res = client.get("/api/v1/rooms/ROOM-203")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["id"] == "ROOM-203"
    assert "devices" in detail
    assert "history" in detail

def test_devices_endpoint():
    response = client.get("/api/v1/devices")
    assert response.status_code == 200
    devices = response.json()
    assert len(devices) >= 3
    assert any("Air" in d["category"] for d in devices)

def test_alerts_and_resolve():
    # Get alerts
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) > 0

    # Resolve alert
    first_id = alerts[0]["id"]
    resolve_res = client.post(f"/api/v1/alerts/{first_id}/resolve")
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "success"

def test_rankings_endpoint():
    response = client.get("/api/v1/rankings")
    assert response.status_code == 200
    rankings = response.json()
    assert "efficient_rooms" in rankings
    assert "high_consumers" in rankings
    assert len(rankings["efficient_rooms"]) > 0

def test_recommendations_endpoint():
    response = client.get("/api/v1/recommendations")
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) > 0
