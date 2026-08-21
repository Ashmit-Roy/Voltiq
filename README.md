# ⚡ Voltiq — HACQUIRE 2026

> **Problem Statement: PS-07 — Smart Energy Monitor for Hostels and Homes**  
> Built by Team KWIKWIT · FED, KIIT University

---

## 📦 Repository Structure

This monorepo contains **1 Main Application** and **3 Tradable Standalone Assets**:

```
Voltiq/
├── smart-energy-monitor-main/     # 🖥️  Main Product (Full-Stack App)
├── universal-data-ingestion/      # 🔌  Tradable Asset #1 — SELL
├── anomaly-detection-engine/      # 🚨  Tradable Asset #2 — SELL
└── forecasting-prediction-engine/ # 📈  Tradable Asset #3 — SELL
```

---

## 🖥️ Main Application — Voltiq Smart Energy Monitor

A full-stack energy monitoring dashboard with real-time ingestion, anomaly detection, and bill forecasting.

- **Frontend**: React + TypeScript + Vite → `localhost:5173`
- **Backend**: FastAPI + SQLAlchemy + SQLite → `localhost:8000`

📖 **[View Full Documentation →](smart-energy-monitor-main/README.md)**

### Quick Start

```bash
# Backend
cd smart-energy-monitor-main/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd smart-energy-monitor-main/frontend
npm install && npm run dev
```

---

## 🔌 Tradable Asset #1 — Universal Data Ingestion Layer

Normalizes any raw CSV, REST API, or IoT sensor payload into a standard `StandardTelemetry` schema regardless of field names.

```bash
cd universal-data-ingestion
python examples/quickstart.py          # Run demo
python -m unittest discover tests      # Run tests (3/3 OK)
```

📖 **[View Asset Documentation →](universal-data-ingestion/README.md)**

---

## 🚨 Tradable Asset #2 — Anomaly Detection Engine

Detects power spikes and outliers in time-series telemetry using Z-score statistical analysis (μ ± 2σ).

```bash
cd anomaly-detection-engine
python examples/detect_demo.py         # Run demo
python examples/batch_timeseries_demo.py
python -m unittest discover tests      # Run tests (3/3 OK)
```

📖 **[View Asset Documentation →](anomaly-detection-engine/README.md)**

---

## 📈 Tradable Asset #3 — Forecasting & Prediction Engine

Projects future period consumption and estimates monthly bills using Linear Trend, Exponential Smoothing, and Moving Average algorithms.

```bash
cd forecasting-prediction-engine
python examples/forecast_demo.py       # Run demo
python examples/multi_method_comparison.py
python -m unittest discover tests      # Run tests (4/4 OK)
```

📖 **[View Asset Documentation →](forecasting-prediction-engine/README.md)**

---

## ✅ All Systems Green

| Component | Status |
| :--- | :--- |
| Main App Backend | ✅ Running |
| Main App Frontend | ✅ Running |
| Universal Data Ingestion | ✅ 3/3 Tests Passing |
| Anomaly Detection Engine | ✅ 3/3 Tests Passing |
| Forecasting & Prediction | ✅ 4/4 Tests Passing |
