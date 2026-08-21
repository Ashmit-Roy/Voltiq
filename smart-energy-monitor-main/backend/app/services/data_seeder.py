from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from app.models.energy import Room, Device, EnergyReading, AnomalyEvent, Alert, Recommendation, SystemConfig
from app.services.cost_engine import cost_engine

def seed_database(db: Session, force_reset: bool = False):
    random.seed(42)  # Deterministic seed for reproducible baseline figures

    if force_reset:
        db.query(Alert).delete()
        db.query(AnomalyEvent).delete()
        db.query(Recommendation).delete()
        db.query(EnergyReading).delete()
        db.query(Device).delete()
        db.query(Room).delete()
        db.query(SystemConfig).delete()
        db.commit()
    elif db.query(Room).first():
        return

    # 1. System Configuration
    db.add(SystemConfig(key="rate_per_kwh", value="8.0"))
    db.add(SystemConfig(key="budget_limit", value="200000.0"))
    db.add(SystemConfig(key="source_mode", value="simulated_iot"))
    db.commit()

    # 2. Rooms (Block B Hostel Campus)
    rooms_data = [
        {"id": "ROOM-101", "name": "Room 101", "floor": "1st Floor", "status": "efficient"},
        {"id": "ROOM-104", "name": "Room 104", "floor": "1st Floor", "status": "efficient"},
        {"id": "ROOM-105", "name": "Room 105", "floor": "1st Floor", "status": "normal"},
        {"id": "ROOM-203", "name": "Room 203", "floor": "2nd Floor", "status": "abnormal"},
        {"id": "ROOM-204", "name": "Room 204", "floor": "2nd Floor", "status": "normal"},
        {"id": "ROOM-301", "name": "Room 301", "floor": "3rd Floor", "status": "normal"},
        {"id": "ROOM-302", "name": "Room 302", "floor": "3rd Floor", "status": "high"},
    ]

    for r in rooms_data:
        db.add(Room(**r))
    db.commit()

    # 3. Devices
    devices_data = [
        {"id": "DEV-AC-101", "name": "Room 101 Inverter AC", "category": "Air Conditioner", "room_id": "ROOM-101", "nominal_power_w": 1200, "status": "normal"},
        {"id": "DEV-LT-101", "name": "Room 101 Smart LED", "category": "Lighting", "room_id": "ROOM-101", "nominal_power_w": 40, "status": "normal"},
        {"id": "DEV-FN-101", "name": "Room 101 BLDC Fan", "category": "Fan", "room_id": "ROOM-101", "nominal_power_w": 35, "status": "normal"},

        {"id": "DEV-AC-104", "name": "Room 104 Inverter AC", "category": "Air Conditioner", "room_id": "ROOM-104", "nominal_power_w": 1200, "status": "normal"},
        {"id": "DEV-AC-105", "name": "Room 105 Standard AC", "category": "Air Conditioner", "room_id": "ROOM-105", "nominal_power_w": 1500, "status": "normal"},
        
        {"id": "DEV-AC-203", "name": "Room 203 Heavy Duty AC", "category": "Air Conditioner", "room_id": "ROOM-203", "nominal_power_w": 2200, "status": "high"},
        {"id": "DEV-CP-203", "name": "Room 203 Gaming PC Rig", "category": "Computer", "room_id": "ROOM-203", "nominal_power_w": 650, "status": "high"},
        
        {"id": "DEV-AC-204", "name": "Room 204 Standard AC", "category": "Air Conditioner", "room_id": "ROOM-204", "nominal_power_w": 1500, "status": "normal"},
        {"id": "DEV-AC-301", "name": "Room 301 Inverter AC", "category": "Air Conditioner", "room_id": "ROOM-301", "nominal_power_w": 1400, "status": "normal"},
        {"id": "DEV-AC-302", "name": "Room 302 Dual AC Unit", "category": "Air Conditioner", "room_id": "ROOM-302", "nominal_power_w": 1800, "status": "high"},
    ]

    for d in devices_data:
        db.add(Device(**d))
    db.commit()

    # 4. Generate Deterministic 7-Day Baseline Readings
    now = datetime.utcnow()
    readings = []

    room_profiles = {
        "ROOM-101": (3.2, 4.8, "DEV-AC-101"),
        "ROOM-104": (3.6, 5.2, "DEV-AC-104"),
        "ROOM-105": (5.4, 7.2, "DEV-AC-105"),
        "ROOM-203": (9.5, 14.2, "DEV-AC-203"), # High load room
        "ROOM-204": (4.2, 5.8, "DEV-AC-204"),
        "ROOM-301": (4.8, 6.4, "DEV-AC-301"),
        "ROOM-302": (7.2, 9.6, "DEV-AC-302"),
    }

    for day_offset in range(7, 0, -1):
        for hour in range(0, 24, 2):
            reading_time = now - timedelta(days=day_offset, hours=24 - hour)
            is_night = (hour <= 6 or hour >= 22)

            for room_id, (min_kwh, max_kwh, dev_id) in room_profiles.items():
                if room_id == "ROOM-203" and is_night:
                    val = round(random.uniform(11.0, 16.0), 2)
                else:
                    val = round(random.uniform(min_kwh, max_kwh), 2)

                readings.append(EnergyReading(
                    timestamp=reading_time,
                    room_id=room_id,
                    device_id=dev_id,
                    energy_kwh=val,
                    power_kw=round(val * 0.85, 2),
                    source="simulated_iot"
                ))

    db.bulk_save_objects(readings)
    db.commit()

    # 5. Demonstration Anomaly for Room 203
    anomaly_event = AnomalyEvent(
        timestamp=now - timedelta(minutes=15),
        room_id="ROOM-203",
        device_id="DEV-AC-203",
        actual_value=48.5,
        expected_min=10.0,
        expected_max=15.0,
        deviation_percent=153.0,
        severity="HIGH",
        status="ACTIVE"
    )
    db.add(anomaly_event)

    # 6. Initial Alerts
    alerts = [
        Alert(
            id="ALT-203",
            room_id="ROOM-203",
            title="Overnight AC Power Surge",
            message="Room 203 exceeded expected baseline (10-15 kWh) reaching 48.5 kWh (+153% deviation).",
            severity="HIGH",
            actual_value=48.5,
            expected_range="10 - 15 kWh",
            created_at=now - timedelta(minutes=14),
            status="ACTIVE"
        ),
        Alert(
            id="ALT-302",
            room_id="ROOM-302",
            title="Sustained High Demand Load",
            message="Room 302 current load operating near capacity for 4+ consecutive hours.",
            severity="MEDIUM",
            actual_value=26.4,
            expected_range="14 - 18 kWh",
            created_at=now - timedelta(hours=2),
            status="ACTIVE"
        ),
        Alert(
            id="ALT-105",
            room_id="ROOM-105",
            title="Standby Idle Draw Alert",
            message="Minor standby power leakage during unoccupied hours.",
            severity="LOW",
            actual_value=2.4,
            expected_range="0.5 - 1.0 kWh",
            created_at=now - timedelta(hours=8),
            status="RESOLVED"
        )
    ]
    for a in alerts:
        db.add(a)

    # 7. AI Recommendations
    recomms = [
        Recommendation(
            id="REC-203",
            room_id="ROOM-203",
            title="Continuous Overnight AC Over-cooling in Room 203",
            description="Room 203 maintains continuous 18°C AC cooling between 12:00 AM and 05:30 AM while ambient temperature is 24°C.",
            suggested_action="Configure automated thermostat setback to 24°C after 1:00 AM.",
            potential_savings="₹3,200 / month",
            severity="WARNING",
            created_at=now - timedelta(minutes=10)
        ),
        Recommendation(
            id="REC-302",
            room_id="ROOM-302",
            title="Peak Demand Tariff Shifting for Room 302",
            description="High-wattage appliances operating concurrently during evening commercial peak hours (6 PM - 10 PM).",
            suggested_action="Stagger heavy appliance operation to off-peak hours.",
            potential_savings="₹1,850 / month",
            severity="TIP",
            created_at=now - timedelta(hours=5)
        ),
        Recommendation(
            id="REC-101",
            room_id="ROOM-101",
            title="Exemplary Energy Efficiency Benchmark",
            description="Room 101 is consuming 35% less than the hostel floor average.",
            suggested_action="Award Energy Champion recognition on the leaderboard.",
            potential_savings="Optimal Tier",
            severity="TIP",
            created_at=now - timedelta(days=1)
        )
    ]
    for rec in recomms:
        db.add(rec)

    db.commit()
