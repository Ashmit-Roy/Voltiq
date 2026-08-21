# ⚡ Voltiq — Smart Energy Monitor

> **HACQUIRE 2026 | Problem Statement PS-07**  
> *Smart Energy Monitor for Hostels and Homes*  
> Built by Team Voltiq · FED, KIIT University

---

## 📌 What is Voltiq?

Voltiq is a full-stack smart energy monitoring system that helps hostels, apartments, and small businesses:

- **Monitor** real-time electricity consumption by room and device
- **Detect** unusual power spikes automatically using statistical anomaly detection
- **Forecast** upcoming monthly electricity bills using time-series prediction
- **Act** on energy-saving recommendations backed by live telemetry data

The system uses **simulated IoT sensor data** (no proprietary hardware required) and supports ingestion of any custom JSON or CSV dataset through its Universal Data Ingestion pipeline.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    VOLTIQ MAIN APPLICATION                   │
│                                                              │
│  ┌─────────────────────────┐   ┌────────────────────────┐   │
│  │   React + TypeScript    │   │   FastAPI + SQLAlchemy  │   │
│  │   Frontend (Vite)       │◄──►   Backend (Python)     │   │
│  │   localhost:5173        │   │   localhost:8000        │   │
│  └─────────────────────────┘   └──────────┬─────────────┘   │
│                                            │                 │
│              ┌─────────────────────────────┴──────────────┐  │
│              │          Integration Adapters Layer         │  │
│              │  ┌──────────────┐  ┌────────────────────┐  │  │
│              │  │  Tradable    │  │   Acquired Modules  │  │  │
│              │  │  Adapters    │  │   (Post Trade Floor)│  │  │
│              │  └──────┬───────┘  └────────────────────┘  │  │
│              └─────────┼──────────────────────────────────┘  │
└────────────────────────┼─────────────────────────────────────┘
                         │ imports from sibling repos
            ┌────────────┼────────────────────┐
            ▼            ▼                    ▼
  universal-data-  anomaly-detection-  forecasting-prediction-
     ingestion          engine              engine
  (Tradable #1)    (Tradable #2)       (Tradable #3)
```

---

## 🗂️ Repository Structure

```
smart-energy-monitor-main/
├── backend/
│   ├── app/
│   │   ├── api/                    # REST API route handlers
│   │   │   ├── dashboard.py        # GET /api/v1/dashboard/*
│   │   │   ├── rooms.py            # GET /api/v1/rooms/*
│   │   │   ├── devices.py          # GET /api/v1/devices/*
│   │   │   ├── alerts.py           # GET/PATCH /api/v1/alerts/*
│   │   │   ├── rankings.py         # GET /api/v1/rankings
│   │   │   ├── recommendations.py  # GET /api/v1/recommendations
│   │   │   ├── ingestion.py        # POST /api/v1/energy/readings
│   │   │   └── simulation.py       # POST /api/v1/simulation/trigger-spike
│   │   ├── database/
│   │   │   └── session.py          # SQLite engine, Base, get_db()
│   │   ├── integrations/
│   │   │   ├── tradable_adapters.py    # Wraps 3 tradable Python packages
│   │   │   └── acquired_adapters.py   # Plug-and-play slots for trade-floor buys
│   │   ├── models/
│   │   │   └── energy.py           # SQLAlchemy ORM: Room, Device, EnergyReading, etc.
│   │   ├── schemas/
│   │   │   └── energy.py           # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── data_seeder.py      # Auto-seeds 7 days of mock historical data
│   │   │   └── cost_engine.py      # Electricity cost calculation (Rs. 8/kWh default)
│   │   └── main.py                 # FastAPI app entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx   # KPI cards, trends chart, real-time simulation
│   │   │   ├── RoomsPage.tsx       # Room-wise consumption grid
│   │   │   ├── RoomDetailPage.tsx  # Per-room device breakdown + charts
│   │   │   ├── DevicesPage.tsx     # All devices table + status
│   │   │   ├── AlertsPage.tsx      # Active & resolved anomaly alerts
│   │   │   ├── RankingsPage.tsx    # Room energy efficiency leaderboard
│   │   │   └── AnalyticsPage.tsx   # Tradable assets showcase + Interactive Tester
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Header.tsx      # Top navigation bar
│   │   ├── services/
│   │   │   └── api.ts              # Axios API client (all backend calls)
│   │   └── App.tsx                 # Router + tab navigation
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── contracts/                      # Module manifest contracts (tradable asset specs)
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Git**

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Ashmit-Roy/Voltiq.git
cd Voltiq
```

---

### Step 2 — Start the Backend

```bash
cd smart-energy-monitor-main/backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

The backend will:
1. **Auto-create** the SQLite database (`smart_energy.db`)
2. **Auto-seed** rooms (`ROOM-101` to `ROOM-302`), devices, 7 days of historical readings, and demo alerts
3. **Connect** to all 3 tradable Python packages from sibling directories

> **API Docs available at**: `http://localhost:8000/docs`  
> **Health check**: `http://localhost:8000/health`

---

### Step 3 — Start the Frontend

```bash
cd smart-energy-monitor-main/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

> **App available at**: `http://localhost:5173`

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/summary` | Total kWh, current load, estimated cost, projected bill |
| `GET` | `/api/v1/dashboard/trends` | Time-series trend data (daily/weekly/monthly) |
| `GET` | `/api/v1/rooms` | All rooms with per-room consumption stats |
| `GET` | `/api/v1/rooms/{room_id}` | Single room details + device breakdown |
| `GET` | `/api/v1/devices` | All devices with status and power draw |
| `GET` | `/api/v1/alerts` | Active and resolved anomaly alerts |
| `PATCH` | `/api/v1/alerts/{alert_id}/resolve` | Mark an alert as resolved |
| `GET` | `/api/v1/rankings` | Room energy efficiency leaderboard |
| `GET` | `/api/v1/recommendations` | Energy-saving action recommendations |
| `POST` | `/api/v1/energy/readings` | **Ingest any raw JSON/CSV payload** (Universal Ingestion) |
| `POST` | `/api/v1/simulation/trigger-spike` | Simulate an AC power spike in a room |

---

## 🔌 Tradable Asset Integrations

Voltiq consumes **3 standalone tradable Python packages** built by the team. These are available as separate sellable repositories on the trading floor.

### How integration works

All 3 assets are imported in [`backend/app/integrations/tradable_adapters.py`](backend/app/integrations/tradable_adapters.py):

```python
from universal_data_ingestion import DataNormalizer
from anomaly_detection_engine import AnomalyDetector
from forecasting_prediction_engine import TimeSeriesForecaster

normalizer_adapter     = DataNormalizer()
anomaly_detector_adapter = AnomalyDetector(z_score_threshold=2.0)
forecaster_adapter     = TimeSeriesForecaster()
```

### Asset 1 — Universal Data Ingestion Layer
- **Repo**: `../universal-data-ingestion`
- **Used in**: `POST /api/v1/energy/readings`
- **What it does**: Accepts any raw JSON/CSV payload with any field names and normalizes it into a standard `StandardTelemetry` schema

**Example accepted payload formats:**
```json
{ "room_id": "ROOM-101", "device_id": "AC-01", "energy_kwh": 4.8 }
{ "location": "LAB-201",  "device": "FAN",      "value": 1.2, "unit": "kWh" }
{ "sensor_id": "S-42",    "room": "B-204",      "reading": 3.3 }
```

### Asset 2 — Anomaly Detection Engine
- **Repo**: `../anomaly-detection-engine`
- **Used in**: `POST /api/v1/energy/readings` + `POST /api/v1/simulation/trigger-spike`
- **What it does**: Evaluates each new reading against the last 10 historical readings using Z-score statistical analysis (μ ± 2σ). Flags spikes, sets severity (`LOW`/`MEDIUM`/`HIGH`), and auto-creates alerts.

### Asset 3 — Forecasting & Prediction Engine
- **Repo**: `../forecasting-prediction-engine`
- **Used in**: `GET /api/v1/dashboard/summary`
- **What it does**: Uses Linear Trend Regression on the last 7 days of totals to project remaining-month usage and calculate a projected electricity bill.

---

## 🗄️ Database

The backend uses **SQLite** (file: `backend/smart_energy.db`) with automatic migration via SQLAlchemy.

### Tables

| Table | Description |
| :--- | :--- |
| `rooms` | 12 rooms (ROOM-101 to ROOM-302), baseline consumption |
| `devices` | ACs, fans, lights, geysers per room |
| `energy_readings` | All telemetry readings (timestamp, room, device, kWh) |
| `anomaly_events` | Detected anomalies with deviation %, severity |
| `alerts` | UI-facing alerts (ACTIVE / RESOLVED) |
| `recommendations` | Energy-saving action cards |
| `system_configs` | Configurable parameters (cost rate, thresholds) |

The database is **auto-seeded** on every fresh startup via [`data_seeder.py`](backend/app/services/data_seeder.py) — no manual setup needed.

---

## 🧪 Testing with Custom / Random Data

### Via the Interactive Tester (No Code)

1. Open `http://localhost:5173`
2. Navigate to **Energy Analytics** tab
3. Scroll to **Interactive Data Ingestion Tester**
4. Paste any JSON payload and click **Ingest Payload**

**Test normal reading** (no alert triggered):
```json
{ "room": "ROOM-101", "device": "FAN-01", "reading": 1.5 }
```

**Test anomaly spike** (alert fires immediately):
```json
{ "room": "ROOM-101", "device": "AC-01", "reading": 75.0 }
```

### Via curl / Postman

```bash
# Normal reading
curl -X POST http://localhost:8000/api/v1/energy/readings \
  -H "Content-Type: application/json" \
  -d '{"room": "ROOM-203", "device": "AC-02", "reading": 3.2}'

# Trigger spike simulation
curl -X POST http://localhost:8000/api/v1/simulation/trigger-spike \
  -H "Content-Type: application/json" \
  -d '{"room_id": "ROOM-101", "spike_multiplier": 4.5}'
```

---

## 💰 Cost Calculation

The cost engine is configured at `Rs. 8.00 per kWh` (configurable in [`cost_engine.py`](backend/app/services/cost_engine.py)):

```
Estimated Cost     = Total kWh consumed × Rs. 8.00
Projected Bill     = Forecasted Month Total kWh × Rs. 8.00
```

---

## 🔒 Privacy, Safety & Accessibility

| Concern | How it's addressed |
| :--- | :--- |
| **Privacy** | No personal user data collected. All readings are room/device-scoped (not individual-level). |
| **Safety** | All anomaly detection is **advisory only** — no automated hardware shutoff decisions. Alerts are informational. |
| **Accessibility** | High-contrast UI, semantic HTML, keyboard-navigable tabs, ARIA-compatible components. |
| **No External APIs** | Entire system runs 100% locally (SQLite + local FastAPI). No third-party API keys required. |

---

## 🐳 Docker (Optional)

```bash
cd smart-energy-monitor-main
docker-compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

---

## 🏆 HACQUIRE 2026 — Tradable Assets

This main application sells 3 standalone modules on the Trading Floor:

| # | Asset Name | Standalone Repo | Domain Reusability |
| :--- | :--- | :--- | :--- |
| 1 | Universal Data Ingestion Layer | `universal-data-ingestion` | Energy, Water, Healthcare, Agriculture |
| 2 | Anomaly Detection Engine | `anomaly-detection-engine` | Energy, Servers, Factory, Finance |
| 3 | Forecasting & Prediction Engine | `forecasting-prediction-engine` | Energy, Sales, Cloud Cost, Inventory |

---

## 📝 Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 18, TypeScript, Vite, Recharts |
| Backend | Python 3.10+, FastAPI, SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Styling | Vanilla CSS, CSS Variables |
| Asset Packages | Python packages (pure stdlib + Pydantic) |

---

## 👥 Team Voltiq

Built for **HACQUIRE 2026** — FED, KIIT University  
Problem Statement: **PS-07 — Smart Energy Monitor for Hostels and Homes**
