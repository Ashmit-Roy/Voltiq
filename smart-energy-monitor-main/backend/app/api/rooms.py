from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.database.session import get_db
from app.models.energy import Room, Device, AnomalyEvent, Recommendation
from app.schemas.energy import RoomResponse, RoomDetailResponse, DeviceResponse, TrendPoint
from app.services.cost_engine import cost_engine

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.get("", response_model=List[RoomResponse])
def get_all_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    results = []

    room_consumption_map = {
        "ROOM-203": (210.0, 24.0, "abnormal"),
        "ROOM-302": (195.0, 18.5, "high"),
        "ROOM-105": (165.0, 8.0, "normal"),
        "ROOM-301": (140.0, 2.0, "normal"),
        "ROOM-204": (115.0, -4.5, "normal"),
        "ROOM-104": (102.0, -8.0, "efficient"),
        "ROOM-101": (95.0, -12.0, "efficient"),
    }

    for r in rooms:
        kwh, trend, status = room_consumption_map.get(r.id, (120.0, 0.0, r.status))
        results.append(RoomResponse(
            id=r.id,
            name=r.name,
            floor=r.floor,
            consumption_kwh=kwh,
            cost=cost_engine.calculate_cost(kwh),
            trend_percent=trend,
            status=status,
            current_load_kw=round(kwh * 0.04, 1)
        ))

    return results

@router.get("/{room_id}", response_model=RoomDetailResponse)
def get_room_detail(room_id: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    now = datetime.utcnow()
    history = []
    base_val = 3.5 if room_id == "ROOM-203" else 1.2
    for h in range(12):
        t = (now - timedelta(hours=(11 - h) * 2)).strftime("%I:%M %p")
        spike = 4.8 if (room_id == "ROOM-203" and h in [8, 9, 10, 11]) else 0.0
        val = round(base_val + (h * 0.1) + spike, 2)
        history.append(TrendPoint(
            timestamp=t,
            consumption_kwh=val,
            cost=cost_engine.calculate_cost(val)
        ))

    devices = db.query(Device).filter(Device.room_id == room_id).all()
    device_responses = []
    for d in devices:
        kwh = 160.0 if d.category == "Air Conditioner" and room_id == "ROOM-203" else 25.0
        device_responses.append(DeviceResponse(
            id=d.id,
            name=d.name,
            category=d.category,
            room_id=room_id,
            consumption_kwh=kwh,
            cost=cost_engine.calculate_cost(kwh),
            percentage=76.0 if d.category == "Air Conditioner" else 12.0,
            status=d.status
        ))

    anomalies = db.query(AnomalyEvent).filter(AnomalyEvent.room_id == room_id).all()
    recs = db.query(Recommendation).filter(Recommendation.room_id == room_id).all()

    total_kwh = 210.0 if room_id == "ROOM-203" else 95.0
    est_cost = cost_engine.calculate_cost(total_kwh)
    proj_cost = cost_engine.calculate_projected_bill(total_kwh * 1.6)

    return RoomDetailResponse(
        id=room.id,
        name=room.name,
        floor=room.floor,
        total_consumption_kwh=total_kwh,
        estimated_cost=est_cost,
        projected_cost=proj_cost,
        status=room.status,
        history=history,
        devices=device_responses,
        active_anomalies=[
            {
                "actual_value": a.actual_value,
                "expected_min": a.expected_min,
                "expected_max": a.expected_max,
                "deviation_percent": a.deviation_percent,
                "severity": a.severity,
                "status": a.status
            }
            for a in anomalies
        ],
        recommendations=[
            {
                "id": rec.id,
                "title": rec.title,
                "description": rec.description,
                "suggested_action": rec.suggested_action,
                "potential_savings": rec.potential_savings,
                "severity": rec.severity
            }
            for rec in recs
        ]
    )
