from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from typing import Dict, Any, List, Union
from app.database.session import get_db
from app.models.energy import Room, Device, EnergyReading, AnomalyEvent, Alert
from app.integrations.tradable_adapters import normalizer_adapter, anomaly_detector_adapter
from app.integrations.acquired_adapters import notification_service_adapter, recommendation_engine_adapter

router = APIRouter(prefix="/energy", tags=["Data Ingestion (Member 2 Integration)"])

@router.post("/readings")
def ingest_reading(
    payload: Union[Dict[str, Any], List[Dict[str, Any]]] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Member 2 Integration Endpoint:
    Accepts raw semi-structured IoT/API readings, passes them through the
    Tradable Universal Normalizer, evaluates them with the Anomaly Detection Engine,
    and persists them to the database.
    """
    raw_items = [payload] if isinstance(payload, dict) else payload
    processed = []
    anomalies_detected = []

    for raw in raw_items:
        # 1. Pipeline through Tradable Ingestion Adapter
        normalized = normalizer_adapter.normalize(raw, source_type="api_ingestion")

        # 2. Persist Reading
        reading = EnergyReading(
            timestamp=datetime.utcnow(),
            room_id=normalized.entity_id,
            device_id=normalized.source_id,
            energy_kwh=normalized.value,
            power_kw=round(normalized.value * 0.85, 2),
            source=normalized.source_type
        )
        db.add(reading)

        # 3. Pipeline through Tradable Anomaly Detection Adapter
        recent_readings = (
            db.query(EnergyReading.energy_kwh)
            .filter(EnergyReading.room_id == normalized.entity_id)
            .order_by(EnergyReading.timestamp.desc())
            .limit(10)
            .all()
        )
        history = [r[0] for r in recent_readings] if recent_readings else [normalized.value]

        anomaly_eval = anomaly_detector_adapter.evaluate(normalized.value, history=history)

        if anomaly_eval.is_anomaly:
            # Store anomaly
            event = AnomalyEvent(
                timestamp=datetime.utcnow(),
                room_id=normalized.entity_id,
                device_id=normalized.source_id,
                actual_value=anomaly_eval.actual_value,
                expected_min=anomaly_eval.expected_min,
                expected_max=anomaly_eval.expected_max,
                deviation_percent=anomaly_eval.deviation_percent,
                severity=anomaly_eval.severity,
                status="ACTIVE"
            )
            db.add(event)

            # Create Alert
            alert_id = f"ALT-{str(uuid.uuid4())[:6].upper()}"
            alert = Alert(
                id=alert_id,
                room_id=normalized.entity_id,
                title=f"Power Spike in {normalized.entity_id}",
                message=f"Reading {normalized.value} kWh exceeded expected baseline ({anomaly_eval.expected_min}-{anomaly_eval.expected_max} kWh).",
                severity=anomaly_eval.severity,
                actual_value=normalized.value,
                expected_range=f"{anomaly_eval.expected_min} - {anomaly_eval.expected_max} kWh",
                created_at=datetime.utcnow(),
                status="ACTIVE"
            )
            db.add(alert)

            # Trigger Acquired Notification Service
            notification_service_adapter.dispatch_alert(
                title=alert.title,
                message=alert.message,
                severity=alert.severity,
                entity_id=normalized.entity_id
            )

            anomalies_detected.append({
                "entity_id": normalized.entity_id,
                "value": normalized.value,
                "severity": anomaly_eval.severity,
                "deviation_percent": anomaly_eval.deviation_percent
            })

        processed.append({
            "entity_id": normalized.entity_id,
            "value": normalized.value,
            "unit": normalized.unit,
            "status": "stored"
        })

    db.commit()

    return {
        "status": "success",
        "total_ingested": len(processed),
        "anomalies_flagged": len(anomalies_detected),
        "records": processed,
        "anomalies": anomalies_detected
    }
