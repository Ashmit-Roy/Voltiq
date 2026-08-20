# 📈 Forecasting & Prediction Engine

[![HACQUIRE Asset](https://img.shields.io/badge/HACQUIRE-Tradable%20Asset%20%233-indigo)](module-manifest.json)
[![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue)](setup.py)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A flexible, modular time-series forecasting and trend prediction engine. Predicts next-period values, period-end cumulative totals, and growth trajectories using Linear Trend Regression, Exponential Smoothing, and Moving Averages.

---

## 📌 Problem Solved
Forecasting future demand, projecting utility bills, and detecting consumption trajectories typically requires complex time-series libraries. 

This engine provides a lightweight, instant forecasting utility:
- Calculates projected period totals (e.g. 30-day bill estimates from 7 days of telemetry).
- Predicts next-step numerical demand and classifies overall trajectory (`INCREASING`, `DECREASING`, `STABLE`).
- Offers multi-method comparison to find the best algorithm fit.
- Completely domain-agnostic: works for **Energy Consumption, Water Demand, Cloud Server Billing, Inventory Stockouts, and Network Bandwidth**.

---

## 📦 Installation & Setup

### Option 1: Direct GitHub Install (Recommended for External Teams)
```bash
pip install git+https://github.com/your-team-name/forecasting-prediction-engine.git
```

### Option 2: Local Folder Install
```bash
pip install ./forecasting-prediction-engine
```

### Option 3: Copy-as-Module
Copy the `src/forecasting_prediction_engine` directory directly into your project codebase.

---

## 🚀 Quick Integration Guide (3-Step Example)

### Step 1: 30-Day Period Demand Projection
```python
from forecasting_prediction_engine import TimeSeriesForecaster

forecaster = TimeSeriesForecaster(default_method="linear_trend")

# Past 7 days of daily readings (e.g., kWh or Gallons)
past_readings = [110.0, 115.0, 112.0, 118.0, 122.0, 120.0, 125.0]

# Project total consumption for remaining 23 days of the month
forecast = forecaster.forecast_period(past_readings, remaining_periods=23)

print("Current Total (7 Days):", forecast.current_total)              # 822.0
print("Next Day Predicted Value:", forecast.predicted_next_value)     # 127.2
print("Projected Full Month Total:", forecast.projected_period_total) # 4252.4
print("Detected Trend:", forecast.trend)                             # "INCREASING"
print("Growth Rate:", f"+{forecast.growth_rate_percent}%")
```

---

### Step 2: Multi-Method Algorithm Comparison
```python
from forecasting_prediction_engine import TimeSeriesForecaster

forecaster = TimeSeriesForecaster()

history = [50.0, 52.0, 51.5, 53.0, 55.0, 54.5, 58.0]
comparison = forecaster.compare_methods(history, remaining_periods=10)

print("Linear Trend Projection:", comparison.linear_trend.projected_period_total)
print("Moving Average Projection:", comparison.moving_average.projected_period_total)
print("Exponential Smoothing Projection:", comparison.exponential_smoothing.projected_period_total)
print("Recommended Model:", comparison.recommended_method)
```

---

### Step 3: Cost and Bill Projection Calculation
```python
# Convert projected units into estimated currency
rate_per_unit = 8.50  # ₹8.50 per unit or $/unit
estimated_bill = forecast.projected_period_total * rate_per_unit
print(f"Projected Bill: ₹{estimated_bill:,.2f}")
```

---

## 📥 Generic Input Contract
- **`historical_values`** (`List[float]`): Sequence of chronological observations.
- **`remaining_periods`** (`int`): Number of forward time intervals to project (e.g., remaining hours/days).
- **`method`** (`str`, optional): `"linear_trend"`, `"exponential_smoothing"`, or `"moving_average"`.

---

## 📤 Generic Output Specification (`ForecastResult`)

```json
{
  "current_total": 822.0,
  "predicted_next_value": 127.2,
  "projected_period_total": 4252.4,
  "trend": "INCREASING",
  "growth_rate_percent": 12.8,
  "method_used": "linear_trend_regression",
  "future_points": [127.2, 129.4, 131.6, 133.8],
  "confidence_score": 0.92
}
```

---

## 🧪 Testing & Verification

Run the test suite:
```bash
python -m unittest discover tests/
```

Run the standalone demo scripts:
```bash
python examples/forecast_demo.py
python examples/multi_method_comparison.py
```

---

## 📋 Module Manifest

See [`module-manifest.json`](module-manifest.json) for schema details and module metadata.
