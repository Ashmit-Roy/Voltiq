from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.energy import Recommendation
from app.schemas.energy import RecommendationResponse

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("", response_model=List[RecommendationResponse])
def get_recommendations(db: Session = Depends(get_db)):
    recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).all()
    results = []
    for r in recs:
        room_name = r.room.name if r.room else r.room_id
        results.append(RecommendationResponse(
            id=r.id,
            room_id=r.room_id,
            room_name=room_name,
            title=r.title,
            description=r.description,
            suggested_action=r.suggested_action,
            potential_savings=r.potential_savings,
            severity=r.severity,
            created_at=r.created_at.strftime("%b %d, %Y")
        ))
    return results
