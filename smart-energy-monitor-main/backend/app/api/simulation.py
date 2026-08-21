from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from app.database.session import get_db
from app.models.energy import Room, EnergyReading, AnomalyEvent, Alert, Recommendation
from app.integrations.tradable_adapters import normalizer_adapter, anomaly_detector_adapter
from app.integrations.acquired_adapters import notification_service_adapter, recommendation_engine_adapter

router = APIRouter(prefix="/simulation", tags=["IoT Simulation"])

@router.post("/trigger-spike")
def trigger_spike_scenario(room_id: str = "ROOM-203", db: Session = Depends(get_db)):
    """Simulates a live AC spike in Room 203 triggering the entire pipeline."""
    now = datetime.utcnow()

    # 1. Ingestion & Normalization via Tradable Module #1
    raw_payload = {
        "timestamp": now.isoformat() + "Z",
        "location": room_id,
        "device": "DEV-AC-203",
        "value": 48.5,
        "unit": "kWh"
    }
    normalized = normalizer_adapter.normalize(raw_payload, source_type="simulated_iot")

    # 2. Persist Reading
    reading = EnergyReading(
        timestamp=now,
        room_id=normalized.entity_id,
        device_id=normalized.source_id,
        energy_kwh=normalized.value,
        power_kw=round(normalized.value * 0.88, 2),
        source=normalized.source_type
    )
    db.add(reading)

    # 3. Anomaly Detection via Tradable Module #2
    history_baseline = [10.5, 11.2, 12.0, 11.8, 13.0, 12.5]
    anomaly_eval = anomaly_detector_adapter.evaluate(normalized.value, history=history_baseline)

    alert_obj = None
    notification_result = None
    recomm_obj = None

    if anomaly_eval.is_anomaly:
        anomaly_event = AnomalyEvent(
            timestamp=now,
            room_id=room_id,
            device_id="DEV-AC-203",
            actual_value=anomaly_eval.actual_value,
            expected_min=anomaly_eval.expected_min,
            expected_max=anomaly_eval.expected_max,
            deviation_percent=anomaly_eval.deviation_percent,
            severity=anomaly_eval.severity,
            status="ACTIVE"
        )
        db.add(anomaly_event)

        alert_id = f"ALT-{str(uuid.uuid4())[:6].upper()}"
        alert_obj = Alert(
            id=alert_id,
            room_id=room_id,
            title=f"Critical Power Surge in {room_id}",
            message=f"Live AC spike detected: {anomaly_eval.actual_value} kWh vs expected max {anomaly_eval.expected_max} kWh (+{anomaly_eval.deviation_percent}%).",
            severity=anomaly_eval.severity,
            actual_value=anomaly_eval.actual_value,
            expected_range=f"{anomaly_eval.expected_min} - {anomaly_eval.expected_max} kWh",
            created_at=now,
            status="ACTIVE"
        )
        db.add(alert_obj)

        notification_result = notification_service_adapter.dispatch_alert(
            title=alert_obj.title,
            message=alert_obj.message,
            severity=alert_obj.severity,
            entity_id=room_id
        )

        rec_data = recommendation_engine_adapter.generate_savings_recommendation(room_id, anomaly_eval.actual_value, True)
        recomm_id = f"REC-{str(uuid.uuid4())[:6].upper()}"
        recomm_obj = Recommendation(
            id=recomm_id,
            room_id=room_id,
            title=rec_data["title"],
            description=rec_data["description"],
            suggested_action=rec_data["suggested_action"],
            potential_savings=rec_data["potential_savings"],
            severity=rec_data["severity"],
            created_at=now
        )
        db.add(recomm_obj)

        room = db.query(Room).filter(Room.id == room_id).first()
        if room:
            room.status = "abnormal"

    db.commit()

    return {
        "status": "success",
        "scenario": f"Live AC spike triggered for {room_id}",
        "normalized_reading": normalized.dict() if hasattr(normalized, "dict") else normalized.__dict__,
        "anomaly_result": anomaly_eval.dict() if hasattr(anomaly_eval, "dict") else anomaly_eval.__dict__,
        "notification_dispatched": notification_result,
        "recommendation_generated": recomm_obj.title if recomm_obj else None
    }
