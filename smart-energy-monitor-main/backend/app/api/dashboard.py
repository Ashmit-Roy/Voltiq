from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database.session import get_db
from app.models.energy import Room, Device, EnergyReading, Alert
from app.schemas.energy import DashboardSummaryResponse, DataSourceStatus, DashboardTrendsResponse, TrendPoint
from app.services.cost_engine import cost_engine
from app.integrations.tradable_adapters import forecaster_adapter

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_kwh = db.query(func.sum(EnergyReading.energy_kwh)).scalar() or 850.0
    total_kwh = round(float(total_kwh), 1)

    recent_cutoff = datetime.utcnow() - timedelta(hours=2)
    current_power = db.query(func.sum(EnergyReading.power_kw)).filter(EnergyReading.timestamp >= recent_cutoff).scalar() or 42.6
    current_power = round(float(current_power), 1)

    active_alerts = db.query(Alert).filter(Alert.status == "ACTIVE").count()

    est_cost = cost_engine.calculate_cost(total_kwh)

    # Tradable Forecasting Engine integration
    past_daily_totals = [110.0, 118.0, 125.0, 115.0, 130.0, 122.0, 130.0]
    forecast = forecaster_adapter.forecast_period(past_daily_totals, remaining_periods=20)
    projected_bill = cost_engine.calculate_projected_bill(forecast.projected_period_total)

    return DashboardSummaryResponse(
        total_consumption_kwh=total_kwh,
        current_load_kw=current_power,
        estimated_cost=est_cost,
        projected_bill=projected_bill,
        active_alerts=active_alerts,
        data_source_status=DataSourceStatus(
            connected=True,
            source_type="simulated_iot",
            last_updated=datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        )
    )

@router.get("/trends", response_model=DashboardTrendsResponse)
def get_dashboard_trends(timeframe: str = "daily", db: Session = Depends(get_db)):
    points = []
    now = datetime.utcnow()

    if timeframe == "daily":
        for h in range(12):
            t = (now - timedelta(hours=(11 - h) * 2)).strftime("%I:%M %p")
            val = round(28.0 + (h * 1.8) + (8.0 if h in [4, 5, 10] else 0.0), 1)
            points.append(TrendPoint(
                timestamp=t,
                consumption_kwh=val,
                cost=cost_engine.calculate_cost(val)
            ))
    elif timeframe == "weekly":
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        for idx, d in enumerate(days):
            val = round(110.0 + (idx * 6.5) + (15.0 if idx == 5 else 0), 1)
            points.append(TrendPoint(
                timestamp=d,
                consumption_kwh=val,
                cost=cost_engine.calculate_cost(val)
            ))
    else:
        weeks = ["Week 1", "Week 2", "Week 3", "Week 4 (Proj.)"]
        vals = [720.0, 785.0, 850.0, 920.0]
        for w, v in zip(weeks, vals):
            points.append(TrendPoint(
                timestamp=w,
                consumption_kwh=v,
                cost=cost_engine.calculate_cost(v)
            ))

    return DashboardTrendsResponse(timeframe=timeframe, data=points)
