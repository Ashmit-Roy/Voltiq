# 🚨 Plug-and-Play Anomaly Detection Engine

[![HACQUIRE Asset](https://img.shields.io/badge/HACQUIRE-Tradable%20Asset%20%232-rose)](module-manifest.json)
[![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue)](setup.py)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A high-performance, domain-agnostic anomaly detection engine for numerical time-series and real-time streaming telemetry. Evaluates incoming stream values against statistical baselines (Z-score dispersion) and customizable threshold surge rules.

---

## 📌 Problem Solved
Unexpected spikes, leakage events, sensor faults, and capacity overloads are difficult to flag without complex model training. 

This engine offers an instant, zero-training solution:
- Identifies anomalies in single stream values or batch time-series.
- Calculates statistical baseline bounds ($\mu \pm Z\sigma$), deviation percentages, and severity tags (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- Completely domain-agnostic: ideal for **Power Surges, Water Leakage, Server CPU Spikes, Traffic Congestion, and Machine Vibration Outliers**.

---

## 📦 Installation & Setup

### Option 1: Direct GitHub Install (Recommended for External Teams)
```bash
pip install git+https://github.com/your-team-name/anomaly-detection-engine.git
```

### Option 2: Local Folder Install
```bash
pip install ./anomaly-detection-engine
```

### Option 3: Copy-as-Module
Copy the `src/anomaly_detection_engine` directory directly into your project codebase.

---

## 🚀 Quick Integration Guide (3-Step Example)

### Step 1: Real-Time Single Point Evaluation (Streaming IoT)
```python
from anomaly_detection_engine import AnomalyDetector

# Initialize with desired sensitivity (Z-score multiplier)
detector = AnomalyDetector(z_score_threshold=2.0)

# Pass the incoming current value and recent history
history = [10.0, 11.2, 10.8, 12.0, 11.5, 12.4]
current_value = 38.0  # Spike event

result = detector.evaluate(current_value, history=history)

print("Is Anomaly:", result.is_anomaly)           # True
print("Status:", result.status)                   # "ABNORMAL"
print("Severity:", result.severity)               # "HIGH"
print("Observed Value:", result.actual_value)     # 38.0
print("Expected Range:", f"{result.expected_min} - {result.expected_max}")
print("Deviation:", f"+{result.deviation_percent}%")
print("Message:", result.message)
```

---

### Step 2: Batch Time-Series Evaluation (Historical Logs / CSV Data)
```python
from anomaly_detection_engine import AnomalyDetector

detector = AnomalyDetector(z_score_threshold=2.0)

# 24-hour reading series with a spike
hourly_telemetry = [
    12.0, 12.5, 11.8, 13.0, 12.2, 12.8, 13.5, 
    45.0,  # <-- Outlier
    14.0, 13.2, 12.8, 12.0
]

report = detector.evaluate_batch(hourly_telemetry, window_size=5)

print(f"Total Analyzed: {report.total_analyzed}")
print(f"Anomalies Found: {report.anomalies_detected}")
print(f"Anomaly Indices: {report.anomalous_indices}") # [7]
```

---

### Step 3: Hard-Limit Threshold Enforcement
```python
from anomaly_detection_engine import AnomalyDetector

# Configure hard safety breaker limits (e.g., maximum temperature 65°C)
detector = AnomalyDetector(max_hard_limit=65.0, min_hard_limit=10.0)

result = detector.evaluate(current_value=72.5, history=[40.0, 42.0])

print(result.is_anomaly)      # True
print(result.severity)        # "CRITICAL"
print(result.method_used)     # "rule_hard_limit"
```

---

## 📥 Generic Input Contract
- **`current_value`** (`float`): The active numerical measurement.
- **`history`** (`List[float]`): List of preceding baseline readings (e.g., past 5-20 observations).
- **`z_score_threshold`** (`float`, optional): Multiplier for standard deviation (default: `2.0`, flags top 5% outliers).

---

## 📤 Generic Output Specification (`AnomalyResult`)

```json
{
  "is_anomaly": true,
  "status": "ABNORMAL",
  "actual_value": 38.0,
  "expected_min": 10.35,
  "expected_max": 13.72,
  "deviation_percent": 192.8,
  "severity": "HIGH",
  "method_used": "statistical_z_score",
  "message": "Abnormal spike detected (+192.8% deviation from expected range 10.4-13.7)."
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
python examples/detect_demo.py
python examples/batch_timeseries_demo.py
```

---

## 📋 Module Manifest

See [`module-manifest.json`](module-manifest.json) for schema details and module metadata.
