from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base, SessionLocal
from app.services.data_seeder import seed_database
from app.api import dashboard, rooms, devices, alerts, rankings, recommendations, simulation, ingestion

# 1. Initialize SQLite/PostgreSQL Database Tables
Base.metadata.create_all(bind=engine)

# 2. Seed Initial Demonstration Dataset
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

# 3. Create FastAPI Application
app = FastAPI(
    title="Voltiq — Smart Energy Monitor API",
    description="Backend API and Integration Layer for Smart Energy Monitor (PS-07)",
    version="1.0.0"
)

# 4. CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Register REST API Routers
API_V1_PREFIX = "/api/v1"
app.include_router(dashboard.router, prefix=API_V1_PREFIX)
app.include_router(rooms.router, prefix=API_V1_PREFIX)
app.include_router(devices.router, prefix=API_V1_PREFIX)
app.include_router(alerts.router, prefix=API_V1_PREFIX)
app.include_router(rankings.router, prefix=API_V1_PREFIX)
app.include_router(recommendations.router, prefix=API_V1_PREFIX)
app.include_router(simulation.router, prefix=API_V1_PREFIX)
app.include_router(ingestion.router, prefix=API_V1_PREFIX)

@app.get("/")
def read_root():
    return {
        "app": "Voltiq — Smart Energy Monitor API",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "integrations": {
            "universal_data_ingestion": "Connected (Tradable #1)",
            "anomaly_detection_engine": "Connected (Tradable #2)",
            "forecasting_prediction_engine": "Connected (Tradable #3)",
            "notification_service": "Connected (BUY #1)",
            "recommendation_engine": "Connected (BUY #2)"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
