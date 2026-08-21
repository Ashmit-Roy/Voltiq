from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.schemas.energy import DeviceResponse
from app.services.cost_engine import cost_engine

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.get("", response_model=List[DeviceResponse])
def get_device_breakdown(db: Session = Depends(get_db)):
    categories = [
        {"id": "CAT-AC", "category": "Air Conditioner", "consumption_kwh": 408.0, "percentage": 48.0, "status": "high"},
        {"id": "CAT-COMP", "category": "Computers & Gaming", "consumption_kwh": 187.0, "percentage": 22.0, "status": "normal"},
        {"id": "CAT-LT", "category": "Lighting Systems", "consumption_kwh": 136.0, "percentage": 16.0, "status": "efficient"},
        {"id": "CAT-FN", "category": "Ceiling & Exhaust Fans", "consumption_kwh": 85.0, "percentage": 10.0, "status": "efficient"},
        {"id": "CAT-OTH", "category": "Other Small Appliances", "consumption_kwh": 34.0, "percentage": 4.0, "status": "normal"}
    ]

    results = []
    for c in categories:
        results.append(DeviceResponse(
            id=c["id"],
            name=c["category"],
            category=c["category"],
            consumption_kwh=c["consumption_kwh"],
            cost=cost_engine.calculate_cost(c["consumption_kwh"]),
            percentage=c["percentage"],
            status=c["status"]
        ))

    return results
