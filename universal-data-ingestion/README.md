# 🔌 Universal Data Ingestion & Normalization Layer

[![HACQUIRE Asset](https://img.shields.io/badge/HACQUIRE-Tradable%20Asset%20%231-emerald)](module-manifest.json)
[![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue)](setup.py)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A standalone, plug-and-play Python ingestion and normalization engine designed to accept telemetry data from disparate sources (CSV files, JSON payloads, REST APIs, and simulated IoT streams) and standardize them into a unified, type-safe schema.

---

## 📌 Problem Solved
When building IoT, monitoring, or analytics applications, incoming telemetry arrives in inconsistent formats with differing key names (e.g., `location` vs `room_id` vs `sensor_id`, `val` vs `energy_kwh` vs `power_kw`). 

This engine eliminates custom parsing boilerplate:
- Ingests multiple source formats without writing custom validation code.
- Normalizes disparate fields into a validated Pydantic model (`StandardTelemetry`).
- Completely domain-agnostic: works for **Energy, Water Flow, Healthcare telemetry, Server load, Traffic metrics, and Agriculture sensors**.

---

## 📦 Installation & Setup

### Option 1: Direct GitHub Install (Recommended for External Teams)
```bash
pip install git+https://github.com/your-team-name/universal-data-ingestion.git
```

### Option 2: Local Folder Install
```bash
pip install ./universal-data-ingestion
```

### Option 3: Copy-as-Module
Simply copy the `src/universal_data_ingestion` directory into your project.

---

## 🚀 Quick Integration Guide (3-Step Example)

### Step 1: Normalizing a Single JSON Payload
```python
from universal_data_ingestion import DataNormalizer

normalizer = DataNormalizer()

# Accepts any dictionary or IoT sensor JSON payload
raw_data = {
    "location": "PUMP-ZONE-4",
    "device": "FLOW-METER-01",
    "value": 18.5,
    "unit": "L/min"
}

normalized = normalizer.normalize(raw_data, source_type="iot_sensor")

print(normalized.entity_id)   # "PUMP-ZONE-4"
print(normalized.source_id)   # "FLOW-METER-01"
print(normalized.value)       # 18.5
print(normalized.timestamp)   # "2026-08-21T10:30:00Z" (Auto-populated if missing)
```

---

### Step 2: Batch Array Normalization
```python
from universal_data_ingestion import DataNormalizer

normalizer = DataNormalizer()

raw_batch = [
    {"sensor_id": "TEMP-01", "room": "ROOM-101", "val": 22.4, "unit": "C"},
    {"sensor_id": "TEMP-02", "room": "ROOM-102", "val": 25.1, "unit": "C"}
]

batch_report = normalizer.normalize_batch(raw_batch)

print(f"Successfully normalized: {batch_report.successful_records}/{batch_report.total_records}")
for item in batch_report.data:
    print(f"Entity: {item.entity_id} | Metric: {item.value} {item.unit}")
```

---

### Step 3: Ingesting Raw CSV Files in One Line
```python
from universal_data_ingestion import CSVSourceParser

csv_content = """timestamp,location,device,value,unit
2026-08-21T10:00:00Z,MACHINE-A,PRESSURE-VALVE,120.5,PSI
2026-08-21T10:05:00Z,MACHINE-B,PRESSURE-VALVE,118.0,PSI
"""

result = CSVSourceParser.parse_csv_content(csv_content)

print(f"Total Ingested Records: {result.total_records}")
first_record = result.data[0]
print(first_record.entity_id, first_record.value, first_record.unit)
```

---

## 📥 Supported Input Formats & Mapping

The engine automatically parses and maps the following field aliases:

| Standard Output Field | Accepted Input Aliases |
|---|---|
| `entity_id` | `entity_id`, `location`, `room_id`, `room`, `machine_id`, `patient_id` |
| `source_id` | `source_id`, `device`, `device_id`, `sensor_id`, `channel` |
| `value` | `value`, `val`, `energy_kwh`, `power_kw`, `reading`, `metric_val` |
| `unit` | `unit`, `metric_unit`, `uom` |
| `timestamp` | `timestamp`, `time`, `datetime`, `ts` (auto-generates UTC if missing) |

---

## 📤 Output Specification (`StandardTelemetry`)

```json
{
  "timestamp": "2026-08-21T10:30:00Z",
  "entity_id": "PUMP-ZONE-4",
  "source_id": "FLOW-METER-01",
  "metric_type": "energy",
  "value": 18.5,
  "unit": "L/min",
  "source_type": "iot_sensor",
  "metadata": {}
}
```

---

## 🧪 Testing & Verification

Run the test suite to verify module compatibility:
```bash
python -m unittest discover tests/
```

Run the standalone quickstart demo:
```bash
python examples/quickstart.py
```

---

## 📋 Module Manifest

See [`module-manifest.json`](module-manifest.json) for machine-readable asset declarations, input/output schemas, and integration capabilities.
