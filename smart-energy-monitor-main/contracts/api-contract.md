# API Contract Specification (v1)

This contract defines the standardized REST API endpoints connecting the Frontend (Member 1) and Backend (Member 2).

---

## 1. Dashboard Summary
- **Endpoint:** `GET /api/v1/dashboard/summary`
- **Description:** Aggregated overview metrics for admin energy monitoring.

### Response (200 OK)
```json
{
  "total_consumption_kwh": 850.0,
  "current_load_kw": 42.6,
  "estimated_cost": 6840.0,
  "projected_bill": 12450.0,
  "active_alerts": 3,
  "data_source_status": {
    "connected": true,
    "source_type": "simulated_iot",
    "last_updated": "2026-08-21T10:30:00Z"
  }
}
```

---

## 2. Room Monitoring
- **Endpoint:** `GET /api/v1/rooms`
- **Description:** List of rooms with energy consumption, cost, trends, and status.

### Response (200 OK)
```json
[
  {
    "id": "ROOM-203",
    "name": "Room 203",
    "floor": "2nd Floor",
    "consumption_kwh": 210.0,
    "cost": 1680.0,
    "trend_percent": 24.0,
    "status": "abnormal"
  },
  {
    "id": "ROOM-105",
    "name": "Room 105",
    "floor": "1st Floor",
    "consumption_kwh": 165.0,
    "cost": 1320.0,
    "trend_percent": 8.0,
    "status": "normal"
  }
]
```

- **Endpoint:** `GET /api/v1/rooms/{room_id}`
- **Description:** Detail view of a specific room including consumption history, devices, anomalies, and recommendations.

---

## 3. Device Monitoring
- **Endpoint:** `GET /api/v1/devices`
- **Description:** Breakdown of consumption across device categories (AC, Lighting, Fans, Computers, etc.).

### Response (200 OK)
```json
[
  {
    "id": "DEV-AC-01",
    "category": "Air Conditioner",
    "consumption_kwh": 420.0,
    "cost": 3360.0,
    "percentage": 48.0,
    "status": "high"
  },
  {
    "id": "DEV-COMP-01",
    "category": "Computers",
    "consumption_kwh": 190.0,
    "cost": 1520.0,
    "percentage": 22.0,
    "status": "normal"
  }
]
```

---

## 4. Alerts
- **Endpoint:** `GET /api/v1/alerts`
- **Endpoint:** `POST /api/v1/alerts/{alert_id}/resolve`

---

## 5. Rankings
- **Endpoint:** `GET /api/v1/rankings`
- **Description:** Comparative energy rankings showing most efficient and highest consuming rooms.

---

## 6. Recommendations
- **Endpoint:** `GET /api/v1/recommendations`
- **Description:** AI/Rule-based energy savings suggestions.
