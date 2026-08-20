# PS-07 Smart Energy Monitor — Technology Stack

## 1. Project Overview

**Track / ID:** PS-07  
**Problem Title:** Smart Energy Monitor for Hostels and Homes  
**Domain:** IoT / Energy Efficiency

This technology stack is designed for a hackathon implementation of a system that can:

- Monitor real-time or simulated energy data
- Track room-wise energy consumption
- Track device-wise energy consumption
- Detect abnormal usage
- Estimate electricity costs
- Project future electricity bills
- Generate energy-saving recommendations
- Provide admin analytics and comparative rankings

The architecture should support both **simulated data for the hackathon MVP** and **real IoT sensors in the future**.

---

# 2. Recommended Technology Stack

```text
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│                                                     │
│     React + TypeScript + Tailwind CSS               │
│                                                     │
│  Dashboard • Rooms • Devices • Alerts • Rankings    │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ REST API / WebSocket
                        ▼
┌─────────────────────────────────────────────────────┐
│                    BACKEND                          │
│                                                     │
│        Python + FastAPI                             │
│                                                     │
│ API • Data Processing • Cost Calculation            │
│ Anomaly Detection • Forecasting • Business Logic    │
└───────────────┬───────────────────┬─────────────────┘
                │                   │
                ▼                   ▼
┌────────────────────────┐  ┌────────────────────────┐
│      DATA LAYER        │  │    ANALYTICS / ML      │
│                        │  │                        │
│ PostgreSQL             │  │ Pandas                 │
│ SQLAlchemy             │  │ NumPy                  │
│                        │  │ Scikit-learn           │
│                        │  │ Statsmodels / Prophet* │
└────────────────────────┘  └────────────────────────┘
                ▲
                │
                │ MQTT / REST / CSV
                │
┌───────────────┴─────────────────────────────────────┐
│                 DATA SOURCES                        │
│                                                     │
│ Mock Sensor Generator • CSV Dataset • API           │
│ ESP32 + Energy Sensor (optional future extension)   │
└─────────────────────────────────────────────────────┘
```

\* Use one forecasting library for the MVP rather than multiple libraries.

---

# 3. Frontend Stack

## React

**Purpose:** Build the web application and dashboard.

React will handle:

- Admin dashboard
- Room monitoring
- Device monitoring
- Alerts
- Rankings
- Analytics pages
- User interactions

## TypeScript

**Purpose:** Type-safe frontend development.

Use TypeScript instead of plain JavaScript to make the codebase easier to manage as the project grows.

## Tailwind CSS

**Purpose:** Styling the UI.

Use Tailwind CSS for:

- Dashboard layouts
- Responsive design
- Cards
- Tables
- Status indicators
- Buttons
- Navigation

## Component Library — shadcn/ui

**Purpose:** Reusable, polished UI components.

Useful components:

- Cards
- Tables
- Dialogs
- Dropdowns
- Tabs
- Buttons
- Tooltips
- Toast notifications

## Charts — Recharts

**Purpose:** Energy data visualization.

Use for:

- Energy consumption trends
- Device-wise consumption
- Room comparisons
- Historical analysis
- Forecast visualization

Recommended chart types:

```text
Line Chart       → Consumption over time
Bar Chart        → Room/device comparison
Area Chart       → Historical consumption
Donut/Pie Chart  → Device-wise distribution
```

---

# 4. Backend Stack

## Python

**Purpose:** Main backend and data-processing language.

Python is recommended because it works well with:

- APIs
- Data processing
- Anomaly detection
- Forecasting
- Machine learning
- Simulated sensor data

## FastAPI

**Purpose:** Backend API framework.

FastAPI will provide endpoints for:

```text
/dashboard
/rooms
/rooms/{id}
/devices
/alerts
/analytics
/rankings
/recommendations
```

It can also support:

- Data ingestion
- Authentication if required
- WebSocket connections
- API documentation

---

# 5. Database

## PostgreSQL

**Purpose:** Primary database.

Store:

- Rooms
- Devices
- Energy readings
- Consumption history
- Alerts
- Anomalies
- Cost calculations
- Rankings
- Recommendations

Example entities:

```text
rooms
devices
energy_readings
alerts
anomalies
energy_costs
recommendations
```

## SQLAlchemy

**Purpose:** ORM between FastAPI and PostgreSQL.

Benefits:

- Cleaner database code
- Python models
- Easier queries
- Easier migration from prototype to production

## Development Option — SQLite

For a fast local prototype, SQLite can be used initially.

However, the recommended final architecture should use PostgreSQL.

---

# 6. Data Ingestion Layer

This is one of the HACQUIRE modules that can be positioned as a **SELL module**.

# 🔌 Universal Data Ingestion & Normalization Layer

The system should accept data from multiple sources:

```text
ESP32 / IoT Sensor
        │
        ├──── MQTT
        │
Mock Sensor Generator
        │
        ├──── REST API
        │
CSV / Sample Dataset
        │
        └──── File/API Processing
                │
                ▼
      Data Ingestion Layer
                │
                ▼
      Data Validation & Normalization
                │
                ▼
       Standardized Energy Data
                │
                ▼
             Database
```

## Technologies

- Python
- FastAPI
- Pydantic for data validation
- Pandas for CSV/sample data
- MQTT support for IoT devices

Example standardized data:

```json
{
  "timestamp": "2026-08-21T10:30:00",
  "location_id": "ROOM-203",
  "device_id": "AC-01",
  "energy_kwh": 2.4,
  "power_kw": 1.8
}
```

This module can potentially be reused for other domains such as:

- Water monitoring
- Waste tracking
- Air quality
- Traffic monitoring
- Agriculture

---

# 7. IoT / Simulated Data Layer

The PS-07 problem statement allows:

- APIs
- Sample datasets
- Mock sensor layers
- Actual hardware

For the hackathon MVP, the recommended approach is:

# Mock Sensor Generator + Optional ESP32 Extension

## Mock Sensor Generator

Build a Python service that periodically generates realistic energy readings.

Example:

```text
Every 10 seconds

Room 101 → 1.2 kWh
Room 102 → 1.8 kWh
Room 203 → 4.9 kWh
```

The generator can intentionally create:

- Normal consumption
- Peak usage
- Sudden spikes
- Abnormal readings

This allows the anomaly detection system to be demonstrated reliably.

## Optional Future Hardware

If hardware is added:

- ESP32
- Compatible energy/current sensor
- Wi-Fi
- MQTT

The rest of the backend should remain unchanged because the Data Ingestion Layer normalizes all sources.

---

# 8. MQTT

## Recommended Broker

For development:

- Mosquitto

## Python Library

- Paho MQTT

## Purpose

MQTT can carry readings from IoT devices:

```text
ESP32
  ↓
MQTT Broker
  ↓
Python Data Ingestion Service
  ↓
PostgreSQL
  ↓
Dashboard
```

Example topic:

```text
energy/readings
```

Example message:

```json
{
  "room_id": "ROOM-203",
  "device_id": "AC-01",
  "power_kw": 1.8,
  "energy_kwh": 2.4
}
```

For the hackathon MVP, MQTT is optional if you are using only simulated REST/CSV data.

---

# 9. Anomaly Detection

This is the second HACQUIRE **SELL module**.

# 🚨 Plug-and-Play Anomaly Detection Engine

The engine should receive standardized time-series data and return:

```text
Normal
or
Abnormal
```

## Recommended MVP Approach

Use a combination of:

### Rule-Based Threshold Detection

Example:

```text
If current usage > expected threshold
→ Flag abnormal
```

### Statistical Detection

Compare the current value with historical average and deviation.

Example concept:

```text
Current Usage
      ↓
Compare with Historical Pattern
      ↓
Calculate Deviation
      ↓
Normal / Abnormal
```

## Optional ML Upgrade

Use:

- Isolation Forest from scikit-learn

This can identify unusual patterns without requiring complex deep learning.

## Technology

- Python
- Pandas
- NumPy
- Scikit-learn

Output example:

```json
{
  "room_id": "ROOM-203",
  "status": "ABNORMAL",
  "actual_consumption": 38,
  "expected_min": 10,
  "expected_max": 15,
  "deviation_percent": 153
}
```

The module should be designed generically so it can be reused for:

- Water leakage detection
- Machine monitoring
- Traffic anomalies
- Sensor monitoring

---

# 10. Forecasting and Prediction

This is the third HACQUIRE **SELL module**.

# 📈 Forecasting & Prediction Engine

Purpose:

- Predict future energy consumption
- Support bill projection
- Identify future high-consumption periods

Flow:

```text
Historical Energy Data
        ↓
Forecasting Engine
        ↓
Predicted Consumption
        ↓
Projected Bill
```

## Recommended MVP Approach

Start with a simple forecasting method.

Options:

- Moving average
- Linear regression
- Exponential smoothing

For a more advanced version:

- Prophet
- ARIMA

For the hackathon, use the simplest method that produces understandable and reliable output.

## Technology

- Python
- Pandas
- NumPy
- Scikit-learn or Statsmodels

Output:

```json
{
  "current_consumption_kwh": 850,
  "projected_consumption_kwh": 1556,
  "projected_bill": 12450
}
```

---

# 11. Cost Calculation Engine

This can remain a lightweight internal module.

# 💰 Configurable Cost Calculation Engine

Formula:

```text
Energy Consumption (kWh)
            ×
Electricity Rate
            =
Estimated Cost
```

Example:

```text
210 kWh × ₹8/kWh = ₹1,680
```

The electricity rate should be configurable.

## Technology

- Python
- FastAPI
- PostgreSQL

This module provides:

- Room-wise cost
- Device-wise cost
- Total cost
- Period cost
- Input to bill projection

---

# 12. Recommendation Engine

This is a preferred HACQUIRE **BUY module**.

# 🤖 Recommendation Engine

Instead of building a complex recommendation system from scratch, integrate an acquired module if available.

Input:

```text
Consumption Pattern
+
Detected Anomaly
+
Device / Room Information
        ↓
Recommendation Engine
        ↓
Energy-Saving Suggestion
```

Example output:

```text
Room 203 has unusually high energy usage
between 12 AM and 5 AM.

Suggested Action:
Review prolonged AC operation.

Potential Impact:
Reduced energy wastage and lower projected bill.
```

## Integration

The recommendation should appear in:

- Room Detail page
- Alert Detail
- Dashboard insights

The application should integrate this module through an API/interface so the provider can be changed if necessary.

---

# 13. Notification / Alert Service

This is the second preferred HACQUIRE **BUY module**.

# 🔔 Notification / Alert Service

Trigger:

```text
Energy Reading
      ↓
Anomaly Detection
      ↓
Alert Event
      ↓
Notification Service
      ↓
Admin Notification
```

Possible notifications:

- High energy usage
- Sudden consumption spike
- Device consuming above threshold
- Forecasted bill exceeding target

For the MVP, an in-app notification is sufficient.

The external or acquired service can later support:

- Push notifications
- Email
- SMS

---

# 14. Recommendation and Alert Integration

```text
                ENERGY DATA
                     │
                     ▼
             Data Ingestion
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
  Anomaly Detection        Forecasting
          │                     │
          ▼                     ▼
       Alert Event       Bill Projection
          │                     │
          └──────────┬──────────┘
                     ▼
          Recommendation Engine
                     │
                     ▼
                 Admin
```

---

# 15. API Communication

## Frontend → Backend

Use:

- REST API for normal application data
- WebSockets optionally for live updates

Example:

```text
React Dashboard
        ↓
     REST API
        ↓
      FastAPI
        ↓
Business Logic / Database
```

## Live Update Option

```text
Energy Data Updated
        ↓
FastAPI / WebSocket
        ↓
React Dashboard Updates
```

For the MVP, periodic API polling is also acceptable if WebSockets add unnecessary complexity.

---

# 16. Suggested API Endpoints

## Dashboard

```text
GET /dashboard/summary
```

Returns:

- Total consumption
- Current load
- Estimated cost
- Projected bill
- Active alerts
- Data source status

## Energy Readings

```text
POST /energy/readings
GET /energy/readings
```

## Rooms

```text
GET /rooms
GET /rooms/{room_id}
GET /rooms/{room_id}/consumption
```

## Devices

```text
GET /devices
GET /devices/{device_id}
```

## Alerts

```text
GET /alerts
POST /alerts/{alert_id}/resolve
```

## Analytics

```text
GET /analytics/consumption
GET /analytics/device-distribution
GET /analytics/comparison
```

## Rankings

```text
GET /rankings
```

## Recommendations

```text
GET /recommendations
GET /rooms/{room_id}/recommendations
```

---

# 17. Database Schema

## rooms

```text
id
name
location
status
```

## devices

```text
id
name
type
room_id
status
```

## energy_readings

```text
id
timestamp
room_id
device_id
energy_kwh
power_kw
source
```

## anomalies

```text
id
timestamp
room_id
device_id
actual_value
expected_value
deviation_percent
severity
status
```

## alerts

```text
id
anomaly_id
title
message
severity
created_at
status
```

## recommendations

```text
id
room_id
message
potential_saving
created_at
```

---

# 18. Development and Deployment

## Version Control

- Git
- GitHub

## Local Development

- VS Code
- Python virtual environment
- Node.js

## Containers

Optional:

- Docker
- Docker Compose

Docker can run:

```text
Frontend
Backend
PostgreSQL
MQTT Broker
```

For a hackathon MVP, Docker is useful but not mandatory.

## Deployment

Possible deployment split:

### Frontend

- Vercel

### Backend

- Render or Railway

### Database

- Neon PostgreSQL, Supabase PostgreSQL, or another managed PostgreSQL provider

Choose the simplest deployment combination available to the team rather than overengineering the infrastructure.

---

# 19. Complete HACQUIRE Module Strategy

## BUILD IN-HOUSE

These modules form the actual Smart Energy Monitor product:

```text
⚡ Energy Dashboard
🏠 Room-wise Monitoring
🔌 Device-wise Monitoring
💰 Cost Calculation
🏆 Comparative Rankings
🔗 Core User Journey and UI
🗄 Database and Core Backend Integration
```

---

## SELL

These should be designed as reusable, generic modules:

```text
🔌 Universal Data Ingestion & Normalization Layer

🚨 Plug-and-Play Anomaly Detection Engine

📈 Forecasting & Prediction Engine
```

The sellable modules should expose clear interfaces so another team can integrate them with different data types.

---

## BUY

Preferred modules to acquire:

```text
🔔 Notification / Alert Service

🤖 Recommendation Engine
```

The final choice can depend on what high-quality modules are actually available in the HACQUIRE marketplace.

---

# 20. Final Recommended Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Charts | Recharts |
| Backend | Python + FastAPI |
| Data Validation | Pydantic |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Data Processing | Pandas + NumPy |
| Anomaly Detection | Rule-based + Scikit-learn |
| Forecasting | Moving Average / Regression / Statsmodels |
| IoT Communication | MQTT + Paho MQTT |
| MQTT Broker | Mosquitto |
| Mock Data | Python Data Generator |
| API Communication | REST |
| Live Updates | WebSocket optional |
| Version Control | Git + GitHub |
| Deployment | Vercel + Render/Railway |
| Containerization | Docker optional |

---

# 21. Recommended MVP Architecture

For the hackathon, do not build every component at maximum complexity.

Use this practical architecture:

```text
                  REACT FRONTEND
                         │
                         ▼
                    FASTAPI
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    Data Ingestion    Analytics      Database
          │              │              │
          │       ┌──────┴──────┐       │
          ▼       ▼             ▼       ▼
    Mock Data   Anomaly      Forecast PostgreSQL
    / API       Detection    Engine
                     │            │
                     └─────┬──────┘
                           ▼
                    Cost / Bill Logic
                           │
                           ▼
                  Alert + Recommendation
                           │
                           ▼
                     React Dashboard
```

---

# 22. MVP Build Order

The recommended development order is:

## Phase 1 — Foundation

- Set up GitHub repository
- Create React frontend
- Create FastAPI backend
- Set up PostgreSQL or SQLite for early development
- Define standardized energy data model

## Phase 2 — Data

- Create mock sensor/data generator
- Build Data Ingestion Layer
- Store readings in database

## Phase 3 — Core Product

- Build Admin Dashboard
- Build Room-wise monitoring
- Build Device-wise monitoring
- Add charts

## Phase 4 — Intelligence

- Implement anomaly detection
- Implement cost calculation
- Implement bill projection / forecasting

## Phase 5 — HACQUIRE Integration

- Prepare reusable SELL modules
- Integrate acquired Notification Service
- Integrate acquired Recommendation Engine

## Phase 6 — Final Integration

- Connect all APIs
- Add alerts
- Add rankings
- Test end-to-end user flow
- Deploy the MVP

---

# 23. Final Architecture Principle

The system should be modular:

```text
DATA
  ↓
INGEST
  ↓
NORMALIZE
  ↓
STORE
  ↓
ANALYZE
  ↓
DETECT
  ↓
FORECAST
  ↓
ESTIMATE COST
  ↓
ALERT
  ↓
RECOMMEND
  ↓
USER ACTION
```

This architecture directly supports the PS-07 Smart Energy Monitor while also separating reusable HACQUIRE modules from the core product.

# Final Product Flow

**Monitor → Detect → Analyze → Forecast → Estimate → Alert → Recommend → Act**
