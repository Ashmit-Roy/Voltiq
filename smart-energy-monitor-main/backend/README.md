# ⚡ Voltiq Backend & Integration Layer

**Owner:** Member 2 (Backend & Integration Lead)  
**Framework:** FastAPI + SQLAlchemy + SQLite/PostgreSQL  
**Location:** `smart-energy-monitor-main/backend`

---

## 📌 Architecture & Responsibilities

Member 2 owns the complete server layer, database persistence, cost engine calculations, and acts as the **Integration Bridge** between the main application and the 3 standalone Tradable Assets plus acquired market modules:

```
                            FASTAPI BACKEND
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│ TRADABLE ASSET 1 │    │ TRADABLE ASSET 2 │    │  TRADABLE ASSET 3  │
│ Universal Data   │    │ Anomaly Detection│    │  Forecasting &     │
│ Ingestion        │    │ Engine           │    │  Prediction Engine │
└──────────────────┘    └──────────────────┘    └────────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         └────────────┬───────────┴────────────┬───────────┘
                      │                        │
                      ▼                        ▼
             ┌─────────────────┐      ┌─────────────────┐
             │  ACQUIRED (BUY) │      │  ACQUIRED (BUY) │
             │  Notification   │      │ Recommendation  │
             │  Alert Service  │      │ Engine          │
             └─────────────────┘      └─────────────────┘
```

---

## 🚀 Running the Backend

### Prerequisites
- Python 3.8+
- Dependencies installed from `requirements.txt`:
```bash
cd smart-energy-monitor-main/backend
pip install -r requirements.txt
```

### Start Server
```bash
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 API Endpoints (v1)

### 1. Dashboard Overview
- `GET /api/v1/dashboard/summary`: Summary KPIs (Total kWh, Current kW Load, Estimated Cost, Projected Bill, Active Alerts, Telemetry Status).
- `GET /api/v1/dashboard/trends?timeframe=daily|weekly|monthly`: Historical time-series consumption and peak curves.

### 2. Room Intelligence
- `GET /api/v1/rooms`: Summary list of all monitored rooms with status tags (`normal`, `high`, `efficient`, `abnormal`).
- `GET /api/v1/rooms/{room_id}`: Deep dive into a specific room (24-hour history, connected appliance breakdown, detected anomalies, and cost reduction suggestions).

### 3. Device Categories
- `GET /api/v1/devices`: Category breakdown (Air Conditioners, Computers, Lighting, Fans, Other).

### 4. Anomaly Alerts
- `GET /api/v1/alerts`: Active and resolved abnormal spikes flagged by the Anomaly Detection Engine.
- `POST /api/v1/alerts/{alert_id}/resolve`: Mark an alert as investigated and resolved.

### 5. Leaderboard & Comparative Rankings
- `GET /api/v1/rankings`: Top Energy Efficient rooms vs High Consumption areas.

### 6. Energy-Saving Recommendations
- `GET /api/v1/recommendations`: Actionable suggestions generated via the acquired Recommendation Engine.

### 7. Tradable Data Ingestion Endpoint
- `POST /api/v1/energy/readings`: Universal ingestion endpoint that parses raw IoT readings, runs anomaly detection, and persists readings to the DB.

### 8. Live Demo Simulation Controls
- `POST /api/v1/simulation/trigger-spike?room_id=ROOM-203`: Triggers a live AC surge in Room 203 (+153% anomaly) to demonstrate the real-time detection, alerting, and recommendation workflow.

---

## 🧪 Testing
```bash
pytest tests/
```
