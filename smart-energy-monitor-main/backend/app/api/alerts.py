from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.energy import Alert, Room
from app.schemas.energy import AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(status_filter: str = "ALL", db: Session = Depends(get_db)):
    query = db.query(Alert)
    if status_filter != "ALL":
        query = query.filter(Alert.status == status_filter)

    alerts = query.order_by(Alert.created_at.desc()).all()
    results = []
    for a in alerts:
        room_name = a.room.name if a.room else a.room_id
        results.append(AlertResponse(
            id=a.id,
            room_id=a.room_id,
            room_name=room_name,
            title=a.title,
            message=a.message,
            severity=a.severity,
            actual_value=a.actual_value,
            expected_range=a.expected_range,
            timestamp=a.created_at.strftime("%I:%M %p"),
            status=a.status
        ))

    return results

@router.post("/{alert_id}/resolve")
def resolve_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = "RESOLVED"
    db.commit()
    return {"status": "success", "message": f"Alert {alert_id} marked as resolved."}
