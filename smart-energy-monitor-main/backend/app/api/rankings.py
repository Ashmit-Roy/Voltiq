from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.energy import RankingResponse, RankingItem
from app.services.cost_engine import cost_engine

router = APIRouter(prefix="/rankings", tags=["Rankings"])

@router.get("", response_model=RankingResponse)
def get_rankings(db: Session = Depends(get_db)):
    efficient = [
        RankingItem(rank=1, room_id="ROOM-101", room_name="Room 101", consumption_kwh=95.0, cost=cost_engine.calculate_cost(95.0), score=96.5),
        RankingItem(rank=2, room_id="ROOM-104", room_name="Room 104", consumption_kwh=102.0, cost=cost_engine.calculate_cost(102.0), score=93.0),
        RankingItem(rank=3, room_id="ROOM-204", room_name="Room 204", consumption_kwh=115.0, cost=cost_engine.calculate_cost(115.0), score=88.5),
    ]

    high_consumers = [
        RankingItem(rank=1, room_id="ROOM-203", room_name="Room 203", consumption_kwh=210.0, cost=cost_engine.calculate_cost(210.0), score=42.0),
        RankingItem(rank=2, room_id="ROOM-302", room_name="Room 302", consumption_kwh=195.0, cost=cost_engine.calculate_cost(195.0), score=51.2),
        RankingItem(rank=3, room_id="ROOM-105", room_name="Room 105", consumption_kwh=165.0, cost=cost_engine.calculate_cost(165.0), score=68.0),
    ]

    return RankingResponse(efficient_rooms=efficient, high_consumers=high_consumers)
