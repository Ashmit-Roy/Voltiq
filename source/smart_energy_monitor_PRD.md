# Product Requirements Document (PRD)

# Smart Energy Monitor for Hostels and Homes

**Hackathon:** HACQUIRE 2026  
**Product Type:** Smart Energy Monitoring and Energy Intelligence Platform  
**Status:** MVP / Hackathon Build

---

## 1. Product Overview

Smart Energy Monitor is a software platform designed to help hostels, homes, apartments, and small facilities understand how electricity is being consumed.

The platform collects or simulates energy data, monitors consumption at room and device level, detects unusual usage patterns, estimates electricity costs, and helps administrators identify potential energy wastage.

The core product is designed to work independently. During HACQUIRE's live market phase, the team will acquire at least one external modular feature and integrate it into the product.

### Product Vision

Transform raw energy readings into actionable insights that help users answer:

- Where is energy being consumed?
- Which room or device is consuming the most energy?
- Is the current usage abnormal?
- What is the estimated electricity cost?
- Where is energy potentially being wasted?

---

## 2. Problem Statement

Electricity users often receive only an overall consumption value or final bill. They lack detailed visibility into where and why energy is being consumed.

For hostels and multi-room facilities, this makes it difficult to:

- Track room-wise energy consumption.
- Compare consumption across rooms or devices.
- Identify abnormal spikes.
- Estimate future electricity costs.
- Detect possible energy wastage.
- Take timely action based on consumption data.

Smart Energy Monitor addresses this by creating a centralized energy intelligence dashboard.

---

## 3. Target Users

### Primary User: Hostel / Facility Administrator

The administrator needs a high-level view of total energy consumption and the ability to investigate individual rooms or devices.

### Secondary User: Home / Small Facility User

The user needs a simple way to understand consumption, estimated cost, and unusual usage.

---

## 4. Goals

### Primary Goals

1. Provide a centralized dashboard for energy monitoring.
2. Track energy consumption by room and/or device.
3. Detect abnormal energy usage.
4. Estimate current and projected electricity costs.
5. Identify possible energy-saving opportunities.
6. Demonstrate a modular architecture suitable for HACQUIRE trading and integration.

### Success Criteria

The MVP is successful if a user can:

- View overall energy consumption.
- Drill down into room/device-level consumption.
- Identify a simulated or real abnormal usage event.
- View cost and bill projections.
- Follow an energy-saving workflow.
- See at least one acquired module integrated into the final user journey.

---

## 5. Non-Goals

The MVP will not require:

- Deployment of real smart meters in every room.
- Direct control of physical electrical appliances.
- Production-grade billing integration.
- Perfect prediction accuracy.
- A complete commercial utility-management system.

Energy data may be generated through simulated IoT readings, APIs, datasets, or mock data.

---

## 6. Core User Journey

1. Energy readings enter the system through the ingestion layer.
2. The system stores and processes the readings.
3. The dashboard displays overall, room-wise, and device-wise consumption.
4. The analytics layer identifies abnormal consumption.
5. The cost engine estimates current and projected costs.
6. The system highlights potential energy-saving opportunities.
7. An acquired external module enhances the workflow during the HACQUIRE integration sprint.

### Example

High energy consumption in Room 203
→ system detects unusual usage
→ administrator opens room details
→ consumption and cost impact are displayed
→ acquired module adds an additional action or intelligence layer
→ administrator receives a clearer next step.

---

## 7. Functional Requirements

### FR-1: Energy Data Ingestion

The system shall accept energy readings from one or more of:

- Simulated IoT sensors.
- JSON/API input.
- CSV or dataset input.
- Mock real-time generators.

Each reading should support, where applicable:

- Timestamp
- Location / room ID
- Device ID or device type
- Power or consumption value
- Source identifier

### FR-2: Energy Dashboard

The dashboard shall display:

- Total energy consumption.
- Current consumption trends.
- Estimated current cost.
- Projected bill.
- Number of abnormal usage events.
- Highest-consuming rooms or devices.

### FR-3: Room Monitoring

The administrator shall be able to:

- View a list of rooms.
- Compare room-wise consumption.
- Open a room for detailed information.
- Identify rooms with unusually high consumption.

### FR-4: Device Monitoring

The system shall support device-level consumption where data is available.

Example device categories:

- Air conditioner
- Fan
- Light
- Computer
- Other appliances

### FR-5: Abnormal Usage Detection

The system shall identify energy readings that significantly deviate from expected or historical patterns.

The MVP may use:

- Threshold-based detection.
- Moving average.
- Z-score.
- Isolation Forest or another suitable anomaly-detection method.

Output should include:

- Anomaly status.
- Severity.
- Expected value or baseline.
- Actual value.
- Timestamp.
- Associated room/device where available.

### FR-6: Cost Estimation and Projection

The system shall:

- Calculate estimated electricity cost based on configurable rates.
- Display current accumulated cost.
- Project a potential end-of-period bill based on current usage trends.

### FR-7: Energy-Saving Workflow

The product shall convert detected patterns into actionable information.

Example:

- High consumption is detected.
- The user investigates the affected room/device.
- The system displays consumption and cost impact.
- The user receives an energy-saving action or next step.

### FR-8: Admin Rankings and Comparison

The dashboard shall provide comparative views such as:

- Highest-consuming rooms.
- Lowest-consuming / most efficient rooms.
- Consumption rankings.

Rankings are intended to improve visibility and encourage energy-saving behavior.

---

## 8. HACQUIRE Modular Asset Strategy

The project architecture must separate the main application from tradable assets.

### SELL #1 — Universal Data Ingestion & Normalization Layer

**Purpose:** Accept data from multiple sources and convert it into a standard format.

**Potential Inputs:**

- JSON
- API payloads
- CSV files
- Simulated sensor data

**Standardized Output Example:**

```json
{
  "source_id": "sensor_101",
  "timestamp": "2026-08-21T10:30:00Z",
  "metric": "energy_consumption",
  "value": 12.4,
  "unit": "kWh"
}
```

**Cross-domain Use Cases:**

- IoT
- Healthcare monitoring
- Traffic monitoring
- Agriculture
- Pollution monitoring
- Resource tracking

---

### SELL #2 — Plug-and-Play Anomaly Detection Engine

**Purpose:** Detect unusual patterns in numerical or time-series data.

**Input Example:**

```json
{
  "metric": "consumption",
  "values": [10, 12, 11, 13, 45]
}
```

**Output Example:**

```json
{
  "anomaly_detected": true,
  "actual_value": 45,
  "expected_range": [10, 15],
  "severity": "HIGH"
}
```

**Cross-domain Use Cases:**

- Energy monitoring
- Water monitoring
- Healthcare
- Manufacturing
- Traffic
- Environmental monitoring

---

### SELL #3 — Forecasting & Prediction Engine

**Purpose:** Use historical numerical/time-series data to generate future estimates.

**Potential Outputs:**

- Next-period value.
- Trend direction.
- Short-term forecast.
- Confidence or forecast metadata where supported.

**Cross-domain Use Cases:**

- Energy consumption
- Sales
- Inventory
- Traffic
- Water demand
- Pollution levels

---

## 9. BUY Strategy

The team must execute at least one purchase during the live HACQUIRE trading window.

### Primary Target

🔔 **Notification / Alert Service**

The preferred purchased module should accept events from the Smart Energy Monitor and generate an external or in-app alert.

Example:

```text
Anomaly detected
→ event generated by Smart Energy Monitor
→ acquired notification service
→ alert delivered to administrator
```

### Secondary Target

🤖 **Recommendation Engine**

If a suitable notification module is unavailable, acquire a recommendation engine capable of consuming structured data and returning actionable suggestions.

### Market Flexibility

If neither target is available or technically suitable, the team may acquire another high-quality cross-domain module that:

1. Clearly improves the Smart Energy Monitor.
2. Has a clean integration interface.
3. Can be integrated within the 90-minute sprint.
4. Creates a demonstrable improvement in the final user journey.

---

## 10. Build In-House

The following will remain part of the main product and will not be listed as the primary tradable assets:

- Energy dashboard.
- Room monitoring.
- Device monitoring.
- Admin rankings.
- Energy-saving workflow.
- Core user journey.
- Main application orchestration.
- Data storage and product-specific business logic.

---

## 11. Proposed Architecture

```text
                 DATA SOURCES
        ┌────────────┼────────────┐
        │            │            │
   Mock IoT       API/JSON       CSV
        │            │            │
        └────────────┼────────────┘
                     ▼
       SELLABLE: Data Ingestion Layer
                     ▼
                Data Storage
                     ▼
             Core Energy Platform
        ┌────────────┼──────────────┐
        │            │              │
   Dashboard    Room/Device      Rankings
   Monitoring    Monitoring
        │            │              │
        └────────────┼──────────────┘
                     ▼
       SELLABLE: Anomaly Detection
                     ▼
       SELLABLE: Forecasting Engine
                     ▼
            Energy-Saving Workflow
                     ▼
           ACQUIRED MARKET MODULE
                     ▼
               Final User Action
```

---

## 12. Integration Requirements

All sellable modules must be independently usable.

Each module should include:

- Clear README.
- Setup instructions.
- Input/output specification.
- API or function documentation.
- Example usage.
- Environment configuration where needed.
- Minimal dependencies.
- Test/example data.

Recommended repository organization:

```text
smart-energy-monitor/
├── app/
├── backend/
├── frontend/
└── README.md

tradable-assets/
├── data-ingestion-layer/
│   ├── README.md
│   ├── src/
│   └── example/
│
├── anomaly-detection-engine/
│   ├── README.md
│   ├── src/
│   └── example/
│
└── forecasting-engine/
    ├── README.md
    ├── src/
    └── example/
```

For HACQUIRE submission, each listed asset should be separable and submitted through its own repository, branch, or other permitted standalone GitHub link.

---

## 13. Recommended Tech Stack

### Frontend

- React or Streamlit

### Backend

- Python with FastAPI or Flask

### Data Processing

- Pandas
- NumPy

### Analytics / ML

- Scikit-learn
- Simple statistical methods
- Time-series forecasting approach appropriate to available data

### Database

- SQLite for hackathon MVP
- PostgreSQL if a multi-user or larger setup is needed

### Real-Time / IoT Simulation

- MQTT with Paho MQTT, or
- REST/WebSocket-based simulation

The final stack may be simplified based on team expertise and integration speed.

---

## 14. Data Model

### EnergyReading

```text
id
timestamp
room_id
device_id
device_type
power_watts
energy_kwh
source
```

### Room

```text
room_id
room_name
floor
status
```

### AnomalyEvent

```text
event_id
timestamp
metric
room_id
device_id
actual_value
expected_value
severity
status
```

### CostProjection

```text
period
consumption_kwh
rate
current_cost
projected_cost
```

---

## 15. MVP Prioritization

### Must Have

- Simulated/mock energy data.
- Energy dashboard.
- Room-wise monitoring.
- Device-wise monitoring where possible.
- Abnormal usage detection.
- Cost estimation.
- At least one energy-saving workflow.
- At least one market purchase and successful integration.

### Should Have

- Bill projection.
- Admin rankings.
- Real-time updates.
- Forecasting visualization.

### Nice to Have

- Advanced ML forecasting.
- External notifications.
- AI-generated recommendations.
- Occupancy awareness.
- Real IoT hardware integration.

---

## 16. HACQUIRE Demo Scenario

The final demo should follow one clear story.

### Scenario

1. The dashboard receives energy data.
2. Room 203 begins consuming unusually high energy.
3. The anomaly detection engine identifies the abnormal pattern.
4. The administrator opens Room 203.
5. The dashboard shows consumption history and estimated cost impact.
6. The acquired module is triggered or used.
7. The system presents an additional alert, recommendation, or action.
8. The final outcome demonstrates how the integrated system helps identify and reduce potential energy wastage.

---

## 17. HACQUIRE Pitch Mapping

### Slide 1 — What We Built

- Smart Energy Monitor overview.
- Target problem.
- System architecture.
- Core modules built in-house.

### Slide 2 — What We Traded

**Listed for sale:**

- Universal Data Ingestion & Normalization Layer.
- Plug-and-Play Anomaly Detection Engine.
- Forecasting & Prediction Engine.

**Acquired:**

- Notification/Alert Service, Recommendation Engine, or the actual module purchased during the live market.

### Slide 3 — What We Integrated

Demonstrate:

```text
Energy Event
→ Core Energy Analytics
→ Acquired Module
→ Final User Action
```

The demo must clearly prove that the acquired module is integrated into the final product.

---

## 18. Key Risks and Mitigation

### Risk: No suitable module is available to buy

**Mitigation:** Prepare a ranked list of acceptable module categories and evaluate the live market for compatibility.

### Risk: Purchased module is difficult to integrate

**Mitigation:** Prefer modules with documented APIs, minimal dependencies, and simple input/output contracts.

### Risk: 90-minute integration sprint is insufficient

**Mitigation:** Design the core application with a modular integration point before the trading event.

### Risk: Tradable assets are too tightly coupled to the main application

**Mitigation:** Build and test each sellable asset independently with sample input/output before repository lock.

---

## 19. Definition of Done

The Smart Energy Monitor MVP is considered complete when:

- The main application runs successfully.
- Simulated or real energy data is displayed.
- Room/device consumption can be explored.
- At least one abnormal usage event is detected.
- Cost estimation is visible.
- The energy-saving workflow is demonstrated.
- Tradable modules are independently documented and functional.
- At least one official HACQUIRE purchase is completed.
- The purchased module is integrated into the final repository.
- The final demo presents a complete end-to-end user journey.
