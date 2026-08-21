# Smart Energy Monitor (Main Application)

**Track:** PS-07 Smart Energy Monitor for Hostels and Homes  
**Repository:** `smart-energy-monitor-main`

---

## 📌 Overview
The **Smart Energy Monitor** is a centralized energy intelligence platform designed for hostels, apartments, and small commercial facilities. It helps monitor real-time consumption, tracks room-wise and device-wise usage, detects abnormal energy spikes, estimates costs, projects future electricity bills, and offers actionable energy-saving recommendations.

---

## 🏗️ System Architecture & Multi-Repository Model

```
                    ┌────────────────────────────┐
                    │   MAIN APPLICATION REPO    │
                    │ smart-energy-monitor-main  │
                    └──────────────┬─────────────┘
                                   │
                      Integrates / Consumes
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
 ┌───────────────────┐   ┌───────────────────┐   ┌────────────────────┐
 │ TRADABLE REPO 1   │   │ TRADABLE REPO 2   │   │ TRADABLE REPO 3    │
 │ Universal Data    │   │ Anomaly Detection │   │ Forecasting &      │
 │ Ingestion         │   │ Engine            │   │ Prediction Engine  │
 └───────────────────┘   └───────────────────┘   └────────────────────┘
```

---

## 📁 Repository Structure
```
smart-energy-monitor-main/
│
├── frontend/                       # React + TypeScript + Tailwind CSS (Member 1)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   └── package.json
│
├── backend/                        # FastAPI + SQLAlchemy + SQLite/PostgreSQL (Member 2)
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── integrations/
│   │   └── database/
│   └── requirements.txt
│
├── contracts/                      # Shared API and Data Contracts
│   ├── api-contract.md
│   ├── energy-reading.schema.json
│   └── examples/
│
├── docs/                           # PRD, Architecture, and Design Specs
│   ├── PRD.md
│   ├── DESIGN.md
│   └── TECH_STACK.md
│
├── AGENT.md
├── README.md
└── docker-compose.yml
```

---

## 🚀 Quickstart

### Backend
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
