# AGENT.md — FINAL TEAM & MULTI-REPOSITORY WORKFLOW
# PS-07 Smart Energy Monitor for Hostels and Homes

> This document is the final operating contract for the 3-person team and any AI coding agent working on the project.
>
> The repository structure and workflow are designed around the required submission format:
>
> 1. One Main App GitHub Repository link
> 2. One to three Standalone GitHub Repository links for tradable features

---

# 1. PROJECT

**Track / ID:** PS-07  
**Problem Title:** Smart Energy Monitor for Hostels and Homes  
**Domain / Focus:** IoT / Energy Efficiency

## Core Product

The Smart Energy Monitor helps hostels, apartments, and small businesses:

- Monitor energy consumption
- Track room-wise usage
- Track device-wise usage
- Detect abnormal consumption
- Estimate electricity costs
- Project future electricity bills
- Provide energy-saving recommendations
- Compare energy efficiency through rankings

## Core Product Flow

```text
Energy Data
    ↓
Main App receives normalized data
    ↓
Store / process data
    ↓
Analyze consumption
    ├── Detect anomalies
    └── Forecast future consumption
    ↓
Estimate projected bill
    ↓
Generate / obtain recommendation
    ↓
Display alerts and insights
    ↓
Admin action
```

---

# 2. REQUIRED GITHUB SUBMISSION STRUCTURE

The project must be organized as separate GitHub repositories.

## Repository 1 — MAIN APPLICATION

```text
smart-energy-monitor-main
```

This repository contains the complete Smart Energy Monitor application.

It includes:

```text
Frontend
Backend
Database integration
Application APIs
Authentication if implemented
Dashboard
Rooms
Devices
Alerts
Rankings
Cost calculation
Bill projection integration
Tradable feature integrations
```

---

## Repository 2 — TRADABLE FEATURE 1

```text
universal-data-ingestion
```

Standalone reusable module for:

```text
Input data
    ↓
Validation
    ↓
Normalization
    ↓
Standardized output
```

---

## Repository 3 — TRADABLE FEATURE 2

```text
anomaly-detection-engine
```

Standalone reusable module for:

```text
Numerical / time-series data
    ↓
Anomaly detection
    ↓
Normal / abnormal result
```

---

## Repository 4 — TRADABLE FEATURE 3

```text
forecasting-prediction-engine
```

Standalone reusable module for:

```text
Historical data
    ↓
Forecasting
    ↓
Predicted future values
```

---

# 3. FINAL SUBMISSION MODEL

The submission should contain separate repository links.

```text
1. MAIN APP

GitHub:
smart-energy-monitor-main


2. TRADABLE FEATURE

GitHub:
universal-data-ingestion


3. TRADABLE FEATURE

GitHub:
anomaly-detection-engine


4. TRADABLE FEATURE

GitHub:
forecasting-prediction-engine
```

If the hackathon only requires one to three tradable features, all three may be submitted.

The main app repository must NOT be the only repository containing these assets.

Each tradable feature must have its own standalone repository.

---

# 4. HIGH-LEVEL ARCHITECTURE

```text
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

The tradable features must remain independently understandable and reusable.

The main application is a consumer of those features.

---

# 5. TEAM OWNERSHIP

There are three team members.

## MEMBER 1 — FRONTEND OWNER

### Owns

Main repository:

```text
smart-energy-monitor-main/frontend
```

### Responsibilities

- React
- TypeScript
- Tailwind CSS
- UI components
- Dashboard
- Analytics
- Rooms
- Room detail
- Devices
- Alerts
- Rankings
- API client
- Loading/error states
- Charts
- Responsive design

### Member 1 MUST NOT

- Implement anomaly detection algorithms
- Implement forecasting algorithms
- Build the standalone tradable repositories
- Modify backend business logic
- Change API contracts without team agreement

Member 1 consumes the API contract.

---

## MEMBER 2 — BACKEND & INTEGRATION OWNER

### Owns

Main repository:

```text
smart-energy-monitor-main/backend
```

### Responsibilities

- FastAPI
- Database
- SQLAlchemy
- Pydantic schemas
- API endpoints
- Data persistence
- Cost calculation
- Bill projection calculation
- Integrating standalone tradable features
- Integrating BUY/acquired modules
- API documentation

### Member 2 MUST NOT

- Build React pages
- Modify frontend styling
- Develop the core source code of standalone tradable repositories
- Duplicate anomaly or forecasting algorithms inside backend routes

Member 2 acts as the integration layer between the main product and the standalone assets.

---

## MEMBER 3 — TRADABLE FEATURES OWNER

### Owns the three standalone repositories

```text
universal-data-ingestion
anomaly-detection-engine
forecasting-prediction-engine
```

### Responsibilities

- Create and maintain standalone tradable repositories
- Build reusable module interfaces
- Add tests
- Add examples
- Write documentation
- Keep modules independent from the main application

### Member 3 MUST NOT

- Build the React application
- Modify backend API routes
- Depend directly on the main app database models
- Hardcode Smart Energy Monitor-specific assumptions into reusable assets

---

# 6. MAIN APP REPOSITORY STRUCTURE

Repository:

```text
smart-energy-monitor-main/
```

Structure:

```text
smart-energy-monitor-main/
│
├── frontend/                       # MEMBER 1
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   └── package.json
│
├── backend/                        # MEMBER 2
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── integrations/
│   │   └── database/
│   └── requirements.txt
│
├── contracts/                      # SHARED BY AGREEMENT
│   ├── api-contract.md
│   ├── energy-reading.schema.json
│   └── examples/
│
├── docs/                           # SHARED
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── TECH_STACK.md
│   └── ARCHITECTURE.md
│
├── AGENT.md
├── README.md
└── docker-compose.yml
```

## Critical Rule

The main repository must NOT contain full duplicate source copies of:

```text
universal-data-ingestion
anomaly-detection-engine
forecasting-prediction-engine
```

Those source implementations belong in their respective standalone repositories.

The main application only contains integration adapters/wrappers if required.

---

# 7. TRADABLE FEATURE REPOSITORY STANDARD

Every tradable feature repository must follow a clean standalone structure.

## Required Structure

```text
repository-name/
│
├── src/
├── tests/
├── examples/
├── README.md
├── requirements.txt
├── module-manifest.json
├── LICENSE
└── .gitignore
```

Each repository must be independently understandable.

A judge should be able to open the repository and quickly understand:

1. What the feature does.
2. What problem it solves.
3. What input it accepts.
4. What output it produces.
5. How to run it.
6. How another project can integrate it.
7. Example usage.
8. Test coverage or verification.

---

# 8. TRADABLE FEATURE 1

# 🔌 Universal Data Ingestion & Normalization

Repository:

```text
universal-data-ingestion
```

## Purpose

Accept data from multiple sources and convert it into a common structure.

### Possible Inputs

```text
CSV
JSON
REST/API data
Mock data
Future MQTT/IoT data
```

### Example Generic Input

```json
{
  "timestamp": "2026-08-21T10:30:00Z",
  "location": "ROOM-203",
  "device": "AC-01",
  "value": 2.4,
  "unit": "kWh"
}
```

### Example Standardized Output

```json
{
  "timestamp": "2026-08-21T10:30:00Z",
  "entity_id": "ROOM-203",
  "source_id": "AC-01",
  "value": 2.4,
  "unit": "kWh",
  "source_type": "mock"
}
```

## Reusability

The module should not be limited to energy.

Possible reuse:

- Water monitoring
- Air quality
- Waste tracking
- Agriculture
- Traffic sensors

## Main App Integration

The Smart Energy Monitor uses the standardized output produced by this repository.

---

# 9. TRADABLE FEATURE 2

# 🚨 Anomaly Detection Engine

Repository:

```text
anomaly-detection-engine
```

## Purpose

Identify unusual patterns in numerical or time-series data.

### Generic Input

```json
[
  {
    "timestamp": "2026-08-21T10:00:00Z",
    "value": 12.5
  },
  {
    "timestamp": "2026-08-21T11:00:00Z",
    "value": 38.0
  }
]
```

### Generic Output

```json
{
  "status": "ABNORMAL",
  "actual_value": 38.0,
  "expected_min": 10.0,
  "expected_max": 15.0,
  "deviation_percent": 153.0,
  "severity": "HIGH"
}
```

## Implementation

Recommended MVP:

- Rule-based thresholds
- Statistical deviation
- Optional Isolation Forest

Do not overcomplicate the hackathon MVP.

## Reusability

Possible use cases:

- Water leakage
- Machine monitoring
- Sensor anomalies
- Traffic anomalies
- Other numerical monitoring systems

## Main App Integration

The Smart Energy Monitor sends historical/current energy readings and receives anomaly results.

---

# 10. TRADABLE FEATURE 3

# 📈 Forecasting & Prediction Engine

Repository:

```text
forecasting-prediction-engine
```

## Purpose

Predict future values from historical data.

### Generic Input

```json
[
  {
    "timestamp": "2026-08-20T10:00:00Z",
    "value": 120.0
  },
  {
    "timestamp": "2026-08-21T10:00:00Z",
    "value": 135.0
  }
]
```

### Generic Output

```json
{
  "predicted_values": [
    {
      "timestamp": "2026-08-22T10:00:00Z",
      "value": 142.0
    }
  ],
  "method": "moving_average"
}
```

## Implementation

Recommended MVP options:

- Moving average
- Linear regression
- Exponential smoothing

Use the simplest reliable approach first.

## Reusability

Possible applications:

- Energy demand
- Water consumption
- Sales forecasting
- Waste generation
- Traffic volume

## Main App Integration

The Smart Energy Monitor uses predicted energy consumption to calculate:

```text
Projected Consumption
        ↓
Configured Electricity Rate
        ↓
Projected Bill
```

---

# 11. HOW THE MAIN APP INTEGRATES TRADABLE FEATURES

The main application should consume the standalone repositories through clean interfaces.

Preferred architecture:

```text
Standalone Repository
        ↓
Published / installable package
        OR
Service/API interface
        ↓
Main App Integration Layer
        ↓
FastAPI Services
        ↓
Application APIs
        ↓
React Frontend
```

For the hackathon, choose one integration method and use it consistently.

## Option A — Python Package Integration

The standalone feature exposes:

```python
from anomaly_detection_engine import detect_anomalies
```

The main backend installs the module as a dependency.

## Option B — API/Service Integration

The standalone feature runs independently and exposes an API.

The main backend calls:

```text
Main Backend
    ↓ HTTP
Standalone Feature Service
    ↓
Result
```

## Recommendation

For the hackathon, use **Python package integration** unless separate services are specifically needed.

It is simpler to demonstrate while still maintaining separate GitHub repositories.

---

# 12. SHARED DATA AND API CONTRACTS

The main application requires agreed contracts.

## Standard Energy Reading

```json
{
  "timestamp": "2026-08-21T10:30:00Z",
  "room_id": "ROOM-203",
  "device_id": "AC-01",
  "energy_kwh": 2.4,
  "power_kw": 1.8,
  "source": "mock"
}
```

## Rules

- No member changes field names independently.
- No tradable repository depends on a database model.
- Standalone modules should accept generic data structures.
- The backend converts application-specific data into the generic structures required by the tradable modules.
- The backend converts module results into application API responses.

---

# 13. API CONTRACT

## Dashboard

```text
GET /api/v1/dashboard/summary
```

Example:

```json
{
  "total_consumption_kwh": 850.0,
  "current_load_kw": 42.6,
  "estimated_cost": 6840.0,
  "projected_bill": 12450.0,
  "active_alerts": 3
}
```

---

## Rooms

```text
GET /api/v1/rooms

GET /api/v1/rooms/{room_id}
```

---

## Devices

```text
GET /api/v1/devices

GET /api/v1/devices/{device_id}
```

---

## Alerts

```text
GET /api/v1/alerts

POST /api/v1/alerts/{alert_id}/resolve
```

---

## Rankings

```text
GET /api/v1/rankings
```

---

## Recommendations

```text
GET /api/v1/recommendations
```

---

# 14. BUY / ACQUIRED FEATURES

The following are potential external/acquired modules:

## 🔔 Notification / Alert Service

The main backend integrates the selected/acquired module.

**Integration Owner:** Member 2

## 🤖 Recommendation Engine

The main backend integrates the selected/acquired module.

**Integration Owner:** Member 2

Member 1 displays their results.

Member 3 does not duplicate these acquired features unless the team explicitly decides not to acquire them.

---

# 15. PARALLEL DEVELOPMENT WORKFLOW

All three members must work in parallel.

```text
                  SHARED CONTRACT
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      MEMBER 1       MEMBER 2       MEMBER 3
      FRONTEND        BACKEND      3 STANDALONE
                                      ASSETS
          │              │              │
          │              │              │
      Mock APIs       Mock Results   Independent Tests
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                    INTEGRATION
```

## Member 1

Uses mock JSON responses matching the agreed API contract.

## Member 2

Builds API endpoints and database logic using temporary/mock outputs when tradable modules are unfinished.

## Member 3

Builds and tests each standalone repository independently.

No team member should wait unnecessarily for another member.

---

# 16. DEVELOPMENT PHASES

## PHASE 0 — CONTRACT FREEZE

All members agree on:

- Repository names
- Folder structures
- Data structures
- API responses
- Naming conventions
- Integration interfaces

Do not begin major integration before this is defined.

---

## PHASE 1 — PARALLEL FOUNDATION

### Member 1

- Setup React + TypeScript
- Setup Tailwind
- Build application shell
- Sidebar
- Routing
- Dashboard UI with mocks

### Member 2

- Setup FastAPI
- Setup database
- Create schemas
- Create models
- Create API skeleton

### Member 3

Create all three repositories:

```text
universal-data-ingestion
anomaly-detection-engine
forecasting-prediction-engine
```

For each:

- Setup repository
- Add README
- Add source structure
- Define input/output interface
- Add examples
- Add tests

---

## PHASE 2 — CORE DEVELOPMENT

### Member 1

Build:

- Dashboard
- Rooms
- Room detail
- Devices
- Alerts
- Rankings
- Analytics

### Member 2

Build:

- Database persistence
- Dashboard APIs
- Room APIs
- Device APIs
- Alert APIs
- Cost calculation
- Integration adapter layer

### Member 3

Complete:

- Data normalization feature
- Anomaly detection feature
- Forecasting feature
- Independent tests and examples

---

## PHASE 3 — INTEGRATION

Integration direction:

```text
Standalone GitHub Repositories
             ↓
Main App Integration Layer
             ↓
FastAPI Backend
             ↓
REST API
             ↓
React Frontend
```

### Step 1

Member 3 provides stable release/version of each tradable repository.

### Step 2

Member 2 integrates the required repository versions.

### Step 3

Member 2 verifies API output against shared contracts.

### Step 4

Member 1 replaces mock data with real API calls.

### Step 5

Team tests the complete flow.

---

# 17. STRICT NO-OVERLAP RULES

## Member 1

Must not edit:

```text
backend/
standalone tradable repositories
```

except by explicit agreement.

## Member 2

Must not edit:

```text
frontend/
core source code of standalone tradable repositories
```

except by explicit agreement.

## Member 3

Must not edit:

```text
frontend/
backend/
```

except for integration documentation or explicit agreement.

## All Members

Must not:

- Change contracts silently
- Duplicate another member's feature
- Copy standalone asset source into backend routes
- Put business logic into React components
- Hardcode application-specific assumptions into reusable assets
- Wait for unfinished dependencies when mocks can be used

---

# 18. AGENT OPERATING INSTRUCTIONS

Every AI coding agent must:

1. Read this `AGENT.md` first.
2. Identify which repository and member role it is working for.
3. Modify only files owned by that role.
4. Never create a tradable feature only as a folder inside the main repository.
5. Maintain the standalone nature of every tradable repository.
6. Read shared contracts before changing data structures.
7. Use mocks when another repository is unfinished.
8. Do not duplicate logic from another repository.
9. Add tests for logic it implements.
10. Update README/documentation for public reusable modules.
11. Report:
   - Repository modified
   - Files changed
   - Contracts affected
   - Tests run
   - Integration requirements

---

# 19. DEFINITION OF DONE

## Main App Feature

A feature is complete when:

- UI/API works
- Contract is respected
- Relevant tests pass
- Loading/error handling exists where applicable
- No standalone asset logic has been duplicated

## Tradable Feature

A tradable feature is complete only when:

- It has its own GitHub repository.
- It has independent source code.
- It has a dedicated README.
- It explains its problem and purpose.
- Input/output interfaces are documented.
- Example usage exists.
- Tests exist.
- Dependencies are documented.
- It can run without the Smart Energy Monitor.
- Another project could theoretically reuse it.
- The Smart Energy Monitor demonstrates integration with it.

---

# 20. FINAL HACQUIRE / TRADABLE FEATURE CHECKLIST

Before submission:

## Main Application

- [ ] Separate GitHub repository exists
- [ ] Complete application runs
- [ ] Tradable features are integrated
- [ ] Main README explains architecture
- [ ] Main repository does not pretend internal folders are separate GitHub assets

## Tradable Feature 1

- [ ] Separate GitHub repository
- [ ] Independent README
- [ ] Source code
- [ ] Tests
- [ ] Examples
- [ ] Documented input/output
- [ ] Main app integration demonstrated

## Tradable Feature 2

- [ ] Separate GitHub repository
- [ ] Independent README
- [ ] Source code
- [ ] Tests
- [ ] Examples
- [ ] Documented input/output
- [ ] Main app integration demonstrated

## Tradable Feature 3

- [ ] Separate GitHub repository
- [ ] Independent README
- [ ] Source code
- [ ] Tests
- [ ] Examples
- [ ] Documented input/output
- [ ] Main app integration demonstrated

---

# 21. FINAL REPOSITORY MAP

```text
TEAM GITHUB
│
├── smart-energy-monitor-main
│   │
│   ├── frontend                 ← MEMBER 1
│   ├── backend                  ← MEMBER 2
│   └── contracts                ← SHARED
│
├── universal-data-ingestion     ← MEMBER 3
│
├── anomaly-detection-engine     ← MEMBER 3
│
└── forecasting-prediction-engine ← MEMBER 3
```

---

# FINAL PRINCIPLE

## ONE MAIN PRODUCT + THREE INDEPENDENT TRADABLE FEATURES

```text
TRADABLE REPOSITORIES
        │
        │  Reusable independently
        ▼
MAIN APPLICATION
        │
        ▼
Complete Smart Energy Monitoring Product
```

The final dependency direction is:

# Standalone Features → Backend Integration → API → Frontend

The team develops in parallel using agreed contracts, and each tradable feature remains independently reusable and independently represented by its own GitHub repository.
