# PS-07 Smart Energy Monitor — PRD-Aligned UI/UX Design Document

## 1. Project Information

**Track / ID:** PS-07  
**Problem Title:** Smart Energy Monitor for Hostels and Homes  
**Domain / Focus:** IoT / Energy Efficiency

---

# 2. Design Document Purpose

This document defines the UI/UX design for the **Smart Energy Monitor for Hostels and Homes**.

The design is based directly on the project requirements and focuses on helping:

- Hostels
- Apartments
- Small businesses

monitor electricity usage, identify unusual consumption, understand electricity costs, and encourage energy-saving behavior.

The interface follows a modern SaaS analytics dashboard style, while the functionality remains strictly aligned with the project requirements.

---

# 3. PRD / Problem Requirement Mapping

The product design must support the following requirements:

| Requirement | UI/UX Implementation |
|---|---|
| Real-time or simulated energy dashboard | Main Admin Energy Dashboard |
| Room-wise consumption tracking | Room-wise monitoring section |
| Device-wise consumption tracking | Device-wise monitoring section |
| Abnormal-usage detection | Anomaly alerts and abnormal usage cards |
| Cost estimation | Current and period-wise cost estimates |
| Bill projection | Projected bill based on current consumption |
| Energy-saving recommendations | Recommendation / action cards |
| Admin dashboard | Main administrative dashboard |
| Comparative rankings | Energy efficiency rankings |
| Hardware simulation through APIs, sample datasets, or mock sensor layer | Data source / connection status indicator |

---

# 4. Product Design Goal

The design should allow an administrator to follow this journey:

```text
Monitor Energy Usage
        ↓
Identify High Consumption
        ↓
Detect Abnormal Usage
        ↓
Understand Cost and Bill Projection
        ↓
Receive Energy-Saving Recommendation
        ↓
Take Corrective Action
        ↓
Compare Energy Efficiency
```

Every major screen should support one or more parts of this journey.

---

# 5. Primary User

## Administrator

The primary user is an administrator responsible for monitoring energy consumption across:

- Hostel rooms
- Apartments
- Small business areas
- Devices or appliance categories

The administrator should be able to quickly identify:

- Total consumption
- Current load
- High-consuming rooms
- High-consuming devices
- Unusual consumption
- Estimated cost
- Projected bill
- Areas requiring action

---

# 6. Overall Application Structure

Only the core navigation required for the project is included.

```text
⚡ EnergiQ

▣ Dashboard
◈ Energy Analytics
⌂ Rooms
▤ Devices
⚠ Alerts
🏆 Rankings

──────────────

⚙ Settings
```

The interface should use a persistent sidebar on desktop and a collapsible navigation system on smaller screens.

---

# 7. Main Admin Energy Dashboard

This is the primary screen of the system.

## Header

**Admin Energy Overview**

Monitor electricity consumption and identify areas requiring attention.

### Data Source Status

The dashboard should clearly show the monitoring source.

Example:

```text
🟢 Data Connected

Source: Simulated IoT Sensor Layer
Last Updated: Just now
```

The source can represent:

- Mock sensor data
- Sample dataset
- API-based simulated data
- Actual IoT sensor data if available

This makes the hardware simulation or data ingestion layer visible in the final product.

---

## 7.1 Primary KPI Cards

The dashboard contains the following core metrics.

### ⚡ Total Energy Consumption

```text
850 kWh

Current monitoring period
↑ 8.4% compared with previous period
```

### 🔋 Current Load

```text
42.6 kW

Current energy demand
```

### 💰 Estimated Cost

```text
₹6,840

Current billing period
```

### 📅 Projected Bill

```text
₹12,450

Projected based on current consumption trend
```

### 🚨 Active Alerts

```text
03

2 require immediate attention
```

These metrics directly support energy monitoring, cost estimation, bill projection, and abnormal usage detection.

---

# 8. Energy Consumption Trend

## Section Title

**Energy Consumption**

Track electricity usage over time.

Controls:

```text
[ Daily ] [ Weekly ] [ Monthly ]
```

The visualization should display:

- Consumption over time
- Peaks in energy usage
- Changes in consumption patterns

Example tooltip:

```text
12:00 PM

Energy Consumption: 48.2 kWh
Estimated Cost: ₹385
```

The chart should help the administrator identify when energy consumption increases.

---

# 9. Energy Consumption by Device

## Section Title

**Device-wise Energy Usage**

Use a donut or bar chart to show the contribution of each device category.

Example:

```text
AC          48%
Computers   22%
Lighting    16%
Fans        10%
Other        4%
```

This directly supports the requirement for device-wise consumption tracking.

---

# 10. Room-wise Energy Monitoring

The administrator should be able to compare room-level consumption.

## Section Title

**Room Energy Overview**

Controls:

```text
[ Search Room 🔍 ]   [ Filter ▾ ]
```

| Room | Consumption | Estimated Cost | Trend | Status |
|---|---:|---:|---|---|
| Room 203 | 210 kWh | ₹1,680 | ↑ 24% | High |
| Room 105 | 165 kWh | ₹1,320 | ↑ 8% | Normal |
| Room 101 | 95 kWh | ₹760 | ↓ 12% | Efficient |
| Room 204 | 88 kWh | ₹704 | ↓ 5% | Efficient |

## Status Types

- High Consumption
- Normal
- Efficient
- Abnormal Usage

This directly supports room-wise consumption tracking and comparative monitoring.

---

# 11. Room Detail View

When the administrator selects a room, the system should provide a detailed view.

## Header

```text
← Back to Rooms

Room 203

Monitoring Status: Active
```

## Key Metrics

```text
Total Consumption
210 kWh

Estimated Cost
₹1,680

Projected Period Cost
₹2,450
```

## Consumption History

Display a detailed chart showing energy usage across the selected time period.

The administrator should be able to identify:

- Normal usage
- Peak usage
- Sudden increases
- Consumption patterns

---

# 12. Abnormal Usage Detection

This is a core project feature.

When consumption exceeds the expected range or shows an unusual pattern, display an anomaly.

## Example Anomaly Card

```text
⚠ Abnormal Energy Usage Detected

Room: Room 203

Current Consumption
38 kWh

Expected Range
10–15 kWh

Deviation
+153%

Status: Requires Attention

[ View Consumption Details ]
```

The anomaly card should clearly distinguish:

- Actual consumption
- Expected consumption
- Amount of deviation
- Severity or attention level

---

# 13. Device-wise Monitoring

The Devices section provides detailed monitoring for device categories.

Example:

```text
Air Conditioner

Consumption: 420 kWh
Estimated Cost: ₹3,360

48% of total energy usage

Status: High Consumption

[ View Details ]
```

Other device categories can include:

- Fans
- Lighting
- Computers
- Other monitored appliances

This screen should allow comparison of devices based on:

- Energy consumption
- Cost
- Contribution to total consumption
- Consumption trend

---

# 14. Cost Estimation and Bill Projection

Cost information should be visible throughout the system.

## Cost Estimation

For each monitoring unit, display:

```text
Energy Consumed
×
Configured Electricity Rate
=
Estimated Cost
```

Example:

```text
210 kWh × ₹8/kWh = ₹1,680
```

## Bill Projection

The dashboard should project the expected bill using the current consumption trend.

Example:

```text
Current Period Usage: 850 kWh

Projected End-of-Period Usage: 1,556 kWh

Projected Bill: ₹12,450
```

The UI should clearly label projected values as estimates.

---

# 15. Energy-Saving Recommendations

The system should provide actionable suggestions when consumption patterns indicate potential wastage.

## Recommendation Card

```text
💡 Energy-Saving Recommendation

Room 203 shows increased consumption
between 12 AM and 5 AM.

Suggested Action

Check prolonged AC operation during
late-night hours.

Potential Impact

Reduce estimated monthly energy cost.
```

Recommendations should be connected to actual observed consumption or anomalies whenever possible.

---

# 16. Alerts Screen

The Alerts section collects all abnormal or important energy events.

## Filters

```text
[ All ] [ High ] [ Medium ] [ Resolved ]
```

## Alert Example

```text
🚨 High Energy Consumption

Room 203 has exceeded its expected
consumption range.

Current: 38 kWh
Expected: 10–15 kWh

Time: 10:32 AM

[ View Room ]    [ Mark Resolved ]
```

The Alerts screen supports quick identification and management of abnormal usage.

---

# 17. Comparative Energy Rankings

This section supports the requirement for comparative rankings.

## Energy Efficiency Rankings

```text
🏆 Most Energy Efficient

1. Room 101      95 kWh
2. Room 104     102 kWh
3. Room 205     110 kWh
```

## High Consumption Areas

```text
⚠ Requires Attention

1. Room 203     210 kWh
2. Room 302     195 kWh
3. Room 107     180 kWh
```

The ranking can compare rooms based on:

- Total energy consumption
- Consumption relative to expected levels
- Energy efficiency score

---

# 18. Core Screen List

The final design should prioritize these screens.

## Screen 1 — Admin Energy Dashboard ⭐

Contains:

- Data source status
- Total consumption
- Current load
- Estimated cost
- Projected bill
- Active alerts
- Consumption trend
- Device-wise breakdown
- Room overview

## Screen 2 — Room-wise Monitoring

Contains:

- All monitored rooms
- Consumption
- Cost
- Trend
- Status

## Screen 3 — Room Detail ⭐

Contains:

- Consumption history
- Cost estimation
- Bill/cost projection
- Abnormal usage detection
- Energy-saving recommendation

## Screen 4 — Device-wise Monitoring

Contains:

- Device consumption
- Cost
- Contribution to total usage
- Trend

## Screen 5 — Alerts ⭐

Contains:

- Abnormal usage events
- Severity
- Expected vs actual consumption
- Resolution actions

## Screen 6 — Comparative Rankings

Contains:

- Most efficient rooms
- Highest-consuming rooms
- Comparative performance

## Screen 7 — Energy Analytics

Contains:

- Historical consumption trends
- Peak usage patterns
- Period comparison
- Device and room comparison

---

# 19. Visual Design Direction

The product should feel like a modern energy analytics platform.

## Design Characteristics

- Light neutral background
- Dark readable typography
- Soft cards
- Subtle borders
- Generous whitespace
- Clear charts
- Minimal use of color
- Strong emphasis on important metrics and anomalies

Avoid:

- Excessive gradients
- Too many colors
- Heavy shadows
- Overly decorative UI
- Too many charts on a single screen

---

# 20. Color System

The interface should remain primarily neutral.

Use semantic colors only where needed.

| State | Visual Direction |
|---|---|
| High / Critical | Red-orange |
| Warning | Amber |
| Normal | Neutral |
| Efficient | Green |
| Selected / Primary | Single consistent accent |

Status should never rely only on color; labels should also be visible.

---

# 21. Typography

Recommended font direction:

- Manrope for headings
- Inter for UI text

Suggested hierarchy:

```text
Page Title          28–32px
Section Heading     18–22px
KPI Value           28–36px
Card Title          14–16px
Body Text           14–16px
Labels              12–14px
```

---

# 22. Core UI Components

Only components needed for the project are prioritized.

```text
Sidebar Navigation
Page Header
Data Source Status Indicator
KPI Card
Energy Consumption Chart
Device Distribution Chart
Room Table
Room Card
Device Card
Anomaly Card
Recommendation Card
Alert Card
Ranking Item
Status Chip
Search Field
Filter Dropdown
Date Range Selector
Primary Action Button
Secondary Action Button
Tooltip
```

---

# 23. Primary User Journey

The most important prototype flow should demonstrate the complete value of the system.

```text
Admin Opens Dashboard
        ↓
Views Current Energy Consumption
        ↓
Identifies High Consumption Room
        ↓
Opens Room Details
        ↓
Views Consumption History
        ↓
System Detects Abnormal Usage
        ↓
Admin Understands Cost Impact
        ↓
System Shows Projected Cost / Bill
        ↓
System Provides Energy-Saving Recommendation
        ↓
Admin Takes Corrective Action
```

This flow demonstrates the complete purpose of the Smart Energy Monitor.

---

# 24. Final Dashboard Blueprint

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ⚡ EnergiQ                                     🔔        👤 Admin  │
├───────────────┬─────────────────────────────────────────────────────┤
│               │                                                     │
│ Dashboard     │ Admin Energy Overview                               │
│ Analytics     │ 🟢 Simulated IoT Data Connected                     │
│ Rooms         │                                                     │
│ Devices       │ [850 kWh] [42.6 kW] [₹6,840] [₹12,450 Projected]   │
│ Alerts        │                                                     │
│ Rankings      │ ┌───────────────────────────┐ ┌───────────────────┐ │
│               │ │ Energy Consumption        │ │ Device-wise Usage │ │
│               │ │                           │ │                   │ │
│               │ │      Trend Chart          │ │  AC / Light / Fan │ │
│               │ └───────────────────────────┘ └───────────────────┘ │
│               │                                                     │
│               │ Room Energy Overview                               │
│               │ ┌─────────────────────────────────────────────────┐ │
│               │ │ Room │ Usage │ Cost │ Trend │ Status            │ │
│               │ │ 203  │ 210   │ ₹1680│ ↑24% │ Abnormal          │ │
│               │ │ 105  │ 165   │ ₹1320│ ↑8%  │ Normal            │ │
│               │ │ 101  │ 95    │ ₹760 │ ↓12% │ Efficient         │ │
│               │ └─────────────────────────────────────────────────┘ │
└───────────────┴─────────────────────────────────────────────────────┘
```

---

# 25. Final Scope

The design directly supports the PS-07 objective through the following core capabilities:

1. **Energy Dashboard**
2. **Room-wise Consumption Tracking**
3. **Device-wise Consumption Tracking**
4. **Abnormal Usage Detection**
5. **Cost Estimation**
6. **Bill Projection**
7. **Energy-Saving Recommendations**
8. **Admin Monitoring**
9. **Comparative Rankings**
10. **Simulated or IoT Data Source Visibility**

The final product journey is:

# Monitor → Detect → Analyze → Estimate → Recommend → Act

This should remain the central principle behind every major screen and interaction in the UI.
